import {Command, Flags} from '@oclif/core'

export default class Env extends Command {
  static description = 'Say hello'

  static examples = [
  ]

  static flags = {

  }

  static args = [{name: 'person', description: 'Person to say hello to', required: true}]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Env)

    this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`)
  }
}
