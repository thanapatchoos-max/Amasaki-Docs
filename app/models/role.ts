import { RoleSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Role extends RoleSchema {
  @column()
  declare permissions: Record<string, string[]> | null
}