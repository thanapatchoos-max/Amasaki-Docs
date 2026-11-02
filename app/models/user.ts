import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import Role from '#models/role'

const AuthFinder = withAuthFinder(() => hash.use(), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, AuthFinder) {
  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  get initials() {
    const name = this.fullName || this.username
    return name.slice(0, 2).toUpperCase()
  }

  get isAdmin() {
    // Hardcoded Admin bypass removed as requested.
    // All access should now be governed by dynamic permissions.
    return false
  }
}
