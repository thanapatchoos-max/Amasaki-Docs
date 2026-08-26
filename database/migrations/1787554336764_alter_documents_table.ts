import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('folder_id').unsigned().nullable().references('id').inTable('folders').onDelete('SET NULL').after('id')
      table.integer('latest_version').unsigned().defaultTo(1).after('is_deleted')
      table.enum('status', ['active', 'expired']).defaultTo('active').after('latest_version')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('folder_id')
      table.dropColumn('latest_version')
      table.dropColumn('status')
    })
  }
}