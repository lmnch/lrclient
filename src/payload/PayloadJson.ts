import Variable from "../variables/Variable";
import Payload from "./Payload";

export default class PayloadJson implements Payload {

    data: any;

    constructor(data: any){
        this.data = data;
    }

    async getData(): Promise<Variable> {
        return new Variable("payload", JSON.stringify(this.data));
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<string> {
        return (await this.getData()).resolve(variableScope).value;
    }

    toString(): string {
        return JSON.stringify(this.data);
    }

    getContentTypeHeader(): string {
        return "application/json";
    }
}