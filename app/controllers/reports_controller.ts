import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import Folder from '#models/folder'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class ReportsController {
  async index({ inertia }: HttpContext) {
    // 1. Top Uploaders (Users who uploaded the most documents)
    const topUploadersRaw = await db.rawQuery(`
      SELECT u.id, u.full_name, u.username, COUNT(d.id) as document_count
      FROM users u
      LEFT JOIN documents d ON u.id = d.owner_id AND d.is_deleted = false
      GROUP BY u.id, u.full_name, u.username
      ORDER BY document_count DESC
      LIMIT 5
    `)
    const topUploaders = topUploadersRaw.map((row: any) => ({
      id: row.id,
      name: row.full_name || row.username,
      count: Number(row.document_count)
    }))

    // 2. Folder Storage Breakdown
    const folderBreakdownRaw = await db.rawQuery(`
      SELECT f.id, f.name, COUNT(d.id) as doc_count, COALESCE(SUM(v.size), 0) as total_size
      FROM folders f
      LEFT JOIN documents d ON f.id = d.folder_id AND d.is_deleted = false
      LEFT JOIN document_versions v ON d.id = v.document_id AND d.latest_version = v.version_number
      GROUP BY f.id, f.name
      ORDER BY total_size DESC
      LIMIT 10
    `)
    const folderBreakdown = folderBreakdownRaw.map((row: any) => ({
      id: row.id,
      name: row.name,
      doc_count: Number(row.doc_count),
      total_size: Number(row.total_size)
    }))

    // 3. Document Status Summary
    const statusSummaryRaw = await db.rawQuery(`
      SELECT status, COUNT(id) as count
      FROM documents
      WHERE is_deleted = false
      GROUP BY status
    `)
    const statuses = statusSummaryRaw.reduce((acc: any, row: any) => {
      acc[row.status || 'Active'] = Number(row.count)
      return acc
    }, {})

    // 4. File Types (Extensions)
    const extSummaryRaw = await db.rawQuery(`
      SELECT extension, COUNT(id) as count
      FROM documents
      WHERE is_deleted = false
      GROUP BY extension
      ORDER BY count DESC
      LIMIT 5
    `)
    const fileTypes = extSummaryRaw.map((row: any) => ({
      ext: row.extension?.toUpperCase() || 'UNKNOWN',
      count: Number(row.count)
    }))

    return inertia.render('(main)/reports/page', {
      topUploaders,
      folderBreakdown,
      statuses,
      fileTypes
    })
  }
}
