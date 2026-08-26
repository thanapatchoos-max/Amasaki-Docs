import type { HttpContext } from '@adonisjs/core/http'
import Folder from '#models/folder'
import FolderPermission from '#models/folder_permission'
import PermissionService from '#services/permission_service'
import AuditLogService from '#services/audit_log_service'

export default class FolderPermissionsController {
  async store({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.find(params.id)

    if (!folder) return response.notFound()

    if (!(await PermissionService.canOnFolder(user, 'admin', folder.id))) {
      return response.forbidden('You do not have permission to manage this folder')
    }

    const { userId, roleId, permission } = request.only(['userId', 'roleId', 'permission'])

    if (!userId && !roleId) {
      session.flash('error', 'Must specify User or Role')
      return response.redirect().back()
    }

    await FolderPermission.firstOrCreate(
      { folderId: folder.id, userId: userId || null, roleId: roleId || null, permission },
      { folderId: folder.id, userId: userId || null, roleId: roleId || null, permission }
    )

    await AuditLogService.log(user, 'Edit', folder.id, { type: 'folder', message: 'Added permission' })

    session.flash('success', 'Permission added')
    return response.redirect().back()
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.find(params.id)

    if (!folder) return response.notFound()

    if (!(await PermissionService.canOnFolder(user, 'admin', folder.id))) {
      return response.forbidden('You do not have permission to manage this folder')
    }

    const perm = await FolderPermission.find(params.permissionId)
    if (perm && perm.folderId === folder.id) {
      await perm.delete()
      await AuditLogService.log(user, 'Edit', folder.id, { type: 'folder', message: 'Removed permission' })
    }

    session.flash('success', 'Permission removed')
    return response.redirect().back()
  }
}