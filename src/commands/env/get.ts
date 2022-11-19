import * as fs from 'fs';
import { Command } from '@oclif/core'
import ConfigManager from '../../boundary/ConfigManager';
import { loadEnv } from '../../config/EnvironmentLoader';
import LRCLogger from '../../logging/LRCLogger';

export default class GetEnvironment extends Command {
  static description = 'Returns the currently selected environment.'

  static examples = [
    `<%= config.bin %> <%= command.id %>
./env/test.json
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.github.com
user=lmnch
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}
`,
  ]

  static flags = {}

  static args = []

  static logger = new LRCLogger();
  static configManager = new ConfigManager();

  async run(): Promise<void> {
    // console.debug("Loading config...")
    const config = await GetEnvironment.configManager.loadConfig();
    // console.debug("Loaded config.")
    if (config.selectedEnvironment) {
      const env = await loadEnv(config.selectedEnvironment);
      GetEnvironment.logger.logEnvironment(config.selectedEnvironment, env)
    }else{
      this.log(`No environment selected!`);
    }

  }

}
