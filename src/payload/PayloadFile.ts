import Payload from "./Payload";
import * as fs from "fs/promises";
import Variable from "../variables/Variable";
import PayloadType from "../model/PayloadType";

export default class PayloadFile implements Payload {

    payloadPath: string;

    constructor(payloadPath: string) {
        this.payloadPath = payloadPath;
    }

    setRawData(rawData: string): void {
        this.payloadPath = rawData;
    }

    async getData(): Promise<string> {
        return this.payloadPath;
    }

    getRawData(formatted: boolean): Promise<string> {
        // Pure string => return unformatted
        return this.getData();
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        // Resolve variables in payloadPath
        return fs.readFile(new Variable("payloadPath", (await this.getData())).resolve(variableScope).value, {});
    }

    toString(): string {
        return `[FILE] ${this.payloadPath}`;
    }

    getContentTypeHeader(): PayloadType {
        return PayloadType.APPLICATION_OCTET_STREAM;
    }
}