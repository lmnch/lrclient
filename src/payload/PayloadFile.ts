import Payload from "./Payload";
import * as fs from "fs/promises";
import Variable from "../variables/Variable";

export default class PayloadFile implements Payload {

    path: Variable;

    constructor(path: string) {
        this.path = new Variable("payloadPath", path);
    }

    async getData(): Promise<any> {
        return this.path;
    }
    
    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        // Resolve variables in path
        return fs.readFile((await this.getData()).resolve(variableScope).value, {});
    }

    toString(): string {
        return `[FILE] ${this.path.value}`;
    }

    getContentTypeHeader(): string {
        return "application/octet-stream";
    }
}