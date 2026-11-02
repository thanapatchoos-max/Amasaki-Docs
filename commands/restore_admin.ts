import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class RestoreAdmin extends BaseCommand {
  static commandName = 'restore:admin'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "RestoreAdmin"')
  }
}