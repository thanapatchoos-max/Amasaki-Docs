import type { HttpContext } from '@adonisjs/core/http'
import Folder from '#models/folder'
import Document from '#models/document'
import PermissionService from '#services/permission_service'
import AuditLogService from '#services/audit_log_service'

export default class FoldersController {
  // ─── GET /folders ────────────────────────────────────────────────────────
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    // Get all root folders (parentId = null) that the user can view
    const allFolders = await Folder.query()
      .where((q) => q.whereNull('isDeleted').orWhere('isDeleted', false).orWhere('isDeleted', 0))
      .preload('children', (q) => q.where((sq) => sq.whereNull('isDeleted').orWhere('isDeleted', false).orWhere('isDeleted', 0)))
      .preload('documents', (q) => q.where((sq) => sq.whereNull('isDeleted').orWhere('isDeleted', false).orWhere('isDeleted', 0)))
      .preload('permissions', (q) => {
        q.preload('user').preload('role')
      })
      .orderBy('name', 'asc')

    // Filter by read permissions
    const folders = []
    for (const folder of allFolders) {
      if (await PermissionService.canOnFolder(user, 'read', folder.id)) {
        folders.push(folder)
      }
    }

    const rootFolders = folders.filter((f) => f.parentId === null)

    const pinnedFolders = rootFolders.filter((f) => f.isPinned)

    // Recent folders: Top 4 sorted by updatedAt
    const recentFolders = [...rootFolders]
      .sort((a, b) => new Date(b.updatedAt.toJSDate()).getTime() - new Date(a.updatedAt.toJSDate()).getTime())
      .slice(0, 4)

    const { default: User } = await import('#models/user')
    const { default: Role } = await import('#models/role')
    const users = await User.query().select('id', 'username', 'fullName').orderBy('username', 'asc')
    const roles = await Role.query().select('id', 'name').orderBy('name', 'asc')

    return inertia.render('(main)/folders/page', {
      pinnedFolders: pinnedFolders.map(f => {
        const s = f.serialize()
        s.permissions = f.permissions?.map(p => p.serialize()) || []
        return s
      }),
      recentFolders: recentFolders.map(f => {
        const s = f.serialize()
        s.permissions = f.permissions?.map(p => p.serialize()) || []
        s.documentsCount = f.documents?.length || 0
        s.childrenCount = f.children?.length || 0
        return s
      }),
      folders: rootFolders.map(f => {
        const s = f.serialize()
        s.permissions = f.permissions?.map(p => p.serialize()) || []
        s.documentsCount = f.documents?.length || 0
        s.childrenCount = f.children?.length || 0
        return s
      }),
      users: users.map(u => u.serialize()),
      roles: roles.map(r => r.serialize()),
    })
  }

  // ─── GET /folders/:id ────────────────────────────────────────────────────
  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.query()
      .where('id', params.id)
      .preload('permissions', (q) => {
        q.preload('user').preload('role')
      })
      .first()

    if (!folder) {
      return response.notFound()
    }

    if (!(await PermissionService.canOnFolder(user, 'read', folder.id))) {
      return response.forbidden('You do not have permission to view this folder')
    }

    await folder.load('children', (q) => q.where((sq) => sq.whereNull('isDeleted').orWhere('isDeleted', false).orWhere('isDeleted', 0)))
    const documentsQuery = Document.query()
      .where('folderId', folder.id)
      .where((q) => q.whereNull('isDeleted').orWhere('isDeleted', false).orWhere('isDeleted', 0))
      .preload('versions', (q) => q.orderBy('versionNumber', 'desc'))
      .preload('owner', (q) => q.select('id', 'username', 'fullName'))

    let documents = await documentsQuery
    
    // Filter out documents the user cannot view
    const viewableDocs = []
    for (const doc of documents) {
      if (await PermissionService.canOnDocument(user, 'view', doc.id)) {
        viewableDocs.push(doc)
      }
    }

    // Load parent folder chain for breadcrumbs
    const breadcrumbs = []
    let currentFolder: Folder | null = folder
    while (currentFolder) {
      breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name })
      if (currentFolder.parentId) {
        currentFolder = await Folder.find(currentFolder.parentId)
      } else {
        currentFolder = null
      }
    }

    // Filter children folders
    const viewableChildren = []
    for (const child of folder.children) {
      if (await PermissionService.canOnFolder(user, 'read', child.id)) {
        viewableChildren.push(child)
      }
    }

    const { default: User } = await import('#models/user')
    const { default: Role } = await import('#models/role')
    const users = await User.query().select('id', 'username', 'fullName').orderBy('username', 'asc')
    const roles = await Role.query().select('id', 'name').orderBy('name', 'asc')
    
    const folderData = folder.serialize()
    folderData.children = viewableChildren.map((c) => c.serialize())
    folderData.permissions = folder.permissions?.map(p => p.serialize()) || []

    return inertia.render('(main)/folders/[id]/page', {
      folder: folderData,
      breadcrumbs,
      documents: viewableDocs.map((doc) => ({
        id: doc.id,
        name: doc.name,
        extension: doc.extension,
        updated_at: doc.updatedAt?.toISO() || doc.createdAt?.toISO() || new Date().toISOString(),
        created_at: doc.createdAt?.toISO() || new Date().toISOString(),
        expire_at: doc.expireAt?.toISO() || null,
        latest_version: doc.versions?.[0]?.versionNumber || 1,
        owner: doc.owner ? { full_name: doc.owner.fullName || doc.owner.username, username: doc.owner.username } : null,
      })),
      users: users.map(u => u.serialize()),
      roles: roles.map(r => r.serialize()),
    })
  }

  // ─── POST /folders ───────────────────────────────────────────────────────
  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const { name, parentId, initialPermissions } = request.only(['name', 'parentId', 'initialPermissions'])

    if (!name) {
      session.flash('errors', { name: 'Folder name is required' })
      return response.redirect().back()
    }

    // If parent folder is specified, check permission to create in it (edit perm)
    if (parentId) {
      const parent = await Folder.find(parentId)
      if (!parent) {
        session.flash('errors', { parentId: 'Parent folder not found' })
        return response.redirect().back()
      }
      const canCreateInParent = user.isAdmin ||
                                parent.createdBy === user.id ||
                                (await PermissionService.canOnFolder(user, 'read', parent.id)) ||
                                (await PermissionService.canOnFolder(user, 'write', parent.id)) ||
                                (await PermissionService.canOnFolder(user, 'admin', parent.id))

      if (!canCreateInParent) {
        return response.forbidden('You do not have permission to create folders here')
      }
    }

    const folder = await Folder.create({
      name,
      parentId: parentId || null,
      createdBy: user.id,
    })

    // Grant creator admin permission on the new folder so it doesn't disappear
    await PermissionService.grantFolder(user.id, folder.id, 'admin')
    
    // Add initial permissions if any, otherwise default to everyone (read)
    const { default: FolderPermission } = await import('#models/folder_permission')
    
    if (initialPermissions && Array.isArray(initialPermissions) && initialPermissions.length > 0) {
      for (const p of initialPermissions) {
        await FolderPermission.create({
          folderId: folder.id,
          userId: p.type === 'user' ? p.id : null,
          roleId: p.type === 'role' ? p.id : null,
          permission: p.permission
        })
      }
    } else {
      // Default: Everyone can see
      await FolderPermission.create({
        folderId: folder.id,
        userId: null,
        roleId: null,
        permission: 'read'
      })
    }

    // Log the action
    await AuditLogService.log(user, 'Create', folder.id, { type: 'folder' })

    session.flash('success', 'Folder created successfully')
    return response.redirect().back()
  }

  // ─── PATCH /folders/:id ──────────────────────────────────────────────────
  async update({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.find(params.id)

    if (!folder) {
      return response.notFound()
    }

    if (!(await PermissionService.canOnFolder(user, 'write', folder.id))) {
      return response.forbidden('You do not have permission to edit this folder')
    }

    const { name } = request.only(['name'])
    
    if (!name) {
      session.flash('errors', { name: 'Folder name is required' })
      return response.redirect().back()
    }

    const oldName = folder.name
    folder.name = name
    await folder.save()

    // Log the action
    await AuditLogService.log(user, 'Edit', folder.id, { type: 'folder', oldName, newName: name })

    session.flash('success', 'Folder updated successfully')
    return response.redirect().back()
  }

  // ─── DELETE /folders/:id ─────────────────────────────────────────────────
  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.find(params.id)

    if (!folder) {
      return response.notFound()
    }

    // Check permission: Admin, Creator, or has read/write/admin permission
    const canDelete = user.isAdmin || 
                      folder.createdBy === user.id || 
                      (await PermissionService.canOnFolder(user, 'read', folder.id)) ||
                      (await PermissionService.canOnFolder(user, 'write', folder.id)) ||
                      (await PermissionService.canOnFolder(user, 'admin', folder.id))

    if (!canDelete) {
      session.flash('error', 'คุณไม่มีสิทธิ์ลบโฟลเดอร์นี้')
      return response.redirect().back()
    }

    // Recursive helper to delete folder and contents
    const deleteFolderRecursive = async (fId: number) => {
      // 1. Soft-delete documents inside this folder
      await Document.query().where('folderId', fId).update({ isDeleted: true })

      // 2. Find child folders and delete recursively
      const children = await Folder.query().where('parentId', fId)
      for (const child of children) {
        await deleteFolderRecursive(child.id)
      }

      // 3. Delete permissions for this folder (skip, keep them for restore)
      // const { default: FolderPermission } = await import('#models/folder_permission')
      // await FolderPermission.query().where('folderId', fId).delete()

      // 4. Soft-delete the folder record itself
      await Folder.query().where('id', fId).update({ isDeleted: true })
    }

    const folderName = folder.name
    await deleteFolderRecursive(folder.id)

    // Log the action
    await AuditLogService.log(user, 'Delete', folder.id, { type: 'folder', name: folderName })

    session.flash('success', 'ลบโฟลเดอร์เรียบร้อยแล้ว')
    return response.redirect().toPath('/folders')
  }

  // ─── POST /folders/:id/pin ───────────────────────────────────────────────
  async togglePin({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const folder = await Folder.find(params.id)

    if (!folder) {
      return response.notFound()
    }

    if (!(await PermissionService.canOnFolder(user, 'read', folder.id))) {
      return response.forbidden('You do not have permission to modify this folder')
    }

    folder.isPinned = !folder.isPinned
    await folder.save()

    session.flash('success', folder.isPinned ? 'ปักหมุดโฟลเดอร์เรียบร้อย' : 'ยกเลิกการปักหมุดเรียบร้อย')
    return response.redirect().back()
  }
}