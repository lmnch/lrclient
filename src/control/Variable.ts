
const VARIABLE_PATTERN = /{{([A-Za-z]\w*)}}/gm;;


export default class Variable {

    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    getDependenciesKeys(): string[] {
        const otherVariables = [];
        let m;

        while ((m = VARIABLE_PATTERN.exec(this.value)) !== null) {
            otherVariables.push(m[1]);
        }
        return otherVariables;
    }

    get isResolved(): boolean {
        return this.getDependenciesKeys().length === 0;
    }

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

        // resolve next layers
        return new Variable(this.key, newValue).resolve(scope);
    }
}
