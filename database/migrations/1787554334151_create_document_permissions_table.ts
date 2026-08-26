import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('document_id').unsigned().notNullable().references('id').inTable('documents').onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      // 'view' = download/read, 'upload' = upload new version, 'delete' = delete document
      table.enum('permission', ['view', 'upload', 'delete']).notNullable()
      table.timestamps(true, true)
      table.unique(['document_id', 'user_id', 'permission'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}