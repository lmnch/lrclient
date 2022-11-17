import Payload from "../payload/Payload";
import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import HttpMethod from "./HttpMethod";
import PayloadType from "./PayloadType";


export default class Endpoint {

	url: Variable;
	method: HttpMethod;
	resultType: PayloadType;

	headers: { [header: string]: Variable };
	variableScope: VariableManager;

	payload: Payload | undefined;

	constructor(url: Variable, method: HttpMethod, resultType: PayloadType, headers: { [header: string]: Variable }, variableScope: VariableManager, payload: Payload | undefined) {
		this.url = url;
		this.method = method;
		this.resultType = resultType;
		this.headers = headers;
		this.variableScope = variableScope;
		this.payload = payload;
	}

}

