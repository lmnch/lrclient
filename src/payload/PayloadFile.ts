import Payload from "./Payload";
import * as fs from "fs/promises";
import Variable from "../variables/Variable";

export default class PayloadFile implements Payload {

    path: Variable;

    constructor(path: string) {
        this.path = new Variable("payloadPath", path);
    }

    async getData(variableScope: { [key: string]: Variable }): Promise<any> {
        // Resolve variables in path
        const resolvedPath = this.path.resolve(variableScope);

        return fs.readFile(resolvedPath.value, {})
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return this.getData(variableScope);
    }

    toString(): string {
        return `[FILE] ${this.path}`;
    }

    getContentTypeHeader(): string {
        return "application/octet-stream";
    }
}