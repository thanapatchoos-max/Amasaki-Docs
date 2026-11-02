import app from '@adonisjs/core/services/app'
import User from '#models/user'

export default async function testLogin() {
  try {
    const user = await User.verifyCredentials('admin', 'password123')
    console.log('Login success!', user.username)
    console.log('Role Permissions:', user.role?.permissions)
  } catch (error: any) {
    console.log('Login failed:', error.message)
    const admin = await User.findBy('username', 'admin')
    console.log('Admin found in DB:', !!admin)
    if (admin) {
        console.log('Admin password hash in DB:', admin.password)
    }
  }
}
