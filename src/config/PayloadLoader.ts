import * as fs from "fs/promises";
import LRCConstants from "../LRCConstants";
import PayloadType from "../model/PayloadType";
import Payload from "../payload/Payload";
import PayloadJson from "../payload/PayloadJson";

class PayloadConfig {

    payloadType: (keyof typeof PayloadType) | undefined;
    data: string | undefined;
    

    static toPayload(pc: PayloadConfig) : Payload {
        switch (pc.payloadType) {
            case PayloadType.APPLICATION_JSON.toString():
                if(!pc.data){
                    throw Error(`Payload of type `+pc.payloadType+" needs a 'data' field!");
                }
                return new PayloadJson(JSON.parse(pc.data))
            default:
                break;
        }
        throw Error(`Payload of type `+pc.payloadType+` couldn't be parsed`);
    }

}

export async function loadPayload(payloadPath: string): Promise<Payload> {
    const data = await fs.readFile(payloadPath);
    return PayloadConfig.toPayload(<PayloadConfig>JSON.parse(data.toString()));
}
