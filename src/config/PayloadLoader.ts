import * as fs from "fs/promises";
import LRCConstants from "../LRCConstants";
import PayloadType from "../payload/PayloadType";
import Payload from "../payload/Payload";
import PayloadFile from "../payload/PayloadFile";
import PayloadJson from "../payload/PayloadJson";
import PayloadText from "../payload/PayloadText";

class PayloadConfig {

    payloadType: string | undefined;
    data: string | undefined;


    static toPayload(pc: PayloadConfig): Payload {
        if (!pc.data) {
            throw Error(`Payload of type ` + pc.payloadType + " needs a 'data' field!");
        }
        switch (pc.payloadType) {
            case PayloadType.APPLICATION_JSON.toString():
                return new PayloadJson(pc.data)
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

    static async fromPayload(p: Payload): Promise<PayloadConfig> {
        const pc = new PayloadConfig();
        pc.payloadType = p.getContentTypeHeader();
        pc.data = await p.getRawData(false);
        return pc;
    }

}

async function _loadPayloadConfig(payloadPath: string): Promise<PayloadConfig> {
    const data = await fs.readFile(payloadPath);
    return <PayloadConfig>JSON.parse(data.toString())
}

export async function loadPayload(payloadPath: string): Promise<Payload> {
    return PayloadConfig.toPayload(await _loadPayloadConfig(payloadPath));
}

export async function storePayload(payloadPath: string, payload: Payload) {
    // Format json because I want to read it formatted.
    await fs.writeFile(payloadPath, JSON.stringify(await PayloadConfig.fromPayload(payload), null, 4));
}
