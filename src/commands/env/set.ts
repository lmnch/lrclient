import * as fs from 'fs';
import {Command} from '@oclif/core'
import { loadConfig, storeConfig } from '../../control/ConfigManager';

export default class SetEnvironment extends Command {
  static description = 'Updates the current working environtment'

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ]

  static configFile = ".config";

  static flags = {}

  static args = [{name: "environment", description: "Name of the environment file in 'environments' directory.", required: true}]

  async run(): Promise<void> {
	  const {args, flags} = await this.parse(SetEnvironment);

    console.debug("Loading config...")
    const config = await loadConfig();
    console.debug("Loaded config.")
    config.selectedEnvironment = args.environment;
    console.debug("Storing config...")
    await storeConfig(config);
    console.log("Updated config ⚙️");

 }

}
