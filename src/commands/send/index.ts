import { CliUx, Command, Flags } from '@oclif/core'
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import LRClient from '../../boundary/LRClient';
import BaseCommand from '../BaseCommand';
import LRCListener from '../../boundary/LRCListener';
import LRCRequest from '../../model/LRCRequest';
import LRCResponse from '../../model/LRCResponse';

export default class Send extends BaseCommand implements LRCListener {
  static description = 'Performs a REST call to a endpoint'

  static examples = [
    `$ <%= config.bin %> <%= command.id %> endpoints/examplerequest.json --localVariable "user: lukas"
Requesting...
POST http://www.google.com/lukas/LRClient
Authorization: Bearer ...
User-Agent: Mozilla Firefox

Response:
404 Not Found
content-length: 1575
content-type: text/html; charset=UTF-8
date: Sat, 19 Nov 2022 09:33:10 GMT
referrer-policy: no-referrer
<!DOCTYPE html>
<html lang=en>
    ...
`, `$ <%= config.bin %> <%= command.id %> endpoints/examplerequest.json
Requesting...
POST http://www.google.com/lmnch/LRClient
Authorization: Bearer ...
User-Agent: Mozilla Firefox

Response:
404 Not Found
content-length: 1575
content-type: text/html; charset=UTF-8
date: Sat, 19 Nov 2022 09:31:37 GMT
referrer-policy: no-referrer
<!DOCTYPE html>
<html lang=en>
...
`,
  ]

  static flags = {
    localVariable: Flags.string({
      char: 'v', description: 'Local variables to overwrite endpoint or environment variables',
      required: false, multiple: true
    }),
    payload: Flags.string({
      char: 'p', description: 'Path to the payload which should be used for the request',
      required: false, multiple: false
    })
  }

  static args = [
    { name: 'requestPath', description: "Path to the endpoint defintion json file that should be called", required: true }
  ]

  onRequestSent(request: LRCRequest): void {
    CliUx.ux.action.start('Sending request', "", {stdout: true})
  }
  
  onResponseReceived(response: LRCResponse): void {
    CliUx.ux.action.stop('\u2713')
    this.log();
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Send);

    const client = new LRClient(this.getLoggerConfig(flags), this.getConfigManager(flags));
    await client.init({listeners: [this]});

    const localDefinition: { [key: string]: string } = {};
    const { localVariable } = flags;
    if (localVariable) {
      (<Array<String>>localVariable).forEach(v => {
        const [key, value] = v.split(": ");
        localDefinition[key] = value;
      });
    }

    const result = await client.send(args.requestPath, localDefinition, flags.payload);
    this.log(result)
  }
}
