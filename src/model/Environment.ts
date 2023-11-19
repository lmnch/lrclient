import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import Auth from "../auth/Auth";

export default class Environment {
    headers: { [header: string]: Variable };
    variableScope: VariableManager;
    auth: Auth | undefined;

    constructor(
        headers: { [header: string]: Variable },
        vm: VariableManager,
        auth: Auth | undefined
    ) {
        this.headers = headers;
        this.variableScope = vm;
        this.auth = auth;
    }
}
