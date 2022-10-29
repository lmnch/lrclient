import VariableManager from "../control/VariableManager";
import Environment from "./Environment";


/**
 * Basic env config that can be parsed from json string
 */
export default class EnvironmentConfig {

	headers: { [name: string] : string } = {};

	variables: { [key: string]: string} = {};


	static toEnvironment(ec:EnvironmentConfig): Environment{
		return new Environment(ec.headers, new VariableManager(ec.variables));
	}

}


