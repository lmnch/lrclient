import Variable from "../variables/Variable";
import Payload from "./Payload";


export default class PayloadText implements Payload {

    data: Variable;

    constructor(data: string) {
        this.data = new Variable("payload", data);
    }

    async getData(variableScope: { [key: string]: Variable; }): Promise<string> {
        return this.data.resolve(variableScope).value;
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return this.getData(variableScope);
    }

    toString(): string {
        return this.data.value;
    }

    getContentTypeHeader(): string {
        return "application/text";
    }

}