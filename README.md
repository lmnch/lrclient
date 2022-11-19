LRestClient
=================

Command-line, json-based REST-Client written in Typescript.

* [Usage](#usage)
* [Definitions](#definitions)
* [Commands](#commands)
* [Project Structure](#project-structure)
* [All commands (generated)](#all-commands-generated)

# Usage
```sh-session
$ npm install -g lrclient
$ lrc COMMAND
running command...
$ lrc send ./endpoints/accounts/user/profile.json -v "user: lmnch"
./env/production.json
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.github.com
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}

./endpoints/accounts/user/profile.json
 GET {{requestUrl}}

Requesting...
 GET http://www.github.com/lmnch/LRClient
Authorization: Bearer ...
User-Agent: Mozilla Firefox
...
```

# Definitions

## Variables
Variables can be used to parameterize your requests.
The value of a variable can be references like this:
```
{{variablename}}
```
The value of a variable can be defined on different levels which overwrite each other in the following order (lower index overwrites higher index):
1. Local variables: These are variables that are passed directly at the call and might be used e.g. for dynamic values which are returned by another request
2. Endpoint variables: Defined at the endpoint which should be called
3. Environment variables: Defined for the currently selected environment 

Variable values can contain other variables (but please do not create circular dependencies):
```json
{
  "variables": {
    "username": "bernd",
    "authorization": "{{username}}:{{password}}",
    "password": "bernd!rocks"
  }
}
```
(the variable `authorization` will be resolved to `bernd:bernd!rocks`)

## Headers
There's a similar hierarchy like for variables:
1. Endpoint headers
2. Environment headers

Variables can be used inside of the value of a header:
```json
{
  "headers": {
    "Authorization": "{{authorization}}"
  },
  "variables": {
    "username": "bernd",
    "authorization": "{{username}}:{{password}}",
    "password": "bernd!rocks"
  }
}
```

## Payloads
A payload can be used by creating a json file of this form:
```json
{
    "payloadType": "application/json",
    "data": "{\"street\":\"Teststreet\",\"name\": \"{{user}}\"}"
}
```
Inside of this data field, variables can be resolved.
Currently, there are three types of payloads supported:
* JSON: `data` contains the whole JSON string
* Text: `data` contains the whole text
* Files: `data` contains the path to the file that should be uploaded

The payload which should be used for a request can be defined on two levels (similar to variables):
1. "Locally": Directly at the call via parameter
2. Endpoint: Default payload for the endpoint

The payload can be selected by refering it in the send command call [`lrc send ENDPOINT`](#lrc-send-endpoint).

## Endpoint

The job of a REST-Client is obvoiusly to call REST-Endpoints.
Such an endpoint is defined as following:

```json
{
  "url": "http://localhost:8080/api/upload",
  "method": "POST",
  "resultType": "application/json",
  "headers": {
    "User-Agent": "Mozilla Firefox"
  },
  "variables": {
    "user": "lmnch"
  }
}
```

It consists of the mandatory fields: url (of course), the HTTP method that should be used and the resultType.
Additionally, variables and headers can be defined optionally here.
It is also possible to overwrite/supplement the headers and variables defined in the environment.

The endpoint file that should be used can be selected by its path when using the [send command](#lrc-send-endpoint).

### Result type

The result time determines how the http response is handled and returned.
TODO: improve

## Environments

The LRClient can be configured by using different environments.
An environment contains headers and custom variables which are applied to all request executed with the enviroment.

```json
{
  "headers": {
    "Authorization": "Bearer {{bearerToken}}",
    "User-Agent": "Mozilla Firefox"
  },
  "variables": {
    "bearerToken": "...",
    "baseUrl": "http://www.github.com",
    "user": "lmnch",
    "repository": "LRClient",
    "requestUrl": "{{baseUrl}}/{{user}}/{{repository}}"
  }
}
```
Currently, the environment has to be defined directly in a JSON file.
But, one can switch between different files with the [`lrc env set`](#lrc-env-set) command.

# Commands

* [`lrc env set`](#lrc-env-set)
* [`lrc env get`](#lrc-env-set)
* [`lrc send ENDPOINT`](#lrc-send-endpoint)
* [`lrc script execute SCRIPTFILE`](#lrc-script-execute-scriptfile)

## `lrc env set`

Changes the **currently used** environment.

```
USAGE
  $ lrc env set ./env/production.json

  ...

  Following rest calls are going to use the environment file "./env/production.json"
```

## `lrc env get`

Returns the currently used environment.

```
USAGE
  $ lrc env get
./env/production.json
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.github.com
user=lmnch
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}
```

## `lrc send ENDPOINT`

Performs a rest call to the endpoint defined in the `ENDPOINT` file.
Therefore, all variables are resolved (see [`Variables`](#variables)).
Additional variables can be passed with `--localVariable "key: value"` or `-v "key: value` (can be used multiple times).

```
USAGE:
  $ lrc send ./module1/request1.json --localVariable "user: lukas"

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

// TODO: Add result
```

## `lrc script execute SCRIPTFILE`

Executes the ECMA script file that is located at the passed position.
Inside of these script files, the variables `lrc` - which is an instance of the `LRClient` - and `log` - which is a function like `console.log` - can be used.
Furthermore, the await keyword can be used to wait for the result of `lrc.send`.

### Example

```javascript
let password = "test";

// Creates a new user
const createdUser = await lrc.send("./endpoints/create-new-user.json", { name: "lukas", password: password });

// Update the user's password 10 times
for(let i = 0; i < 10; i++){
  let newPassword = password;
  await lrc.send("./endpoints/update-password.json", {name: "lukas", oldPassword: password, newPassword: newPassword});
  password = newPassword;
}
```

### Implementation

Internally, the imported script is wrapped in a async function with `lrc` and `log` as parameters.
These values are passed to the context of the execution.
So internally, the example from before results in the following snippet:
```javascript
const executionLrcMethod = async (lrc) => { 

  let password = "test";

  // Creates a new user
  const createdUser = await lrc.send("./endpoints/create-new-user.json", { name: "lukas", password: password });

  // Update the user's password 10 times
  for(let i = 0; i < 10; i++){
    let newPassword = password;
    await lrc.send("./endpoints/update-password.json", {name: "lukas", oldPassword: password, newPassword: newPassword});
    password = newPassword;
  }

};
executionLrcMethod(lrc, log);
```
This allows the usage of the `await` keyword in the script files. 


# Project structure

The project uses [The Open CLI Framework](https://oclif.io/) to provide the REST client as cli tool.
The source files for the commands are stored in `src/commands`.
The commands call the configuration and REST client functionality by using the classes in the `src/boundary` directory.

It contains the `LRClient` which performs the REST calls and the `ConfigManager` which allows to load and change the configuration.
`src/model` contains the data classes that define how the requests are performed. 
This contains some enums (`HttpMethod`, `PayloadType`) and classes that contain the definition (`Environment`, `Endpoint`).
Further, theres a special directory `payload` for different payload types.
They use classes from the `src/variables` directory which manage the variables and variable replacement.

The `LRCLogger` (`src/logging/LRCLogger`) is used to print the model classes to the console in a colorful way.

# All commands (generated)
<!-- commands -->
* [`lrc env get`](#lrc-env-get)
* [`lrc env set ENVIRONMENT`](#lrc-env-set-environment)
* [`lrc exec SCRIPT`](#lrc-exec-script)
* [`lrc help [COMMAND]`](#lrc-help-command)
* [`lrc plugins`](#lrc-plugins)
* [`lrc plugins:install PLUGIN...`](#lrc-pluginsinstall-plugin)
* [`lrc plugins:inspect PLUGIN...`](#lrc-pluginsinspect-plugin)
* [`lrc plugins:install PLUGIN...`](#lrc-pluginsinstall-plugin-1)
* [`lrc plugins:link PLUGIN`](#lrc-pluginslink-plugin)
* [`lrc plugins:uninstall PLUGIN...`](#lrc-pluginsuninstall-plugin)
* [`lrc plugins:uninstall PLUGIN...`](#lrc-pluginsuninstall-plugin-1)
* [`lrc plugins:uninstall PLUGIN...`](#lrc-pluginsuninstall-plugin-2)
* [`lrc plugins update`](#lrc-plugins-update)
* [`lrc script execute SCRIPT`](#lrc-script-execute-script)
* [`lrc send REQUESTPATH`](#lrc-send-requestpath)

## `lrc env get`

Returns the currently selected environment.

```
USAGE
  $ lrc env get

DESCRIPTION
  Returns the currently selected environment.

EXAMPLES
  $ lrc env get
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
```

## `lrc env set ENVIRONMENT`

Updates the current working environtment

```
USAGE
  $ lrc env set [ENVIRONMENT]

ARGUMENTS
  ENVIRONMENT  Path to the environment json file

DESCRIPTION
  Updates the current working environtment

EXAMPLES
  $ lrc env set ./env/test.json
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
  Updated config ⚙️
```

## `lrc exec SCRIPT`

Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be used).Additionally "log" can be used to log stuff like "console.log" (but this one is not working).

```
USAGE
  $ lrc exec [SCRIPT]

ARGUMENTS
  SCRIPT  Path to script that should be executed

DESCRIPTION
  Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be
  used).Additionally "log" can be used to log stuff like "console.log" (but this one is not working).

ALIASES
  $ lrc exec

EXAMPLES
  $ lrc exec ./scripts/testscript.js
```

## `lrc help [COMMAND]`

Display help for lrc.

```
USAGE
  $ lrc help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for lrc.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `lrc plugins`

List installed plugins.

```
USAGE
  $ lrc plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ lrc plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.7/src/commands/plugins/index.ts)_

## `lrc plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lrc plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ lrc plugins add

EXAMPLES
  $ lrc plugins:install myplugin 

  $ lrc plugins:install https://github.com/someuser/someplugin

  $ lrc plugins:install someuser/someplugin
```

## `lrc plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ lrc plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ lrc plugins:inspect myplugin
```

## `lrc plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lrc plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ lrc plugins add

EXAMPLES
  $ lrc plugins:install myplugin 

  $ lrc plugins:install https://github.com/someuser/someplugin

  $ lrc plugins:install someuser/someplugin
```

## `lrc plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ lrc plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ lrc plugins:link myplugin
```

## `lrc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lrc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lrc plugins unlink
  $ lrc plugins remove
```

## `lrc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lrc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lrc plugins unlink
  $ lrc plugins remove
```

## `lrc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lrc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lrc plugins unlink
  $ lrc plugins remove
```

## `lrc plugins update`

Update installed plugins.

```
USAGE
  $ lrc plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `lrc script execute SCRIPT`

Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be used).Additionally "log" can be used to log stuff like "console.log" (but this one is not working).

```
USAGE
  $ lrc script execute [SCRIPT]

ARGUMENTS
  SCRIPT  Path to script that should be executed

DESCRIPTION
  Executes a ECMA script by providing LRClient as "lrc" variable in the context of an async method (=> "await" can be
  used).Additionally "log" can be used to log stuff like "console.log" (but this one is not working).

ALIASES
  $ lrc exec

EXAMPLES
  $ lrc script execute ./scripts/testscript.js
```

## `lrc send REQUESTPATH`

Performs a REST call to a endpoint

```
USAGE
  $ lrc send [REQUESTPATH] [-v <value>] [-p <value>]

ARGUMENTS
  REQUESTPATH  Path to the endpoint defintion json file that should be called

FLAGS
  -p, --payload=<value>           Path to the payload which should be used for the request
  -v, --localVariable=<value>...  Local variables to overwrite endpoint or environment variables

DESCRIPTION
  Performs a REST call to a endpoint

EXAMPLES
  $ lrc send endpoints/examplerequest.json --localVariable "user: lukas"
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

  $ lrc send endpoints/examplerequest.json
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
```

_See code: [dist/commands/send/index.ts](https://github.com/lmnch/LRClient/blob/v0.0.5/dist/commands/send/index.ts)_
<!-- commandsstop -->
