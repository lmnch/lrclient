import Payload from "./Payload";
import * as fs from "fs/promises";
import Variable from "../variables/Variable";
import PayloadType from "../model/PayloadType";

export default class PayloadFile implements Payload {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    setRawData(rawData: string): void {
        this.path = rawData;
    }

    async getData(): Promise<string> {
        return this.path;
    }

    getRawData(formatted: boolean): Promise<string> {
        // Pure string => return unformatted
        return this.getData();
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        // Resolve variables in path
        return fs.readFile(new Variable("payloaPath", (await this.getData())).resolve(variableScope).value, {});
    }

    toString(): string {
        return `[FILE] ${this.path}`;
    }

    getContentTypeHeader(): PayloadType {
        return PayloadType.APPLICATION_OCTET_STREAM;
    }
}