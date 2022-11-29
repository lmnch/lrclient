import * as fs from "fs/promises";
import LRCConstants from "../LRCConstants";
import PayloadType from "../model/PayloadType";
import Payload from "../payload/Payload";
import PayloadFile from "../payload/PayloadFile";
import PayloadJson from "../payload/PayloadJson";
import PayloadText from "../payload/PayloadText";

class PayloadConfig {

    payloadType: (keyof typeof PayloadType) | undefined;
    data: string | undefined;


    static toPayload(pc: PayloadConfig): Payload {
        if (!pc.data) {
            throw Error(`Payload of type ` + pc.payloadType + " needs a 'data' field!");
        }
        switch (pc.payloadType) {
            case PayloadType.APPLICATION_JSON.toString():
                return new PayloadJson(JSON.parse(pc.data))
            case PayloadType.APPLICATION_TEXT.toString():
                return new PayloadText(pc.data);
            case PayloadType.APPLICATION_OCTET_STREAM.toString():
            case PayloadType.APPLICATION_PDF.toString():
                return new PayloadFile(pc.data);
            default:
                break;
        }
        throw Error(`Payload of type ` + pc.payloadType + ` couldn't be parsed`);
    }

}

export async function loadPayload(payloadPath: string): Promise<Payload> {
    const data = await fs.readFile(payloadPath);
    return PayloadConfig.toPayload(<PayloadConfig>JSON.parse(data.toString()));
}
