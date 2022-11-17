import Variable from "../variables/Variable";
import Payload from "./Payload";


export default class PayloadText implements Payload {

    data: Variable;

    constructor(data: string) {
        this.data = new Variable("payload", data);
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return this.data.resolve(variableScope).value;
    }

    toString(): string {
        return this.data.value;
    }
}