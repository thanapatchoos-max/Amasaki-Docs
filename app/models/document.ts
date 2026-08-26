import { DocumentSchema } from '#database/schema'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { hasMany, belongsTo } from '@adonisjs/lucid/orm'
import DocumentVersion from '#models/document_version'
import DocumentPermission from '#models/document_permission'
import Folder from '#models/folder'
import User from '#models/user'

export default class Document extends DocumentSchema {
  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => DocumentVersion)
  declare versions: HasMany<typeof DocumentVersion>

  @hasMany(() => DocumentPermission)
  declare permissions: HasMany<typeof DocumentPermission>
}