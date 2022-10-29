import { Command, Flags } from '@oclif/core'
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import LRestClient from '../../boundary/LRestClient';

export default class Run extends Command {
  static description = 'Say hello'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    from: Flags.string({ char: 'f', description: 'Who is saying hello', required: false }),
  }

  static args = [
    { name: 'requestPath', description: "Path to request config in 'collections' directory", required: true },
    { name: 'payloadName', description: "Optional payload for the request which should be in '*requestPath*/payloads'", required: false }
  ]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Run);

    const client = new LRestClient();
    await client.init();

    client.execute(args.requestPath);
  }
}
