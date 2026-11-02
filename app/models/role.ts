import { RoleSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Role extends RoleSchema {
  @column({
    prepare: (value: any) => (value ? (typeof value === 'string' ? value : JSON.stringify(value)) : null),
    consume: (value: any) => {
      if (!value) return {}
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      }
      return value || {}
    },
  })
  declare permissions: Record<string, string[]> | null
}