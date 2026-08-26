import { AuditLogSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

export default class AuditLog extends AuditLogSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}