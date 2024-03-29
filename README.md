# LRestClient

Json-file-based REST-Client written in Typescript.

-   [Usage](#usage)
-   [Definitions](#definitions)
-   [Project Structure](#project-structure)

# Usage

```javascript
const lrc = new LRClient();

// Loads config from disk
await lrc.init();

// Performs the request specified in ./collections/api/hello-world-service/hello.json
await lrc.send("./collections/api/hello-world-service/hello.json");

// Executes the upload request and replaces variables in request url, headers or payload body with the entries from the second parameter
await lrc.send("./collections/api/hello-world-service/load-profile.json", {
    token: "1234",
    username: "bernd",
});

// Uploads the file at the passed file path
const payload = new PayloadFile("./files/example.pdf");
await lrc.send(
    "./collections/api/hello-world-service/upload.json",
    { token: "1234" },
    payload
);
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
        "User-Agent": "{{browser}}"
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

-   JSON: `data` contains the whole JSON string
-   Text: `data` contains the whole text
-   Files: `data` contains the path to the file that should be uploaded

The payload which should be used for a request can be defined on two levels (similar to variables):

1. "Locally": Directly at the call via parameter
2. Endpoint: Default payload for the endpoint

The payload can be selected by refering it in the send command call [`lrc send ENDPOINT`](#lrc-send-endpoint).

## Authorization

The same hierarchy like for headers apply for Authorizations:

1. Endpoint auth
2. Environment auth

But additionally, authorizations with higher priority can extend lower authorizations.
This means, you can e.g. define the urls, clientId and secret for OAuth2 on environment level and the username and password endpoint specific.
If the `authType` of two levels differs, the one with higher priority is used without taking over any values from the other one.

Inside the fields of the auth, variables can be used like in payloads or urls.

There are different types of authorizations supported:

### AuthType: Basic Auth

For basic auth, the client just encodes a combination of username and password (separated with ':') base64 and sends it in the `Authorization` header.
The configuration for a Basic Auth should look like that:

```json
{
    ...
    "auth": {
        "authType": "BASIC",
        "username": "lukas",
        "password": "{{secretPassword}}"
    }
}
```

Assuming the variable `secretPassword=test`, this authorization configuration will add the following header to the request:

```
Authorization: Basic bHVrYXM6dGVzdA==
```

The resulting header overwrites potential already existing `Authorization` headers.

### AuthType: OAuth2

Besides Basic Auth, also OAuth2 is supported.
Therefore the library [simple-oauth2](https://www.npmjs.com/package/simple-oauth2) is used.
The configuration of this type should look like that:

```json
{
    ...
    {
        "authType": "OAUTH2",
        "clientId": "github",
        "clientSecret": "0000-1111-3333-4444-5555-6666",
        "tokenHost": "{{url}}/authorization",
        "tokenPath": "/token",
        "revokePath": "/revoke",
        "scopes": [ "repos" ],
        "username": "lmnch",
        "password": "test123"
    }
}
```

### Authorization Merging

Assuming we have an environment authorization like that:

```json
{
    ...
    {
        "authType": "OAUTH2",
        "clientId": "github",
        "clientSecret": "0000-1111-3333-4444-5555-6666",
        "tokenHost": "{{url}}/authorization",
        "tokenPath": "/token",
        "revokePath": "/revoke",
        "scopes": [ "repos" ],
        "username": "git"
    }
}
```

And an endpoint authorization like that:

```json
{
    ...
    {
        "authType": "OAUTH2",
        "username": "lmnch",
        "password": "test@123"
    }
}
```

As both have the same authentication type, they can be merged together to the following:

```json
{
    ...
    {
        "authType": "OAUTH2",
        "clientId": "github",
        "clientSecret": "0000-1111-3333-4444-5555-6666",
        "tokenHost": "{{url}}/authorization",
        "tokenPath": "/token",
        "revokePath": "/revoke",
        "scopes": [ "repos" ],
        "username": "lmnch",
        "password": "test@123"

    }
}
```

Fields that appear in both (`username`) are overwritten and fields that appear only in one of them (environemnt: `clientId`, `clientSecret`,
`tokenHost`, `tokenPath`, `revokePath`, `scopes`; endpoint: `password`) are taken over.

## Endpoint

The job of a REST-Client is obvoiusly to call REST-Endpoints.
Such an endpoint is defined as following:

```json
{
    "url": "http://localhost:8080/api/upload",
    "method": "POST",
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

## Environments

The LRClient can be configured by using different environments.
An environment contains headers and custom variables which are applied to all request executed with the enviroment.

```json
{
    "headers": {
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

# Logging

The logging configuration can be done by passing a LRCLoggerConfig object to the LRCLogger.
There, it can be specified which parts should be logged:

```javascript
new LRCLogger(
    new LRCLoggerConfig({ logEndpoint: true, logResponesBody: true })
);
```

# Project structure

The entrypoint are the classes in the `src/boundary` directory.

It contains the `LRClient` which performs the REST calls and the `ConfigManager` which allows to load and change the configuration.
`src/model` contains the data classes that define how the requests are performed.
This contains some enums (`HttpMethod`, `PayloadType`) and classes that contain the definition (`Environment`, `Endpoint`).
Further, theres a special directory `payload` for different payload types.
They use classes from the `src/variables` directory which manage the variables and variable replacement.

The `LRCLogger` (`src/logging/LRCLogger`) is used to print the model classes to the console in a colorful way.
