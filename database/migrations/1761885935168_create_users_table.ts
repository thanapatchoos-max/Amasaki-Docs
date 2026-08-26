import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username').notNullable().unique() // AD Username
      table.string('full_name').nullable()
      table.string('email', 254).nullable().unique()
      table.string('password').nullable() // Nullable if using AD solely
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL')
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
