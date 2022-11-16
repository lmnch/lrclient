import * as fs from 'fs';
import { Command } from '@oclif/core'
import { loadConfig, storeConfig } from '../../config/ConfigManager';
import LRCLogger from '../../logging/LRCLogger';
import { loadEnv } from '../../config/EnvironmentLoader';

export default class SetEnvironment extends Command {
  static description = 'Updates the current working environtment'

  static examples = [
    `<%= config.bin %> <%= command.id %>
production
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.github.com
user=lmnch
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}
Updated config ⚙️
`,
  ]

  static configFile = ".config";

  static flags = {}

  static args = [{ name: "environment", description: "Name of the environment file in 'environments' directory.", required: true }]

  static logger = new LRCLogger();

  async run(): Promise<void> {
    const { args, flags } = await this.parse(SetEnvironment);

    // console.debug("Loading config...")
    const config = await loadConfig();
    // console.debug("Loaded config.")
    config.selectedEnvironment = args.environment;
    // console.debug("Storing config...")
    await storeConfig(config);

    if (config.selectedEnvironment) {
      const env = await loadEnv(config.selectedEnvironment);
      SetEnvironment.logger.logEnvironment(config.selectedEnvironment, env)
    }

    console.log("Updated config ⚙️");

  }

}
