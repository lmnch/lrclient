import Variable from "../control/Variable";
import Endpoint from "../model/Endpoint";
import HttpMethod from "../model/HttpMethod";
import ResultType from "../model/ResultType";

export default class EndpointConfig {
    url: string = "";
	method: keyof typeof HttpMethod = "GET";
    resultType: keyof typeof ResultType = "APPLICATION_JSON";

    static toEndpoint(ec: EndpointConfig): Endpoint {
        const method = ec.method?HttpMethod[ec.method]: HttpMethod.GET;
        const resultType = ec.resultType?ResultType[ec.resultType]: ResultType.APPLICATION_JSON;
        return new Endpoint(new Variable("url", ec.url), method, resultType);
    }
}