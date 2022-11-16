import ResultExtractor from "../control/ResultExtractor";
import Variable from "../control/Variable";
import HttpMethod from "./HttpMethod";
import ResultType from "./ResultType";


export default class Endpoint {

	url: Variable;
	method: HttpMethod;
	resultType: ResultType;

	constructor(url: Variable, method: HttpMethod, resultType: ResultType){
		this.url = url;
		this.method = method;
		this.resultType = resultType;
		
	}

}

