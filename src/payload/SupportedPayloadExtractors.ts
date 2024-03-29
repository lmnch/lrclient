import PayloadType from "../model/PayloadType";
import Payload from "./Payload";
import PayloadExtractor from "./PayloadExtractor";
import PayloadFile from "./PayloadFile";
import PayloadJson from "./PayloadJson";
import PayloadText from "./PayloadText";
import * as fs from "fs";
import LRCConstants from "../LRCConstants";

class JsonPayloadExtractor extends PayloadExtractor {
    canHandle(contentType: string | null): boolean {
        return contentType
            ? contentType.startsWith(PayloadType.APPLICATION_JSON.toString())
            : false;
    }

    async extractResult(response: Response): Promise<Payload> {
        return new PayloadJson(await response.text());
    }
}

const pipeFile = new WritableStream({
    write(chunk) {
        fs.createWriteStream(LRCConstants.TEMP_DOWNLOAD_FILE).write(chunk);
    },
});

class FilePayloadExtractor extends PayloadExtractor {
    canHandle(contentType: string | null): boolean {
        return (
            contentType != null &&
            [
                PayloadType.APPLICATION_OCTET_STREAM.toString(),
                PayloadType.APPLICATION_PDF.toString(),
            ].includes(contentType)
        );
    }
    async extractResult(response: Response): Promise<PayloadFile> {
        const body = response.body;
        body?.pipeTo(pipeFile);
        return new PayloadFile(LRCConstants.TEMP_DOWNLOAD_FILE);
    }
}

class TextPayloadExtractor extends PayloadExtractor {
    canHandle(): boolean {
        return true;
    }
    async extractResult(arg0: Response): Promise<Payload> {
        return new PayloadText(await arg0.text());
    }
}

const payloadExtractor: PayloadExtractor = new JsonPayloadExtractor();
payloadExtractor.successor = new FilePayloadExtractor();
payloadExtractor.successor.successor = new TextPayloadExtractor();

/**
 * Contains extractors for different PayloadTypes
 */
export default payloadExtractor;
