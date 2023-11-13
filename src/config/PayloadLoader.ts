import * as fs from "fs/promises";
import { sep } from "path";
import PayloadType from "../model/PayloadType";
import {
    ConfiguredPayload,
    ConfiguredPayloadFile,
    ConfiguredPayloadJson,
    ConfiguredPayloadText,
} from "../payload/ConfiguredPayloads";
import Payload from "../payload/Payload";

class PayloadConfig {
    payloadType: string | undefined;
    data: string | undefined;

    static toPayload(path: string, pc: PayloadConfig): ConfiguredPayload {
        if (!pc.data) {
            throw Error(
                "Payload of type " + pc.payloadType + " needs a 'data' field!"
            );
        }
        switch (pc.payloadType) {
        case PayloadType.APPLICATION_JSON.toString():
            return new ConfiguredPayloadJson(path, pc.data);
        case PayloadType.APPLICATION_TEXT.toString():
            return new ConfiguredPayloadText(path, pc.data);
        case PayloadType.APPLICATION_OCTET_STREAM.toString():
        case PayloadType.APPLICATION_PDF.toString():
            return new ConfiguredPayloadFile(path, pc.data);
        default:
            break;
        }
        throw Error("Payload of type " + pc.payloadType + " couldn't be parsed");
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
    return <PayloadConfig>JSON.parse(data.toString());
}

export async function loadPayload(
    payloadPath: string
): Promise<ConfiguredPayload> {
    return PayloadConfig.toPayload(
        payloadPath,
        await _loadPayloadConfig(payloadPath)
    );
}

export async function storePayload(payloadPath: string, payload: Payload) {
    const pathParts = payloadPath.split(sep);

    if (pathParts.length > 1) {
        // Try to create missing directories
        await fs.mkdir(pathParts.slice(0, pathParts.length - 1).join(sep), {
            recursive: true,
        });
    }

    // Format json because I want to read it formatted.
    await fs.writeFile(
        payloadPath,
        JSON.stringify(await PayloadConfig.fromPayload(payload), null, 4)
    );
}
