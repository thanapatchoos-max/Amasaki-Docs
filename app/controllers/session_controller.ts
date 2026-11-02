import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('(auth)/login/page', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    try {
      const { username, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(username, password)
  
      await auth.use('web').login(user)
      return response.redirect().toPath('/')
    } catch (error: any) {
      console.error('Login error:', error)
      return response.badRequest({ error: error.message, stack: error.stack })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toPath('/login')
  }
}
