import { BaseCommand } from '@adonisjs/core/ace'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class TestLogin extends BaseCommand {
  static commandName = 'test:login'
  static description = 'Test login'
  static options = {
    startApp: true
  }

  async run() {
    const { default: User } = await import('#models/user')
    try {
      const user = await User.verifyCredentials('admin', 'password123')
      this.logger.info(`Login success: ${user.username}`)
      await user.load('role')
      this.logger.info(`Role permissions: ${JSON.stringify(user.role?.permissions)}`)
    } catch (e: any) {
      this.logger.error(`Login failed: ${e.message}`)
      const user = await User.findBy('username', 'admin')
      if (user) {
        this.logger.info(`Hash in DB: ${user.password}`)
        const isValid = await hash.verify(user.password as string, 'password123')
        this.logger.info(`Manual hash.verify: ${isValid}`)
      }
    }
  }
}