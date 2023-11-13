const VARIABLE_PATTERN = /{{([A-Za-z]\w*)}}/gm;

/**
 * Variable
 */
export default class Variable {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    /**
     * Searches other variable keys in the value of this variable.
     *
     * @returns All keys of variables that are used in the value of this variable
     */
    getDependenciesKeys(): string[] {
        const otherVariables = [];
        let m;

        while ((m = VARIABLE_PATTERN.exec(this.value)) !== null) {
            otherVariables.push(m[1]);
        }
        return otherVariables;
    }

    /**
     * True if the variable's value does not contain any other variablekeys.
     */
    get isResolved(): boolean {
        return this.getDependenciesKeys().length === 0;
    }

    /**
     * Replaces all other variables in the value of this variable
     *
     * @param scope other variables that should be used for replacement.
     * @returns copy of the variable but with resolved value
     */
    resolve(scope: { [key: string]: Variable }): Variable {
        if (this.isResolved) {
            // return a copy to not work on reference
            return new Variable(this.key, this.value);
        }

        // replace first "layer"
        let newValue = this.value;
        for (const key of this.getDependenciesKeys()) {
            if (!scope[key]) {
                throw new Error("Variable " + key + " not defined in scope!");
            }
            const resolution = scope[key];
            newValue = newValue.replace("{{" + key + "}}", resolution.value);
        }

        // Nothing could be replaced => all variables are unresolvable
        if (newValue === this.value) {
            throw new Error(
                `Variables ${this.getDependenciesKeys().join(",")} in ${
                    this.key
                } could not be resolved.`
            );
        }

        // resolve next layers
        return new Variable(this.key, newValue).resolve(scope);
    }
}
