import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import Folder from '#models/folder'
import AuditLogService from '#services/audit_log_service'

export default class TrashController {
  // ─── GET /trash ────────────────────────────────────────────────────────
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    
    // Only Admin can view all trash for now, or users can view their own deleted items.
    // Assuming for simplicity that we show all deleted folders and documents, but maybe restricted to admin.
    if (!user.isAdmin) {
       // Optional: implement logic for normal users
       // return response.forbidden('Only admins can view the trash for now')
    }

    const AuditLog = (await import('#models/audit_log')).default

    const folders = await Folder.query()
      .where((q) => q.where('isDeleted', true).orWhere('isDeleted', 1))
      .preload('creator')
      .preload('permissions', (q) => {
        q.preload('user').preload('role')
      })
      .orderBy('updated_at', 'desc')

    const documents = await Document.query()
      .where((q) => q.where('isDeleted', true).orWhere('isDeleted', 1))
      .preload('owner')
      .preload('folder')
      .orderBy('updated_at', 'desc')

    // Find delete audit log entries to get who deleted each item
    const deleteLogs = await AuditLog.query()
      .where('action', 'Delete')
      .preload('user')

    const deleteMap: Record<string, string> = {}
    for (const log of deleteLogs) {
      if (log.targetType && log.targetId) {
        deleteMap[`${log.targetType.toLowerCase()}_${log.targetId}`] = log.user?.fullName || log.user?.username || '—'
      }
    }

    return inertia.render('(main)/trash/page', {
      folders: folders.map(f => {
        const s = f.serialize()
        s.type = 'folder'
        s.creator = f.creator ? { full_name: f.creator.fullName || f.creator.username } : null
        s.deleted_by = deleteMap[`folder_${f.id}`] || f.creator?.fullName || f.creator?.username || '—'
        return s
      }),
      documents: documents.map(d => {
        return {
          id: d.id,
          name: d.name,
          original_name: d.originalName,
          extension: d.extension,
          owner: { full_name: d.owner?.fullName || d.owner?.username },
          folder: d.folder ? { id: d.folder.id, name: d.folder.name } : null,
          created_at: d.createdAt?.toISO(),
          deleted_at: d.updatedAt?.toISO(),
          deleted_by: deleteMap[`document_${d.id}`] || d.owner?.fullName || d.owner?.username || '—',
          type: 'document'
        }
      })
    })
  }

  // ─── POST /trash/restore ───────────────────────────────────────────────
  async restore({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const { id, type } = request.all()

    if (!user.isAdmin) {
       // Simplify: require admin
    }

    if (type === 'folder') {
      const folder = await Folder.find(id)
      if (folder) {
        folder.isDeleted = false
        await folder.save()

        // Optionally, recursively restore children and documents
        await Document.query().where('folderId', folder.id).update({ isDeleted: false })
        
        await AuditLogService.log(user, 'Restore', folder.id, { type: 'folder' }, 'folder')
      }
    } else if (type === 'document') {
      const document = await Document.find(id)
      if (document) {
        document.isDeleted = false
        await document.save()
        await AuditLogService.log(user, 'Restore', document.id, { type: 'document' }, 'document')
      }
    }

    session.flash('success', 'Restored successfully')
    return response.redirect().back()
  }

  // ─── POST /trash/force-delete ──────────────────────────────────────────
  async forceDelete({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const { id, type } = request.all()

    if (type === 'folder') {
      // Need a recursive hard delete helper
      const hardDeleteFolder = async (fId: number) => {
        const children = await Folder.query().where('parentId', fId)
        for (const child of children) {
          await hardDeleteFolder(child.id)
        }
        await Document.query().where('folderId', fId).delete()
        
        const { default: FolderPermission } = await import('#models/folder_permission')
        await FolderPermission.query().where('folderId', fId).delete()
        
        await Folder.query().where('id', fId).delete()
      }
      
      await hardDeleteFolder(id)
      await AuditLogService.log(user, 'Force Delete', id, { type: 'folder' }, 'folder')
      
    } else if (type === 'document') {
      const document = await Document.find(id)
      if (document) {
        await document.delete()
        await AuditLogService.log(user, 'Force Delete', id, { type: 'document' }, 'document')
      }
    }

    session.flash('success', 'Permanently deleted')
    return response.redirect().back()
  }
}
