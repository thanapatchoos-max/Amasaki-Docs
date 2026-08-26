import AuditLog from '#models/audit_log'
import User from '#models/user'

export type AuditAction = 'View' | 'Create' | 'Edit' | 'Delete' | 'Copy' | 'Move'

export default class AuditLogService {
  static async log(
    user: User,
    action: AuditAction,
    documentId: number,
    details?: Record<string, any>
  ) {
    await AuditLog.create({
      userId: user.id,
      action,
      targetType: 'document',
      targetId: documentId,
      details: details ? JSON.stringify(details) : null,
    })
  }
}
