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

}

async function _loadPayloadConfig(payloadPath: string): Promise<PayloadConfig> {
    const data = await fs.readFile(payloadPath);
    return <PayloadConfig>JSON.parse(data.toString())
}

export async function loadPayload(payloadPath: string): Promise<Payload> {
    return PayloadConfig.toPayload(await _loadPayloadConfig(payloadPath));
}

export async function updatePayloadData(payloadPath: string, data: string) {
    const payloadConfig = await _loadPayloadConfig(payloadPath);
    payloadConfig.data = data;
    await fs.writeFile(payloadPath, JSON.stringify(payloadConfig));
}
