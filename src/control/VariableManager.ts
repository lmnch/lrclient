import Variable from "./Variable";




export default class VariableManager {


	variableStore: { [key: string]: Variable };


	constructor(scope: {[key: string]: string}) {
		this.variableStore = {};
		for (const v in scope) {
			this.variableStore[v] = new Variable(v, scope[v]);
		}
	}

	put(key: string, value: string){
		this.variableStore[key] = new Variable(key, value);
	}	

	getResolvedVariableValue(key: string): string {
		if (!this.variableStore[key]) {
			throw new Error("Variable " + key + " not found in scope!");
		}
		return this.variableStore[key].resolve(this.variableStore).value;
	}

}
