import internal = require("stream");
import { threadId } from "worker_threads";
import Payload from "../payload/Payload";
import PayloadText from "../payload/PayloadText";
import payloadExtractor from "../payload/SupportedPayloadExtractors";


/**
 * Response wrapper 
 */
export default class LRCResponse {

    response: Response;
    status: number;
    statusText: string;
    headers: { [key: string]: string };
    _extractedPayload: Payload|null|undefined = undefined;

    constructor(response: Response) {
        this.response = response;
        this.status = response.status;
        this.statusText = response.statusText;

        // Map headers back
        this.headers = {};
        response.headers.forEach((value, key) => {
            this.headers[key] = value;
        })
    }

    async extractPayload(): Promise<Payload|null> {        
        if(this._extractedPayload!==undefined){
            return this._extractedPayload;
        }
        try {
            this._extractedPayload = await payloadExtractor.extractIfPossible(this.response);
        } catch (e) {
            throw e;
        }
        return this._extractedPayload;
    }
}

