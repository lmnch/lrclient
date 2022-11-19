import { Command, Flags } from '@oclif/core'
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import LRClient from '../../boundary/LRestClient';

export default class Run extends Command {
  static description = 'Performs a REST call to a endpoint'

  static examples = [
    `$ <%= config.bin %> <%= command.id %> endpoints/examplerequest.json --localVariable "user: lukas"
./env/test.json
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.google.com
user=lmnch
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}

endpoints/examplerequest.json
POST {{requestUrl}}

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
  <meta charset=utf-8>
  <meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
  <title>Error 404 (Not Found)!!1</title>
  <style>
    *{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}
  </style>
  <a href=//www.google.com/><span id=logo aria-label=Google></span></a>
  <p><b>404.</b> <ins>That’s an error.</ins>
  <p>The requested URL <code>/lukas/LRClient</code> was not found on this server.  <ins>That’s all we know.</ins>
`, `$ <%= config.bin %> <%= command.id %> endpoints/examplerequest.json
./env/test.json
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.google.com
user=lmnch
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}

./endpoints/examplerequest.json
POST {{requestUrl}}

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
  <meta charset=utf-8>
  <meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
  <title>Error 404 (Not Found)!!1</title>
  <style>
    *{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}
  </style>
  <a href=//www.google.com/><span id=logo aria-label=Google></span></a>
  <p><b>404.</b> <ins>That’s an error.</ins>
  <p>The requested URL <code>/lmnch/LRClient</code> was not found on this server.  <ins>That’s all we know.</ins>
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

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Run);

    const client = new LRClient();
    await client.init();

    const localDefinition: { [key: string]: string } = {};
    const { localVariable } = flags;
    if (localVariable) {
      (<Array<String>>localVariable).forEach(v => {
        const [key, value] = v.split(": ");
        localDefinition[key] = value;
      });
    }

    client.execute(args.requestPath, localDefinition, flags.payload);
  }
}
