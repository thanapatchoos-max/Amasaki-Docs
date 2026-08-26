import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Folder from '#models/folder'
import Document from '#models/document'
import DocumentVersion from '#models/document_version'
import { DateTime } from 'luxon'

export default class FoldersMockSeeder extends BaseSeeder {
  async run() {
    // 1. Get any user to own these folders
    const adminUser = await User.findBy('username', 'admin')
    if (!adminUser) return

    const user = adminUser

    // 2. Create several Root Folders
    const folderNames = [
      'Financial Reports 2026',
      'HR Policies & Guidelines',
      'Marketing Assets',
      'Client Contracts',
      'IT Infrastructure',
      'Legal Documents',
      'Meeting Minutes'
    ]

    for (let i = 0; i < folderNames.length; i++) {
      const folder = await Folder.firstOrCreate(
        { name: folderNames[i] },
        { 
          name: folderNames[i], 
          createdBy: user.id, 
          parentId: null, 
          isPinned: i < 2 // Pin the first two
        }
      )

      // Grant write permission to everyone
      const FolderPermission = (await import('#models/folder_permission')).default
      await FolderPermission.firstOrCreate(
        { folderId: folder.id, permission: 'write', userId: null, roleId: null },
        { folderId: folder.id, permission: 'write', userId: null, roleId: null }
      )

      // Insert 5-15 documents into each folder
      const numDocs = Math.floor(Math.random() * 10) + 5
      const exts = ['pdf', 'dwg', 'docx', 'xlsx', 'png', 'txt', 'csv']
      
      for (let j = 1; j <= numDocs; j++) {
        const ext = exts[Math.floor(Math.random() * exts.length)]
        
        const doc = await Document.create({
          name: `${folderNames[i].split(' ')[0]}_Doc_${j}.${ext}`,
          originalName: `${folderNames[i].split(' ')[0]}_Doc_${j}.${ext}`,
          extension: ext,
          folderId: folder.id,
          ownerId: user.id,
          status: 'active',
          expireAt: DateTime.now().plus({ days: Math.floor(Math.random() * 300) }),
          latestVersion: 1
        })

        await DocumentVersion.create({
          documentId: doc.id,
          versionNumber: 1,
          filepath: `mock/${folderNames[i].split(' ')[0]}_Doc_${j}.${ext}`,
          size: Math.floor(Math.random() * 5000000) + 10000,
          uploadedById: user.id
        })
      }
    }
  }
}
