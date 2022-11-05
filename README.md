oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lrclient
$ lrc COMMAND
running command...
$ lrc (--version)
lrclient/0.0.0 linux-x64 node-v18.11.0
$ lrc --help [COMMAND]
USAGE
  $ lrc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lrc hello PERSON`](#lrc-hello-person)
* [`lrc hello world`](#lrc-hello-world)
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

## `lrc hello PERSON`

Say hello

```
USAGE
  $ lrc hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/lmnch/LRClient/blob/v0.0.0/dist/commands/hello/index.ts)_

## `lrc hello world`

Say hello world

```
USAGE
  $ lrc hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ lrc hello world
  hello world! (./src/commands/hello/world.ts)
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.16/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.5/src/commands/plugins/index.ts)_

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
<!-- commandsstop -->