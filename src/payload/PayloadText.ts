import Variable from "../variables/Variable";
import Payload from "./Payload";


export default class PayloadText implements Payload {

    data: string;

    constructor(data: string) {
        this.data = data;
    }

    async getData(): Promise<string> {
        return this.data;
    }

    getRawData(formatted: boolean): Promise<string> {
        // Pure string => return unformatted
        return this.getData();
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return new Variable("payload", (await this.getData())).resolve(variableScope);
    }

    toString(): string {
        return this.data;
    }

    getContentTypeHeader(): string {
        return "application/text";
    }

}