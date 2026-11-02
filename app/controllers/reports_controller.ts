import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ReportsController {
  async index({ inertia }: HttpContext) {
    // 1. Expiry & Compliance (Documents with expiration, nearest first)
    const expiryRaw = await db.rawQuery(`
      SELECT d.id, d.name as document_name, d.status, d.expire_at, f.name as folder_name, u.full_name as owner_name
      FROM documents d
      LEFT JOIN folders f ON d.folder_id = f.id
      LEFT JOIN users u ON d.owner_id = u.id
      WHERE d.is_deleted = false AND d.expire_at IS NOT NULL
      ORDER BY d.expire_at ASC
      LIMIT 200
    `)

    // 2. Audit Trail (Latest 200 logs)
    const auditRaw = await db.rawQuery(`
      SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.created_at, u.full_name as user_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 200
    `)
    
    const auditData = auditRaw.map((row: any) => {
      let detailsObj = row.details
      if (typeof detailsObj === 'string') {
        try { detailsObj = JSON.parse(detailsObj) } catch (e) {}
      }
      return {
        id: row.id,
        action: row.action,
        target_type: row.target_type,
        target_id: row.target_id,
        details: typeof detailsObj === 'object' && detailsObj ? JSON.stringify(detailsObj) : String(row.details || ''),
        created_at: row.created_at,
        user_name: row.user_name || 'System'
      }
    })

    // 3. Storage Analytics (Folder breakdown)
    const storageRaw = await db.rawQuery(`
      SELECT f.id, f.name as folder_name, COUNT(d.id) as doc_count, COALESCE(SUM(v.size), 0) as total_size
      FROM folders f
      LEFT JOIN documents d ON f.id = d.folder_id AND d.is_deleted = false
      LEFT JOIN document_versions v ON d.id = v.document_id AND d.latest_version = v.version_number
      GROUP BY f.id, f.name
      ORDER BY total_size DESC
    `)

    // 4. Inactive Documents (Oldest updated documents, limit 200)
    const inactiveRaw = await db.rawQuery(`
      SELECT d.id, d.name as document_name, d.updated_at, v.size, u.full_name as owner_name, f.name as folder_name
      FROM documents d
      LEFT JOIN document_versions v ON d.id = v.document_id AND d.latest_version = v.version_number
      LEFT JOIN users u ON d.owner_id = u.id
      LEFT JOIN folders f ON d.folder_id = f.id
      WHERE d.is_deleted = false
      ORDER BY d.updated_at ASC
      LIMIT 200
    `)

    return inertia.render('(main)/reports/page', {
      expiryData: expiryRaw,
      auditData,
      storageData: storageRaw,
      inactiveData: inactiveRaw
    })
  }
}
