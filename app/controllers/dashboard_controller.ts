import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import Folder from '#models/folder'
import AuditLog from '#models/audit_log'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const totalDocs = await Document.query().where('is_deleted', false).count('* as total')
    const totalFolders = await Folder.query().count('* as total')
    
    const today = DateTime.now().startOf('day').toSQLDate()
    const in30Days = DateTime.now().plus({ days: 30 }).endOf('day').toSQLDate()
    
    const expiringSoonDocs = await Document.query()
      .where('is_deleted', false)
      .whereNotNull('expire_at')
      .where('expire_at', '<=', in30Days)
      .where('expire_at', '>=', today)
      .count('* as total')
      .catch(() => [{ $extras: { total: 0 } }])

    const expiringList = await Document.query()
      .where('is_deleted', false)
      .whereNotNull('expire_at')
      .where('expire_at', '<=', in30Days)
      .where('expire_at', '>=', today)
      .preload('folder')
      .orderBy('expire_at', 'asc')
      .limit(5)

    const recentActions = await AuditLog.query()
      .where('created_at', '>=', DateTime.now().minus({ days: 1 }).toSQL())
      .count('* as total')
      .catch(() => [{ $extras: { total: 0 } }])

    const recentActivities = await AuditLog.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(8)

    const docIds = recentActivities.map((a) => a.targetId).filter((id): id is number => id !== null)
    const docs = await Document.query().whereIn('id', docIds).preload('folder')
    const docMap = new Map(docs.map((d) => [d.id, d]))

    const typeBreakdown = await db.rawQuery(`
      SELECT extension, COUNT(*) as count 
      FROM documents 
      WHERE is_deleted = false 
      GROUP BY extension
    `).catch(() => [])
    
    const typeBreakdownData = Array.isArray(typeBreakdown) ? typeBreakdown : typeBreakdown[0] || []

    const storageBreakdown = await db.rawQuery(`
      SELECT d.extension, SUM(dv.size) as total_size
      FROM document_versions dv
      JOIN documents d ON d.id = dv.document_id
      WHERE d.is_deleted = false
      GROUP BY d.extension
    `).catch(() => [])
    
    const storageBreakdownData = Array.isArray(storageBreakdown) ? storageBreakdown : storageBreakdown[0] || []

    return inertia.render('(main)/dashboard/page', {
      stats: {
        total_documents: totalDocs[0]?.$extras?.total ?? 0,
        total_folders: totalFolders[0]?.$extras?.total ?? 0,
        expiring_soon: expiringSoonDocs[0]?.$extras?.total ?? 0,
        recent_actions: recentActions[0]?.$extras?.total ?? 0
      },
      storage_breakdown: storageBreakdownData,
      expiring_documents: expiringList.map((d) => ({
        id: d.id,
        name: d.name,
        extension: d.extension,
        expire_at: d.expireAt?.toISO(),
        folder_name: d.folder ? d.folder.name : 'หน้าหลัก'
      })),
      recent_activities: recentActivities.map((a) => {
        const doc = a.targetId !== null ? docMap.get(a.targetId) : undefined
        return {
          id: a.id,
          action: a.action,
          document_id: doc?.id,
          document_name: doc?.name || (a.details?.name || `Document #${a.targetId}`),
          extension: doc?.extension || '—',
          version: a.details?.version || doc?.latestVersion || 1,
          expire_at: doc?.expireAt?.toISO() || null,
          folder_name: doc?.folder ? doc.folder.name : 'หน้าหลัก',
          user: a.user?.fullName || a.user?.username || '—',
          created_at: a.createdAt.toISO()
        }
      }),
      file_type_breakdown: typeBreakdownData
    })
  }

  async expiring({ inertia }: HttpContext) {
    const today = DateTime.now().startOf('day').toSQLDate()
    const in30Days = DateTime.now().plus({ days: 30 }).endOf('day').toSQLDate()
    
    const documents = await Document.query()
      .where('is_deleted', false)
      .whereNotNull('expire_at')
      .where('expire_at', '<=', in30Days)
      .where('expire_at', '>=', today)
      .preload('folder')
      .preload('owner')
      .orderBy('expire_at', 'asc')

    return inertia.render('(main)/documents/expiring/page', {
      documents: documents.map(d => ({
        id: d.id,
        name: d.name,
        extension: d.extension,
        expire_at: d.expireAt?.toISO(),
        latest_version: d.latestVersion,
        folder_name: d.folder ? d.folder.name : 'หน้าหลัก',
        owner: d.owner?.fullName || d.owner?.username || '—'
      }))
    })
  }
}