

import { loadConfig } from "../control/ConfigManager";
import loadEndpoint from "../control/EndpointLoader";
import { loadEnv as loadEnvironment } from "../control/EnvironmentLoader";
import LRCConstants from "../LRCConstants";
import HttpMethod from "../model/HttpMethod";
import LRCConfig from "../model/LRCConfig";


export default class LRestClient {
    
    config: LRCConfig = new LRCConfig();

    constructor(){
    }
    
    async init(){
        this.config = await loadConfig();

        console.log("Initialized LRestClient with:")
        console.log(LRCConfig.toString(this.config));
    }

    async execute(path: string, localVariables: { [key: string]: string } = {}): Promise<any> {
        if (this.config.selectedEnvironment == null) {
            throw new Error("No environment selected!");
        }

        const env = await loadEnvironment(this.config.selectedEnvironment);
        console.log("Executing request in environment "+this.config.selectedEnvironment);
        const variables = env.variableScope;

        // Add all local passed variables:
        for (const key in localVariables) {
            variables.put(key, localVariables[key]);
        }

        const endpoint = await loadEndpoint(path);

        const result = await fetch(endpoint.url.resolve(variables.variableStore).value, { method: HttpMethod[endpoint.method] })

        console.log(result);
        
    }
}