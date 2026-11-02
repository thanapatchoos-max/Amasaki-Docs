import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const resource = this.resource
    const permissions = (resource.role?.permissions as Record<string, string[]> | null) ?? {}

    return {
      id: resource.id,
      username: (resource as any).username,
      fullName: (resource as any).fullName,
      email: (resource as any).email,
      initials: resource.initials,
      isAdmin: resource.isAdmin,
      createdAt: (resource as any).createdAt,
      updatedAt: (resource as any).updatedAt,
      role: resource.role
        ? { id: resource.role.id, name: resource.role.name }
        : null,
      permissions,
    }
  }
}
