import Variable from "../variables/Variable";
import Payload from "./Payload";


export default class PayloadText implements Payload {

    data: Variable;

    constructor(data: string) {
        this.data = new Variable("payload", data);
    }

    async getData(): Promise<Variable> {
        return this.data;
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return (await this.getData()).resolve(variableScope);
    }

    toString(): string {
        return this.data.value;
    }

    getContentTypeHeader(): string {
        return "application/text";
    }

}