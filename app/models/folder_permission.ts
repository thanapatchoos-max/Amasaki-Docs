import { FolderPermissionSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import Folder from '#models/folder'
import User from '#models/user'
import Role from '#models/role'

export default class FolderPermission extends FolderPermissionSchema {
  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>
}