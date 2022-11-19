

import ConfigManager from "./ConfigManager";
import loadEndpoint from "../config/EndpointLoader";
import { loadEnv as loadEnvironment } from "../config/EnvironmentLoader";
import supportedResultExtractors from "../payload/SupportedPayloadExtractors";
import LRCConstants from "../LRCConstants";
import HttpMethod from "../model/HttpMethod";
import LRCConfig from "../config/LRCConfig";
import LRCLogger from "../logging/LRCLogger";
import Variable from "../variables/Variable";
import VariableMerger from "../variables/VariableMerger";
import Payload from "../payload/Payload";
import { loadPayload } from "../config/PayloadLoader";

/**
 * LRClient which executes the requests based on the passed config parameters.
 */
export default class LRClient {

    configManager =  new ConfigManager();
    config: LRCConfig = new LRCConfig();
    logger: LRCLogger = new LRCLogger();

    constructor() {
    }

    /**
     * Loads the config file
     */
    async init() {
        this.config = await this.configManager.loadConfig();
    }

    /**
     * Calls the REST endpoint defined in the file at @param path.
     * Therefore, additional variables and/or payload can be parsed here.
     * 
     * @param path Path to the endpoint that should be called
     * @param localVariables Variables to overwrite/add values to the endpoint- and environment variables
     * @param payload Path to the payload that should be used (if it's undefined, the payload path defined in the endpoint is used)
     * @returns The result of the REST call
     */
    async send(path: string, localVariables: { [key: string]: string } = {}, payload: string | undefined = undefined): Promise<any> {
        if (this.config.selectedEnvironment == null) {
            throw new Error("No environment selected!");
        }

        const env = await loadEnvironment(this.config.selectedEnvironment);
        this.logger.logEnvironment(this.config.selectedEnvironment, env);

        this.logger.nl();

        const endpoint = await loadEndpoint(path);
        this.logger.logEndpoint(path, endpoint);

        this.logger.nl();

        const variables = VariableMerger.mergeVariables(localVariables, endpoint, env);
        const headers = VariableMerger.mergeHeaders(endpoint, env);

        // Last step is to resolve the headers with the variables
        const resolvedHeaders: { [key: string]: string } = {}
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                const resolvedValue = headers[key].resolve(variables.variableStore);

                resolvedHeaders[key] = resolvedValue.value;
            }
        }
        const resolvedUrl = endpoint.url.resolve(variables.variableStore).value;

        // Now, choose the correct payload
        let chosenPayload : Payload | undefined = undefined;
        if (payload) {
            chosenPayload = await loadPayload(payload);
        } else if (endpoint.payload) {
            chosenPayload = endpoint.payload;
        }

        const body = await chosenPayload?.getBody(variables.variableStore);
        this.logger.logRequest(endpoint.method, resolvedUrl, resolvedHeaders, body);
        this.logger.nl();
        const result = await fetch(resolvedUrl, {
            method: HttpMethod[endpoint.method],
            headers: resolvedHeaders, body
        })

        const resultExtractor = supportedResultExtractors[endpoint.resultType];
        const extracted = await resultExtractor.extractResult(result);

        // Map headers back
        const responseHeaders: { [key: string]: string } = {};
        result.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        })

        this.logger.logResponse(result.status, result.statusText, responseHeaders, extracted);

        // No variable replacement for response
        return extracted.getBody({});
    }
}