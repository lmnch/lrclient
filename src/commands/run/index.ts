import { Command, Flags } from '@oclif/core'
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import LRestClient from '../../boundary/LRestClient';

export default class Run extends Command {
  static description = 'Performs a REST call to a endpoint'

  static examples = [
    `$ <%= config.bin %> <%= command.id %> module1/request1 --localVariable "user: lukas"
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

module1/request1
  GET {{requestUrl}}

Requesting...
  GET http://www.github.com/lukas/LRClient
Authorization: Bearer ...
User-Agent: Mozilla Firefox

// TODO: add result
`,
`$ <%= config.bin %> <%= command.id %> module1/request1 -v "user: lukas" -v "repository: lmnch.github.io"
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

module1/request1
 GET {{requestUrl}}

Requesting...
 GET http://www.github.com/lukas/lmnch.github.io
Authorization: Bearer ...
User-Agent: Mozilla Firefox

// TODO: add result
`,
  ]

  static flags = {
    localVariable: Flags.string({ char: 'v', description: 'Local variables to overwrite endpoint or environment variables', 
              required: false, multiple: true }),
  }

  static args = [
    { name: 'requestPath', description: "Path to request config in 'collections' directory", required: true },
    { name: 'payloadName', description: "Optional payload for the request which should be in '*requestPath*/payloads'", required: false }
  ]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Run);

    const client = new LRestClient();
    await client.init();

    const localDefinition : {[key: string]: string} = {};
    const { localVariable } = flags;
    (<Array<String>>localVariable).forEach(v => {
      const [key, value] = v.split(": ");
      localDefinition[key] = value;
    });

    client.execute(args.requestPath, localDefinition);
  }
}
