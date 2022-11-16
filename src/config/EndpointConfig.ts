import Variable from "../variables/Variable";
import Endpoint from "../model/Endpoint";
import HttpMethod from "../model/HttpMethod";
import ResultType from "../model/ResultType";
import VariableManager from "../variables/VariableManager";

export default class EndpointConfig {
    url: string = "";
    method: keyof typeof HttpMethod = "GET";
    resultType: keyof typeof ResultType = "APPLICATION_JSON";

    headers: { [name: string]: string } = {};
    variables: { [key: string]: string } = {};

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

    static toEndpoint(ec: EndpointConfig): Endpoint {
        const method = ec.method ? HttpMethod[ec.method] : HttpMethod.GET;
        const resultType = ec.resultType ? ResultType[ec.resultType] : ResultType.APPLICATION_JSON;
        return new Endpoint(new Variable("url", ec.url), method, resultType, EndpointConfig._mapHeaders(ec.headers), new VariableManager(ec.variables));
    }
}