import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.integer('parent_id').unsigned().nullable().references('id').inTable('folders').onDelete('SET NULL')
      table.integer('created_by').unsigned().notNullable().references('id').inTable('users')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}