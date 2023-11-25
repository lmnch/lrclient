import { ConfiguredPayload } from "../payload/ConfiguredPayloads";
import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import Auth from "../auth/Auth";
import HttpMethod from "./HttpMethod";

/**
 * Endpoint definition
 */
export default class Endpoint {
    url: Variable;
    method: HttpMethod;

    headers: { [header: string]: Variable };
    variableScope: VariableManager;
    auth: Auth | undefined;

    payload: ConfiguredPayload | undefined;

    constructor(
        url: Variable,
        method: HttpMethod,
        headers: { [header: string]: Variable },
        variableScope: VariableManager,
        auth: Auth | undefined,
        payload: ConfiguredPayload | undefined
    ) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.variableScope = variableScope;
        this.auth = auth;
        this.payload = payload;
    }
}
