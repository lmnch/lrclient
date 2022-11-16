

import { loadConfig } from "../config/ConfigManager";
import loadEndpoint from "../config/EndpointLoader";
import { loadEnv as loadEnvironment } from "../config/EnvironmentLoader";
import supportedResultExtractors from "../payload/SupportedResultExtractors";
import LRCConstants from "../LRCConstants";
import HttpMethod from "../model/HttpMethod";
import LRCConfig from "../config/LRCConfig";
import LRCLogger from "../logging/LRCLogger";
import Variable from "../variables/Variable";
import VariableMerger from "../variables/VariableMerger";


export default class LRestClient {
    
    config: LRCConfig = new LRCConfig();
    logger: LRCLogger = new LRCLogger();

    constructor(){
    }
    
    async init(){
        this.config = await loadConfig();

        // console.log("Initialized LRestClient with:")
        // console.log(LRCConfig.toString(this.config));
    }

    async execute(path: string, localVariables: { [key: string]: string } = {}): Promise<any> {
        if (this.config.selectedEnvironment == null) {
            throw new Error("No environment selected!");
        }

        const env = await loadEnvironment(this.config.selectedEnvironment);
        this.logger.logEnvironment(this.config.selectedEnvironment, env);

        this.logger.nl();

        const endpoint = await loadEndpoint(path);
        this.logger.logEndpoint(path,endpoint);

        this.logger.nl();

        const variables = VariableMerger.mergeVariables(localVariables, endpoint, env);
        const headers = VariableMerger.mergeHeaders(endpoint, env);

        // Last step is to resolve the headers with the variables
        const resolvedHeaders: {[key: string]: string} = {}
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                const resolvedValue = headers[key].resolve(variables.variableStore);
                
                resolvedHeaders[key] = resolvedValue.value;
            }
        }
        const resolvedUrl = endpoint.url.resolve(variables.variableStore).value;

        this.logger.logRequest(endpoint.method, resolvedUrl, resolvedHeaders);
        const result = await fetch(resolvedUrl, { method: HttpMethod[endpoint.method], 
            headers: resolvedHeaders })

        const resultExtractor = supportedResultExtractors[endpoint.resultType.toString()];

        const extracted =  await resultExtractor.extractResult(result);

        console.log(JSON.stringify(extracted));

        return extracted;
    }
}