import AuditLog from '#models/audit_log'
import User from '#models/user'

export type AuditAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Update'
  | 'Delete'
  | 'Copy'
  | 'Move'
  | 'Restore'
  | 'Force Delete'
  | 'Download'

export default class AuditLogService {
  static async log(
    user: User,
    action: AuditAction,
    targetId: number,
    details?: Record<string, any>,
    targetType: string = 'document'
  ) {
    await AuditLog.create({
      userId: user.id,
      action,
      targetType,
      targetId,
      details: details ? JSON.stringify(details) : null,
    })
  }
}
