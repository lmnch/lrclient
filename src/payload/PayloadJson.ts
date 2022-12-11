import PayloadType from "./PayloadType";
import Variable from "../variables/Variable";
import Payload from "./Payload";

export default class PayloadJson implements Payload {

    data: any;

    constructor(data: string){
        this.setRawData(data);
    }

    setRawData(rawData: string): void {
        this.data = JSON.parse(rawData);
    }

    async getData(): Promise<any> {
        return this.data;
    }

    async getRawData(formatted: boolean = false): Promise<string> {
        if(formatted){
            return JSON.stringify(this.data, null, 4);
        }
        return JSON.stringify(this.data)
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<string> {
        return new Variable("payload", JSON.stringify(await this.getData())).resolve(variableScope).value;
    }

    toString(): string {
        return JSON.stringify(this.data);
    }

    getContentTypeHeader(): PayloadType {
        return PayloadType.APPLICATION_JSON;
    }
}