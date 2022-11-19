import { Command } from "@oclif/core";
import LRClient from "../../boundary/LRClient";
import * as vm from "node:vm";
import * as fs from "fs/promises";

export default class Execute extends Command {
    static description = `Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be used).`;

    static examples = [`<%= config.bin %> <%= command.id %> ./scripts/testscript.js
    `];

    static args = [
        { name: 'script', description: "Path to script that should be executed", required: true }
    ]

    async run(): Promise<void> {
        const { args } = await this.parse(Execute);

        // Dependeincies
        const client = new LRClient();
        await client.init();

        const script = (await fs.readFile(args.script)).toString();
        // Wrap inside of method to support await keyword
        const code = `const executionLrcMethod = async (lrc) => { ${script} };\nexecutionLrcMethod(lrc);` 
        const context = {lrc: client};
        vm.createContext(context);
        vm.runInContext(code, context);
    }
}
