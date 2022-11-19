import Variable from "../variables/Variable";
import Payload from "./Payload";

export default class PayloadJson implements Payload {

    data: any;

    constructor(data: any){
        this.data = data;
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return new Variable("payload", JSON.stringify(this.data)).resolve(variableScope).value;
    }

    toString(): string {
        return JSON.stringify(this.data);
    }

    getContentTypeHeader(): string {
        return "application/json";
    }
}