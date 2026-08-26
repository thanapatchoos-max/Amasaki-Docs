import { FolderSchema } from '#database/schema'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { hasMany, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Document from '#models/document'
import FolderPermission from '#models/folder_permission'

export default class Folder extends FolderSchema {
  @column()
  declare isPinned: boolean

  @belongsTo(() => Folder, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Folder>

  @hasMany(() => Folder, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Folder>

  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>

  @hasMany(() => FolderPermission)
  declare permissions: HasMany<typeof FolderPermission>
}