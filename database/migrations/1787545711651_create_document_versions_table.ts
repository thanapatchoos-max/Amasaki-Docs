import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_versions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('document_id').unsigned().references('id').inTable('documents').onDelete('CASCADE')
      table.integer('version_number').notNullable().defaultTo(1)
      table.string('filepath').notNullable()
      table.integer('size').notNullable() // Size in bytes
      table.integer('uploaded_by_id').unsigned().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}