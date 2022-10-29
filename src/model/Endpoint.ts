import Variable from "../control/Variable";
import HttpMethod from "./HttpMethod";


export default class Endpoint {

	url: Variable;
	method: HttpMethod;


	constructor(url: Variable, method: HttpMethod){
		this.url = url;
		this.method = method;
	}

}

