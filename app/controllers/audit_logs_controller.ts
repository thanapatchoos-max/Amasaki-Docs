import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'

export default class AuditLogsController {
  async index({ inertia }: HttpContext) {
    const logs = await AuditLog.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(100) // limit for simple implementation

    return inertia.render('(main)/admin/audit-logs/page', {
      logs: logs.map(l => ({
        id: l.id,
        user: { full_name: l.user?.fullName, username: l.user?.username },
        action: l.action,
        target_type: l.targetType,
        target_id: l.targetId,
        details: l.details ? JSON.parse(l.details) : null,
        created_at: l.createdAt.toISO()
      })),
      meta: { total: logs.length, current_page: 1, last_page: 1 }
    })
  }
}