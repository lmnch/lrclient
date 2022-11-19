import { Command } from "@oclif/core";
import LRClient from "../../boundary/LRestClient";

export default class Execute extends Command {


    static args = [
        { name: 'script', description: "Path to script that should be executed", required: true }
    ]

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Execute);

        // Dependeincies
        const client = new LRClient();
        await client.init();

        const script =  (await import(args.script)).default();
        script(client);
    }
}
