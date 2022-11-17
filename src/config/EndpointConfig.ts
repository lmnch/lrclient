import Variable from "../variables/Variable";
import Endpoint from "../model/Endpoint";
import HttpMethod from "../model/HttpMethod";
import PayloadType from "../model/PayloadType";
import VariableManager from "../variables/VariableManager";
import { loadPayload } from "./PayloadLoader";

export default class EndpointConfig {
    url: string = "";
    method: keyof typeof HttpMethod = "GET";
    accept: keyof typeof PayloadType = "APPLICATION_JSON";

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
        const accept = ec.accept ? PayloadType[ec.accept] : PayloadType.APPLICATION_JSON;
        let payload = undefined;
        if(ec.payload){
            payload = await loadPayload(ec.payload);
        }
        return new Endpoint(new Variable("url", ec.url), method, accept, EndpointConfig._mapHeaders(ec.headers), new VariableManager(ec.variables), payload);
    }
}