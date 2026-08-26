import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('folder_id').unsigned().notNullable().references('id').inTable('folders').onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      // 'read' = list & view files, 'write' = upload new files, 'admin' = manage permissions + delete
      table.enum('permission', ['read', 'write', 'admin']).notNullable()
      table.timestamps(true, true)
      table.unique(['folder_id', 'user_id', 'permission'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}