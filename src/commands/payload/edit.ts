
import { Command } from '@oclif/core';
import { loadPayload, storePayload } from '../../config/PayloadLoader';
import { launchEditor } from '../../external/LaunchEditor';
import LRCLogger from '../../logging/LRCLogger';



export default class EditPayload extends Command {
    static description = 'Updates the current working environtment'

    static examples = [
        `<%= config.bin %> <%= command.id %> payloads/example.json
*opens editor*
Type: application/json
{
    "test": 123
}
  `,
    ]

    static flags = {}
    static args = [{ name: "payload", description: "Path to the payload definition json file", required: true }]
    static aliases = ["pe"]

    async run(): Promise<void> {
        const { args, flags } = await this.parse(EditPayload);

        const payload = await loadPayload(args.payload);

        const edited : string = await launchEditor(await payload.getRawData(true));

        payload.setRawData(edited);
        await storePayload(args.payload, payload);

        LRCLogger.instance.logPayload(payload);
    }

}
