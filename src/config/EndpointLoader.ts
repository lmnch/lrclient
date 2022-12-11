import LRCConstants from "../LRCConstants";
import Endpoint from "../model/Endpoint";
import * as fs from 'fs/promises';
import HttpMethod from "../model/HttpMethod";
import PayloadType from "../model/PayloadType";
import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import { loadPayload } from "./PayloadLoader";

class EndpointConfig {
    url: string = "";
    method: keyof typeof HttpMethod = "GET";

    headers: { [name: string]: string } = {};
    variables: { [key: string]: string } = {};

    payload: string | undefined;

    static _mapHeaders(headers: { [name: string]: string }): { [key: string]: Variable } {
        const mapped: { [key: string]: Variable } = {};
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                const value = headers[key];

                mapped[key] = new Variable(key, value);
            }
        }
        return mapped;
    }

    static async toEndpoint(ec: EndpointConfig): Promise<Endpoint> {
        const method = ec.method ? HttpMethod[ec.method] : HttpMethod.GET;
        let payload = undefined;
        if(ec.payload){
            payload = await loadPayload(ec.payload);
        }
        return new Endpoint(new Variable("url", ec.url), method, EndpointConfig._mapHeaders(ec.headers), new VariableManager(ec.variables), payload);
    }
}

/**
 * Loads an endpoint from disk.
 * 
 * @param endpointPath relative or absolute path for the endpoint
 * @returns The endpoint parsed from JSON
 */
export default async function loadEndpoint(endpointPath: string): Promise<Endpoint> {
    const data = await fs.readFile(endpointPath);
    return EndpointConfig.toEndpoint(<EndpointConfig>JSON.parse(data.toString()));
}