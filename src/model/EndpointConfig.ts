import Variable from "../control/Variable";
import Endpoint from "./Endpoint";
import HttpMethod from "./HttpMethod";



export default class EndpointConfig {
    url: string = "";
	method: keyof typeof HttpMethod = "GET";

    static toEndpoint(ec: EndpointConfig): Endpoint{
        return new Endpoint(new Variable("url", ec.url), HttpMethod[ec.method]);
    }
}