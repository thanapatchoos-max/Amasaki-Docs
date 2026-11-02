import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import AuditLogService from '#services/audit_log_service'

export default class AdminUsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().preload('role').orderBy('created_at', 'desc')
    const roles = await Role.all()

    return inertia.render('(main)/admin/users/page', {
      users: users.map((u) => ({
        id: u.id,
        username: (u as any).username,
        full_name: (u as any).fullName,
        email: (u as any).email,
        is_active: (u as any).isActive,
        role: u.role ? { id: u.role.id, name: u.role.name } : null,
        created_at: (u as any).createdAt,
      })),
      roles: roles.map((r) => ({ id: r.id, name: r.name })),
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const actor = auth.user!
    const data = request.only(['username', 'full_name', 'email', 'password', 'role_id', 'is_active'])

    const user = await User.create({
      username: data.username,
      fullName: data.full_name,
      email: data.email,
      password: data.password,
      roleId: data.role_id,
      isActive: data.is_active ?? true,
    } as any)

    await AuditLogService.log(actor, 'Create', user.id, { type: 'user', username: data.username }, 'user')

    session.flash('success', 'สร้างผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }

  async update({ request, response, params, session, auth }: HttpContext) {
    const actor = auth.user!
    const user = await User.findOrFail(params.id)
    const data = request.only(['full_name', 'email', 'role_id', 'is_active', 'password'])

    ;(user as any).fullName = data.full_name ?? (user as any).fullName
    ;(user as any).email = data.email ?? (user as any).email
    ;(user as any).roleId = data.role_id ?? (user as any).roleId
    ;(user as any).isActive = data.is_active ?? (user as any).isActive
    if (data.password) (user as any).password = data.password

    await user.save()

    await AuditLogService.log(actor, 'Edit', user.id, { type: 'user', username: (user as any).username }, 'user')

    session.flash('success', 'อัปเดตผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const actor = auth.user!
    const user = await User.findOrFail(params.id)
    const username = (user as any).username

    await user.delete()

    await AuditLogService.log(actor, 'Delete', user.id, { type: 'user', username }, 'user')

    session.flash('success', 'ลบผู้ใช้งานสำเร็จ')
    return response.redirect().back()
  }
}
