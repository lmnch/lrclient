LRestClient
=================

Command-line, json-based REST-Client written in Typescript.

<!-- toc -->
* [Usage](#usage)
* [Definitions](#definitions)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lrclient
$ lrc COMMAND
running command...
$ lrc run accounts/user/profile -v "user: lmnch"
production
Headers:
Authorization: Bearer {{bearerToken}}
User-Agent: Mozilla Firefox
Variables:
bearerToken=...
baseUrl=http://www.github.com
repository=LRClient
requestUrl={{baseUrl}}/{{user}}/{{repository}}

module1/request1
 GET {{requestUrl}}

Requesting...
 GET http://www.github.com/lmnch/LRClient
Authorization: Bearer ...
User-Agent: Mozilla Firefox
...
```

# Definitions

The files in the working folder should be structured as follows:
```
.config.json      <-- Configuration file which contains e.g. the current environment
env/              <-- Folder with the enviroments
  test.json
  production.json <-- Configuration where headers and variables can be defined across different requests 
endpoints/        <-- Contains the endpoint definitions
  module1/        <-- There can be subfolders
    request1.json <-- The endpoint definition
payloads/         <-- Contians definitions for selectable payloads
  uploadData.json <-- Payload definition
```

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
```
{
  "variables": {
    "username": "bernd",
    "authorization": "{{username}}:{{password}}"
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
```
{
  "headers": {
    "Authorization": "{{authorization}}"
  }
  "variables": {
    "username": "bernd",
    "authorization": "{{username}}:{{password}}"
    "password": "bernd!rocks"
  }
}
```

## Payloads
In general, a payload can be used by creating a json file inside of the `./payloads` directory of this form:
```
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
Keep in mind that only payloads defined in the `./payloads` dir can be used!

## Endpoint

The job of a REST-Client is obvoiusly to call REST-Endpoints.
Such an endpoint is defined as following:

```
{
  "url": "http://localhost:8080/api/upload"
  "method": "POST",
  "resultType": "application/json"
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


These files should be defined in the `endpoints` folder.
They endpoint that should be called is defined as the relative path the corresponding json file inside of this folder.

### Result type

The result time determines how the http response is handled and returned.
TODO: improve

## Environments

The LRClient can be configured by using different environments.
An environment contains headers and custom variables which are applied to all request executed with the enviroment.

```
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

Environments should be stored in the currentdir `./env` folder.
Currently, the environment has to be defined via JSON file.
But, one can switch between different files with the [`lrc env set`](#lrc-env-set) command.

<!-- usagestop -->
# Commands
<!-- commands -->
* [`lrc env set`](#lrc-env-set)
* [`lrc env get`](#lrc-env-set)
* [`lrc run [ENDPOINT]`](#lrc-run-endpoint)

## `lrc env set`

Changes the **currently used** environment.

```
USAGE
  $ lrc env set production

  ...

  Following rest calls are going to use the environment file "./env/production.json"
```

## `lrc env get`

Returns the currently used environment.

```
USAGE
  $ lrc env get
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
```

## `lrc run [ENDPOINT]`

Performs a rest call to the endpoint defined in `./endpoints/ENDPOINT.json`.
Therefore, all variables are resolved (see [`Variables`](#variables)).
Additional variables can be passed with `--localVariable "key: value"` or `-v "key: value` (can be used multiple times).

```
USAGE:
  $ lrc run module1/request1 --localVariable "user: lukas"

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


<!-- commandsstop -->
