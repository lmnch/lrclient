import { Command } from "@oclif/core";
import LRClient from "../../boundary/LRClient";
import * as vm from "node:vm";
import * as fs from "fs/promises";
import LRCLoggerConfig from "../../logging/LRCLoggerConfig";
import logger = require("node-color-log");

export default class Execute extends Command {
    static description = `Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be used).`
        + `Additionally "log" can be used to log stuff like "console.log" (but this one is not working).`;

    static examples = [`<%= config.bin %> <%= command.id %> ./scripts/testscript.js
    `];

    static aliases = ["exec"]

    static args = [
        { name: 'script', description: "Path to script that should be executed", required: true }
    ]

    async run(): Promise<void> {
        const { args } = await this.parse(Execute);

        // Dependeincies
        const client = new LRClient(new LRCLoggerConfig({ logEndpoint: false, logEnvironments: false, logResponse: true, logRequest: true, logResponseBody: false }));
        await client.init();

        const script = (await fs.readFile(args.script)).toString();
        // Wrap inside of method to support await keyword
        const code = `const executionLrcMethod = async (lrc, log) => { ${script} };\nexecutionLrcMethod(lrc, log);`
        const context = { lrc: client, log: (...args: any[]) => { logger.color("green").log(...args); } };
        vm.createContext(context);
        vm.runInContext(code, context);
    }
}
