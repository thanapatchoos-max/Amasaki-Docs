import { DocumentPermissionSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import Document from '#models/document'
import User from '#models/user'

export default class DocumentPermission extends DocumentPermissionSchema {
  @belongsTo(() => Document)
  declare document: BelongsTo<typeof Document>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}