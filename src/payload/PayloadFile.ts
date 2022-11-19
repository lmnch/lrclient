import Payload from "./Payload";
import * as fs from "fs";
import Variable from "../variables/Variable";

export default class PayloadFile implements Payload {

    path: Variable;

    constructor(path: string){
        this.path = new Variable("payloadPath", path);
    }

    async getBody(variableScope: { [key: string]: Variable }): Promise<any> {
        return new Promise((res, rej)=>{

            // Resolve variables in path
            const resolvedPath = this.path.resolve(variableScope);

            fs.readFile(resolvedPath.value, {}, (err, data)=>{
                if(err){
                    rej(err);
                }else{
                    res(data);
                }
            })
        })
    }

    toString(): string {
        return `[FILE] ${this.path}`;
    }

    getContentTypeHeader(): string {
        return "application/octet-stream";
    }
}