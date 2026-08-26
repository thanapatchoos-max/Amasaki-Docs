import { DocumentVersionSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import Document from '#models/document'
import User from '#models/user'

export default class DocumentVersion extends DocumentVersionSchema {
  @belongsTo(() => Document)
  declare document: BelongsTo<typeof Document>

  @belongsTo(() => User, { foreignKey: 'uploadedById' })
  declare uploadedBy: BelongsTo<typeof User>
}