import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'

export default class AdminUsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().preload('role').orderBy('created_at', 'desc')
    const roles = await Role.all()

    return inertia.render('(main)/admin/users/page', {
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        full_name: u.fullName,
        email: u.email,
        is_active: u.isActive,
        role: u.role ? { id: u.role.id, name: u.role.name } : null,
        created_at: u.createdAt,
      })),
      roles: roles.map((r) => ({ id: r.id, name: r.name })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['username', 'full_name', 'email', 'password', 'role_id', 'is_active'])

    await User.create({
      username: data.username,
      fullName: data.full_name,
      email: data.email,
      password: data.password,
      roleId: data.role_id,
      isActive: data.is_active ?? true,
    })

    session.flash('success', 'สร้างผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }

  async update({ request, response, params, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['full_name', 'email', 'role_id', 'is_active', 'password'])

    user.fullName = data.full_name ?? user.fullName
    user.email = data.email ?? user.email
    user.roleId = data.role_id ?? user.roleId
    user.isActive = data.is_active ?? user.isActive
    if (data.password) user.password = data.password

    await user.save()

    session.flash('success', 'อัปเดตผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash('success', 'ลบผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }
}
