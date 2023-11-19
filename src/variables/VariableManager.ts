import Variable from "./Variable";

/**
 * Contains a variable map and converts a map<string, string> to a map<string, variable>
 */
export default class VariableManager {
    variableStore: { [key: string]: Variable };

    constructor(scope: { [key: string]: string }) {
        this.variableStore = {};
        for (const v in scope) {
            this.variableStore[v] = new Variable(v, scope[v]);
        }
    }

    put(key: string, value: string) {
        this.variableStore[key] = new Variable(key, value);
    }
}
