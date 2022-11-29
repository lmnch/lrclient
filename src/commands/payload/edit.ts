
import { Command } from '@oclif/core';
import { loadPayload, updatePayloadData } from '../../config/PayloadLoader';
import { launchEditor } from '../../external/LaunchEditor';



export default class EditPayload extends Command {
    static description = 'Updates the current working environtment'

    static examples = [
        `<%= config.bin %> <%= command.id %>
  `,
    ]

    static flags = {}
    static args = [{ name: "payload", description: "Path to the payload definition json file", required: true }]

    async run(): Promise<void> {
        const { args, flags } = await this.parse(EditPayload);

        const payload = await loadPayload(args.payload);

        const edited : string = await launchEditor(await payload.getRawData(true));
       await updatePayloadData(args.payload, edited);
    }

}
