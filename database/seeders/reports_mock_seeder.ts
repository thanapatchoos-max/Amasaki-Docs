import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Folder from '#models/folder'
import Document from '#models/document'
import DocumentVersion from '#models/document_version'
import Role from '#models/role'
import { DateTime } from 'luxon'

export default class ReportsMockSeeder extends BaseSeeder {
  async run() {
    const adminUser = await User.findBy('username', 'admin')
    if (!adminUser) return

    // Create more users
    const userRole = await Role.findBy('name', 'User')
    const users = []
    for (let i = 1; i <= 5; i++) {
      const u = await User.firstOrCreate(
        { username: `staff${i}` },
        { username: `staff${i}`, fullName: `Mock Staff ${i}`, password: 'password', roleId: userRole?.id, isActive: true }
      )
      users.push(u)
    }

    // Create Folders
    const mockFolder = await Folder.firstOrCreate(
      { name: 'Reports Mock Data' },
      { name: 'Reports Mock Data', createdBy: adminUser.id }
    )

    const exts = ['pdf', 'dwg', 'docx', 'xlsx', 'png']
    const statuses = ['active', 'active', 'active', 'expired']

    // Insert 50 documents randomly
    for (let i = 1; i <= 50; i++) {
      const ext = exts[Math.floor(Math.random() * exts.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const owner = users[Math.floor(Math.random() * users.length)]
      const expireAt = status === 'expired' 
        ? DateTime.now().minus({ days: 5 }) 
        : DateTime.now().plus({ days: Math.floor(Math.random() * 60) })

      const doc = await Document.create({
        name: `mock_doc_${i}.${ext}`,
        originalName: `mock_doc_${i}.${ext}`,
        extension: ext,
        folderId: mockFolder.id,
        ownerId: owner.id,
        status: status,
        expireAt: expireAt,
        latestVersion: 1
      })

      // Create version with random size between 1MB and 50MB
      await DocumentVersion.create({
        documentId: doc.id,
        versionNumber: 1,
        filepath: `mock/mock_doc_${i}.${ext}`,
        size: Math.floor(Math.random() * 50000000) + 1000000,
        uploadedById: owner.id
      })
    }
  }
}
