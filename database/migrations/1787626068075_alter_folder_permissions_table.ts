import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_permissions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['folder_id', 'user_id', 'permission'])
      table.integer('user_id').unsigned().nullable().alter()
      table.integer('role_id').unsigned().nullable().references('id').inTable('roles').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role_id')
      table.integer('user_id').unsigned().notNullable().alter()
      table.unique(['folder_id', 'user_id', 'permission'])
    })
  }
}