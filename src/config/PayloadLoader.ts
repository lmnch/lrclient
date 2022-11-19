import * as fs from "fs/promises";
import LRCConstants from "../LRCConstants";
import Payload from "../payload/Payload";
import PayloadConfig from "./PayloadConfig";

export async function loadPayload(payloadPath: string): Promise<Payload> {
    const data = await fs.readFile(payloadPath);
    return PayloadConfig.toPayload(<PayloadConfig>JSON.parse(data.toString()));
}
