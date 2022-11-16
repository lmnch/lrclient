import * as fs from 'fs';
import { Command } from '@oclif/core'
import { loadConfig, storeConfig } from '../../control/ConfigManager';
import { loadEnv } from '../../control/EnvironmentLoader';

export default class GetEnvironment extends Command {
  static description = 'Returns the name of the currently selected environment.'

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ]

  static configFile = ".config";

  static flags = {}

  static args = []

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GetEnvironment);

    // console.debug("Loading config...")
    const config = await loadConfig();
    // console.debug("Loaded config.")
    console.log(`${config.selectedEnvironment}`);
    console.log();
    if (config.selectedEnvironment) {
      const env = await loadEnv(config.selectedEnvironment);
      console.log(env.toString());
    }

    console.log();
  }

}
