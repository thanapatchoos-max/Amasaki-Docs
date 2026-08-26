import User from '#models/user'
import DocumentPermission from '#models/document_permission'
import FolderPermission from '#models/folder_permission'
import Folder from '#models/folder'
import Document from '#models/document'

export type DocumentAction = 'view' | 'upload' | 'delete'
export type FolderAction = 'read' | 'write' | 'admin'

export default class PermissionService {
  /**
   * Admin users bypass all permission checks.
   * Checks document override first, then falls back to Folder Inheritance.
   */
  static async canOnDocument(
    user: User,
    action: DocumentAction,
    documentId: number
  ): Promise<boolean> {
    // Admin bypasses all checks
    if (user.roleId === 1) return true
    await user.load('role')
    if (user.role?.name === 'Admin') return true

    const doc = await Document.find(documentId)
    if (!doc) return false

    // Owner bypasses all checks
    if (doc.ownerId === user.id) return true

    // Check specific document permission (Override)
    const perm = await DocumentPermission.query()
      .where('document_id', documentId)
      .where('user_id', user.id)
      .where('permission', action)
      .first()

    if (perm) return true

    // Folder Inheritance
    if (doc.folderId) {
      const folderAction: FolderAction = action === 'view' ? 'read' : 'write'
      return this.canOnFolder(user, folderAction, doc.folderId)
    }

    return false
  }

  /**
   * Returns true if user has given permission on a folder.
   * Checks up the tree for inherited permissions.
   * 'admin' implies 'write', 'write' implies 'read'.
   */
  static async canOnFolder(
    user: User,
    action: FolderAction,
    folderId: number
  ): Promise<boolean> {
    // Admin bypasses all checks
    if (user.roleId === 1) return true
    await user.load('role')
    if (user.role?.name === 'Admin') return true

    let currentFolderId: number | null = folderId

    while (currentFolderId) {
      const perms = await FolderPermission.query()
        .where('folder_id', currentFolderId)
        .where((q) => {
          q.where('user_id', user.id)
          if (user.roleId) {
            q.orWhere('role_id', user.roleId)
          }
          // Allow "Everyone" permissions (both user_id and role_id are null)
          q.orWhere((subq) => {
            subq.whereNull('user_id').whereNull('role_id')
          })
        })
        .select('permission')

      if (perms.length > 0) {
        const granted = perms.map((p) => p.permission)
        if (action === 'read') return granted.includes('read') || granted.includes('write') || granted.includes('admin')
        if (action === 'write') return granted.includes('write') || granted.includes('admin')
        if (action === 'admin') return granted.includes('admin')
        return false // Permissions defined at this level, but requested action not allowed (blocks inheritance)
      }

      // Go up the tree
      const folder = await Folder.find(currentFolderId)
      if (!folder || !folder.parentId) {
        break
      }
      currentFolderId = folder.parentId
    }

    return false
  }

  /**
   * Grant permission to a user on a document.
   */
  static async grantDocument(userId: number, documentId: number, permission: DocumentAction) {
    await DocumentPermission.firstOrCreate(
      { userId, documentId, permission },
      { userId, documentId, permission }
    )
  }

  /**
   * Grant permission to a user on a folder.
   */
  static async grantFolder(userId: number, folderId: number, permission: FolderAction) {
    await FolderPermission.firstOrCreate(
      { userId, folderId, permission },
      { userId, folderId, permission }
    )
  }

  /**
   * Revoke a specific document permission.
   */
  static async revokeDocument(userId: number, documentId: number, permission: DocumentAction) {
    await DocumentPermission.query()
      .where('user_id', userId)
      .where('document_id', documentId)
      .where('permission', permission)
      .delete()
  }

  /**
   * Revoke all permissions for a user on a document.
   */
  static async revokeAllDocument(userId: number, documentId: number) {
    await DocumentPermission.query()
      .where('user_id', userId)
      .where('document_id', documentId)
      .delete()
  }
}
