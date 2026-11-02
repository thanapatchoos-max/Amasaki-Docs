import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable() // 'EMAIL', 'ALERT'
      table.string('title').notNullable()
      table.text('message').notNullable()
      table.boolean('is_read').defaultTo(false)
      table.timestamp('read_at', { useTz: true }).nullable()
      table.integer('document_id').unsigned().references('id').inTable('documents').nullable().onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}