import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import Environment from "../model/Environment";


/**
 * Basic env config that can be parsed from json string
 */
export default class EnvironmentConfig {

	headers: { [name: string] : string } = {};

	variables: { [key: string]: string} = {};

	static _mapHeaders(headers: { [name: string] : string }): {[key: string]: Variable} {
		const mapped : {[key: string]: Variable} = {};
		for (const key in headers) {
			if (Object.prototype.hasOwnProperty.call(headers, key)) {
				const value = headers[key];
				
				mapped[key] = new Variable(key, value);
			}
		}
		return mapped;
	}

	static toEnvironment(ec:EnvironmentConfig): Environment{
		return new Environment(EnvironmentConfig._mapHeaders(ec.headers), new VariableManager(ec.variables));
	}

}


