import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import HttpMethod from "./HttpMethod";
import ResultType from "./ResultType";


export default class Endpoint {

	url: Variable;
	method: HttpMethod;
	resultType: ResultType;

    headers: {[header: string]: Variable};
    variableScope: VariableManager;

	constructor(url: Variable, method: HttpMethod, resultType: ResultType, headers: {[header: string]: Variable}, variableScope: VariableManager){
		this.url = url;
		this.method = method;
		this.resultType = resultType;
		this.headers = headers;
		this.variableScope = variableScope;
	}

}

