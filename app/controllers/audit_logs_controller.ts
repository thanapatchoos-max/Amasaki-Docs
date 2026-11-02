import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'

export default class AuditLogsController {
  async index({ request, inertia }: HttpContext) {
    const actions = request.input('actions', [])
    const userSearch = request.input('user')
    const dateFrom = request.input('date_from')
    const dateTo = request.input('date_to')

    const query = AuditLog.query().preload('user')

    if (actions) {
      const actionArray = Array.isArray(actions) ? actions : [actions]
      if (actionArray.length > 0 && actionArray[0] !== '') {
        query.whereIn('action', actionArray)
      }
    }

    if (userSearch) {
      query.whereHas('user', (q) => {
        q.where('full_name', 'like', `%${userSearch}%`)
         .orWhere('username', 'like', `%${userSearch}%`)
      })
    }

    if (dateFrom) {
      query.whereRaw('DATE(created_at) >= ?', [dateFrom])
    }

    if (dateTo) {
      query.whereRaw('DATE(created_at) <= ?', [dateTo])
    }

    const logs = await query.orderBy('created_at', 'desc').limit(200)

    const docIds: number[] = logs
      .filter((l) => l.targetType === 'Document' && l.targetId !== null && l.targetId !== undefined)
      .map((l) => Number(l.targetId))
    const Document = (await import('#models/document')).default
    const docs = docIds.length > 0 ? await Document.query().whereIn('id', docIds as any) : []
    const docMap = new Map<number, string>(
      docs.map((d) => [d.id, d.originalName || (d.name ? `${d.name}.${d.extension}` : `Document #${d.id}`)])
    )

    const folderIds: number[] = logs
      .filter((l) => l.targetType === 'Folder' && l.targetId !== null && l.targetId !== undefined)
      .map((l) => Number(l.targetId))
    const Folder = (await import('#models/folder')).default
    const folders = folderIds.length > 0 ? await Folder.query().whereIn('id', folderIds as any) : []
    const folderMap = new Map<number, string>(folders.map((f) => [f.id, f.name]))

    const filterActions = Array.isArray(actions) ? actions : (actions ? [actions] : [])

    return inertia.render('(main)/admin/audit-logs/page', {
      logs: logs.map(l => {
        let parsedDetails: any = null
        try {
          parsedDetails = l.details ? (typeof l.details === 'string' ? JSON.parse(l.details) : l.details) : null
        } catch {}

        const targetDocName = (l.targetId ? docMap.get(l.targetId) : null) || parsedDetails?.filename || parsedDetails?.name || null
        const targetFolderName = (l.targetId ? folderMap.get(l.targetId) : null) || parsedDetails?.folder_name || null
        const targetName = l.targetType === 'Document' ? targetDocName : (l.targetType === 'Folder' ? targetFolderName : null)

        let activitySummary = ''
        if (l.action === 'View') {
          activitySummary = `เปิดดูเอกสารผ่าน ${parsedDetails?.browser || 'Browser'}`
        } else if (l.action === 'Download') {
          activitySummary = `ดาวน์โหลดไฟล์เอกสาร${parsedDetails?.version ? ` (v${parsedDetails.version})` : ''}`
        } else if (l.action === 'Upload' || l.action === 'Create') {
          activitySummary = `อัปโหลดเอกสารใหม่${parsedDetails?.version ? ` (v${parsedDetails.version})` : ''}`
        } else if (l.action === 'Edit') {
          activitySummary = `แก้ไข / ปรับปรุงเวอร์ชัน${parsedDetails?.version ? ` (v${parsedDetails.version})` : ''}`
        } else if (l.action === 'Delete') {
          activitySummary = `ลบเอกสารเข้าถังขยะ`
        } else if (l.action === 'Copy') {
          activitySummary = `คัดลอกข้อมูล`
        } else if (l.action === 'Move') {
          activitySummary = `ย้ายตำแหน่งที่อยู่`
        } else {
          activitySummary = `${l.action} ${l.targetType}`
        }

        return {
          id: l.id,
          user: { full_name: l.user?.fullName, username: l.user?.username },
          action: l.action,
          target_type: l.targetType,
          target_id: l.targetId,
          document_id: l.targetType === 'Document' ? l.targetId : null,
          document_name: targetName,
          activity_summary: activitySummary,
          details: parsedDetails,
          created_at: l.createdAt.toISO()
        }
      }),
      meta: { total: logs.length, current_page: 1, last_page: 1 },
      filters: { 
        actions: filterActions, 
        user: userSearch || '', 
        date_from: dateFrom || '',
        date_to: dateTo || ''
      }
    })
  }
}