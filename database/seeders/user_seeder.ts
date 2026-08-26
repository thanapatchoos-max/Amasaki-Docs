import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Create Admin Role
    const adminRole = await Role.firstOrCreate(
      { name: 'Admin' },
      { name: 'Admin' }
    )

    // Create Admin User
    await User.firstOrCreate(
      { username: 'admin' },
      {
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@amagasaki.co.th',
        password: '123456',
        roleId: adminRole.id,
        isActive: true,
      }
    )
  }
}