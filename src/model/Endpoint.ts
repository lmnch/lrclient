import { ConfiguredPayload } from "../payload/ConfiguredPayloads";
import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import HttpMethod from "./HttpMethod";

/**
 * Endpoint definition
 */
export default class Endpoint {
    url: Variable;
    method: HttpMethod;

    headers: { [header: string]: Variable };
    variableScope: VariableManager;

    payload: ConfiguredPayload | undefined;

    constructor(
        url: Variable,
        method: HttpMethod,
        headers: { [header: string]: Variable },
        variableScope: VariableManager,
        payload: ConfiguredPayload | undefined
    ) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.variableScope = variableScope;
        this.payload = payload;
    }
}
