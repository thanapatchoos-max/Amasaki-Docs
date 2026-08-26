import { BaseCommand } from '@adonisjs/core/ace'
import Document from '#models/document'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class CheckExpiry extends BaseCommand {
  static commandName = 'check:expiry'
  static description = 'Check documents for expiration and trigger notifications'

  static options = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting document expiry check...')
    const today = DateTime.now().startOf('day')

    const documents = await Document.query()
      .whereNotNull('expire_at')
      .where('status', 'active')
      .where('is_deleted', false)
      .preload('owner')

    for (const doc of documents) {
      if (!doc.expireAt) continue
      const diff = Math.floor(doc.expireAt.startOf('day').diff(today, 'days').days)

      // 1. Expired
      if (diff < 0) {
        doc.status = 'expired'
        await doc.save()
        await this.notifyInApp(doc, 'expiring', `เอกสาร ${doc.name} หมดอายุแล้ว`)
        this.logger.info(`[EXPIRED] Document ID ${doc.id}`)
      }
      // 2. Alert 7 days + Email
      else if (diff <= 7 && diff > 0) {
        await this.notifyInApp(doc, 'expiring', `เอกสาร ${doc.name} จะหมดอายุในอีก ${diff} วัน`)
        this.logger.info(`[7 DAYS ALERT] Document ID ${doc.id}`)
      }
      // 3. Alert 30 days
      else if (diff <= 30 && diff > 7) {
        await this.notifyInApp(doc, 'expiring', `เอกสาร ${doc.name} จะหมดอายุในอีก ${diff} วัน`)
        this.logger.info(`[30 DAYS ALERT] Document ID ${doc.id}`)
      }
    }
    
    this.logger.success('Expiry check completed.')
  }

  private async notifyInApp(document: Document, type: string, message: string) {
    if (!document.ownerId) return

    try {
      await db.table('notifications').insert({
        user_id: document.ownerId,
        type: type,
        message: message,
        document_id: document.id,
        is_read: false,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      })
    } catch (e) {
      // ignore if notifications table doesn't exist
    }
  }
}