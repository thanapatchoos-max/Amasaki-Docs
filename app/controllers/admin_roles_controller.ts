import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import User from '#models/user'
import AuditLogService from '#services/audit_log_service'

export default class AdminRolesController {
  async index({ inertia }: HttpContext) {
    // Load all roles with user count
    const roles = await Role.query().orderBy('id', 'asc')
    const users = await User.query().select('id', 'roleId')

    // Count users per role
    const userCounts: Record<number, number> = {}
    for (const u of users) {
      if (u.roleId) {
        userCounts[u.roleId] = (userCounts[u.roleId] || 0) + 1
      }
    }

    const roleList = roles.map(r => ({
      id: r.id,
      name: r.name,
      user_count: userCounts[r.id] || 0,
      created_at: r.createdAt?.toISO(),
    }))

    return inertia.render('(main)/admin/roles/page', {
      roles: roleList,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('(main)/admin/roles/create/page', {})
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const { name, permissions } = request.only(['name', 'permissions'])

    if (!name || !name.trim()) {
      session.flash('error', 'Role name is required')
      return response.redirect().back()
    }

    const existing = await Role.query().where('name', name.trim()).first()
    if (existing) {
      session.flash('error', 'มีตำแหน่งนี้อยู่ในระบบแล้ว')
      return response.redirect().back()
    }

    const role = await Role.create({ 
      name: name.trim(),
      permissions: permissions || {} 
    })

    await AuditLogService.log(user, 'Create', role.id, { type: 'role', name: role.name }, 'role')

    session.flash('success', 'เพิ่มตำแหน่งใหม่เรียบร้อยแล้ว')
    return response.redirect().toRoute('admin.roles')
  }

  async edit({ params, response, inertia }: HttpContext) {
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound()
    }

    return inertia.render('(main)/admin/roles/edit/page', {
      role: {
        id: role.id,
        name: role.name,
        permissions: role.permissions || {}
      }
    })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound()
    }

    const { name, permissions } = request.only(['name', 'permissions'])

    if (!name || !name.trim()) {
      session.flash('error', 'กรุณาระบุชื่อตำแหน่ง')
      return response.redirect().back()
    }

    const existing = await Role.query().where('name', name.trim()).whereNot('id', role.id).first()
    if (existing) {
      session.flash('error', 'มีตำแหน่งนี้อยู่ในระบบแล้ว')
      return response.redirect().back()
    }
    
    role.name = name.trim()
    role.permissions = permissions || {}
    await role.save()

    await AuditLogService.log(user, 'Edit', role.id, { type: 'role', name: role.name }, 'role')

    session.flash('success', 'อัปเดตตำแหน่งและกำหนดสิทธิ์เรียบร้อยแล้ว')
    return response.redirect().toRoute('admin.roles')
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound()
    }

    // Admin bypass removed

    // Check if users are assigned to this role
    const usersCount = await User.query().where('roleId', role.id).count('* as total')
    if (usersCount[0].$extras.total > 0) {
      session.flash('error', 'ไม่สามารถลบตำแหน่งนี้ได้ เนื่องจากมีผู้ใช้งานสังกัดตำแหน่งนี้อยู่')
      return response.redirect().back()
    }

    await role.delete()

    await AuditLogService.log(user, 'Delete', role.id, { type: 'role', name: role.name }, 'role')

    session.flash('success', 'ลบตำแหน่งเรียบร้อยแล้ว')
    return response.redirect().back()
  }
}
