import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";

export default class Environment {
    headers: { [header: string]: Variable };
    variableScope: VariableManager;

    constructor(headers: { [header: string]: Variable }, vm: VariableManager) {
        this.headers = headers;
        this.variableScope = vm;
    }
}
