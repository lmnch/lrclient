
import { Command } from '@oclif/core';
import { loadPayload } from '../../config/PayloadLoader';
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

        console.log(await launchEditor(JSON.stringify(payload, null, 4)));
    }

}
