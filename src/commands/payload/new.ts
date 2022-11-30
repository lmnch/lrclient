import { CliUx, Command, Flags } from "@oclif/core";
import { storePayload } from "../../config/PayloadLoader";
import { launchEditor } from "../../external/LaunchEditor";
import LRCLogger from "../../logging/LRCLogger";
import PayloadType from "../../model/PayloadType";
import Payload from "../../payload/Payload";
import PayloadJson from "../../payload/PayloadJson";
import PayloadText from "../../payload/PayloadText";
import PayloadFile from "../../payload/PayloadFile";
import * as cliSelect from 'cli-select-2';


export default class NewPayload extends Command {
    static description = 'Creates a new payload configuration file.'

    static examples = [
        `<%= config.bin %> <%= command.id %> payloads/example.json
Which type of payload should be created?
(x) application/json
( ) application/text
( ) application/octet-stream
( ) application/pdf
*opens editor*
Type: application/json
{
    "test": 123
}
  `,
    ]

    // static flags = { "t": { name: "type", description: "The type of the newly created payload", required: false}}
    static args = [{ name: "payload", description: "Path to the payload definition json file", required: true }]
    static aliases = ["pn"]
    static flags = {
        payloadType: Flags.string({
            char: 't', description: `Type of the payload (${Object.values(PayloadType).join(", ")}) `,
            required: false, multiple: false
        })
    }

    async run(): Promise<void> {
        const { args, flags } = await this.parse(NewPayload);

        let payloadType = flags.type;

        if (!payloadType) {
            this.log("Which type of payload should be created?")
            payloadType = await (await cliSelect({ values: Object.values(PayloadType) })).value;
        }

        const newPayload: Payload = await NewPayload.readPayload(payloadType);

        await storePayload(args.payload, newPayload);

        LRCLogger.instance.logPayload(newPayload);
    }

    static async readPayload(payloadType: string): Promise<Payload> {
        switch (payloadType) {
            case PayloadType.APPLICATION_JSON:
                return new PayloadJson(await launchEditor(""));
            case PayloadType.APPLICATION_TEXT:
                return new PayloadText(await launchEditor(""));
            case PayloadType.APPLICATION_OCTET_STREAM:
            case PayloadType.APPLICATION_PDF:
                return new PayloadFile(await CliUx.ux.prompt("Path to file"));
            default:
                break;
        }
        throw new Error(`Could not read payload type ${payloadType}.`);
    }


}
