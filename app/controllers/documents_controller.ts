import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import DocumentVersion from '#models/document_version'
import Folder from '#models/folder'
import PermissionService from '#services/permission_service'
import AuditLogService from '#services/audit_log_service'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class DocumentsController {
  async index({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    const { search, type, status, owner, created_from, created_to, expire_from, expire_to } = request.qs()

    let query = Document.query().preload('folder').preload('owner').orderBy('created_at', 'desc')
    
    if (search) {
      query = query.where('name', 'like', `%${search}%`)
    }
    if (type) {
      const typesArray = Array.isArray(type) ? type : type.split(',')
      query = query.whereIn('extension', typesArray)
    }
    if (status) {
      query = query.where('status', status)
    }
    if (created_from) {
      query = query.where('created_at', '>=', `${created_from} 00:00:00`)
    }
    if (created_to) {
      query = query.where('created_at', '<=', `${created_to} 23:59:59`)
    }
    if (expire_from) {
      query = query.where('expire_at', '>=', `${expire_from} 00:00:00`)
    }
    if (expire_to) {
      query = query.where('expire_at', '<=', `${expire_to} 23:59:59`)
    }

    const documents = await query
    
    // Check view permission for each document (or filter out if not admin)
    const accessibleDocs = []
    for (const doc of documents) {
      if (owner && doc.owner && !doc.owner.username.toLowerCase().includes(owner.toLowerCase()) && !(doc.owner.fullName && doc.owner.fullName.toLowerCase().includes(owner.toLowerCase()))) {
        continue // Skip if owner filter doesn't match
      }

      if (await PermissionService.canOnDocument(user, 'view', doc.id)) {
        accessibleDocs.push(doc)
      } else if (doc.folderId && await PermissionService.canOnFolder(user, 'read', doc.folderId)) {
        accessibleDocs.push(doc)
      } else if (doc.ownerId === user.id) {
         accessibleDocs.push(doc) // Owner can view
      } else if (user.isAdmin) {
         accessibleDocs.push(doc)
      }
    }

    return inertia.render('(main)/documents/page', {
      documents: accessibleDocs.map(d => ({
        id: d.id,
        name: d.name,
        original_name: d.originalName,
        extension: d.extension,
        latest_version: d.latestVersion,
        owner: { full_name: d.owner?.fullName || d.owner?.username },
        folder: d.folder ? { id: d.folder.id, name: d.folder.name } : null,
        expire_at: d.expireAt?.toISO(),
        created_at: d.createdAt?.toISO(),
        status: d.status,
      })),
      filters: { search, type, status, owner, created_from, created_to, expire_from, expire_to }
    })
  }

  async upload({ request, inertia }: HttpContext) {
    const folders = await Folder.all()
    const folderId = request.input('folderId', null)
    return inertia.render('(main)/documents/upload/page', { 
        folders: folders.map(f => ({ id: f.id, name: f.name })),
        initialFolderId: folderId ? Number(folderId) : null
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const file = request.file('file', {
      size: '20mb',
      extnames: ['pdf', 'dwg', 'sldprt', 'sldasm', 'slddrw']
    })
    const name = request.input('name')
    const folderId = request.input('folder_id')
    const expireAt = request.input('expire_at')

    if (!file || !file.isValid) {
      session.flash('errors', { file: 'File is invalid or not allowed' })
      return response.redirect().back()
    }

    if (folderId && !(await PermissionService.canOnFolder(user, 'write', folderId))) {
      return response.unauthorized('No permission to upload to this folder')
    }

    const extension = file.extname || ''
    const uniqueFilename = `${randomUUID()}.${extension}`
    
    // Save file
    await file.move(app.makePath('storage/uploads'), {
      name: uniqueFilename
    })

    // Create Document
    const document = await Document.create({
      name,
      originalName: file.clientName,
      extension: extension,
      ownerId: user.id,
      folderId: folderId || null,
      expireAt: expireAt ? DateTime.fromISO(expireAt) : null,
      latestVersion: 1,
      status: 'active'
    })

    // Create Version 1
    await DocumentVersion.create({
      documentId: document.id,
      versionNumber: 1,
      filepath: uniqueFilename,
      size: file.size,
      uploadedById: user.id
    })

    await AuditLogService.log(user, 'Create', document.id, { version: 1, filename: file.clientName })

    session.flash('success', 'Document uploaded successfully')
    return response.redirect().toPath('/documents')
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const document = await Document.findOrFail(params.id)
    await document.load('versions', q => q.preload('uploadedBy').orderBy('version_number', 'desc'))
    await document.load('owner')

    // Simple permission check
    const canView = user.isAdmin || document.ownerId === user.id || 
                    await PermissionService.canOnDocument(user, 'view', document.id) || 
                    (document.folderId && await PermissionService.canOnFolder(user, 'read', document.folderId))
    
    if (!canView) return response.unauthorized('Access denied')

    return inertia.render('(main)/documents/[id]/page', {
      document: {
        id: document.id,
        name: document.name,
        original_name: document.originalName,
        extension: document.extension,
        owner: { full_name: document.owner?.fullName || document.owner?.username },
        latest_version: document.latestVersion,
        expire_at: document.expireAt?.toISO(),
        status: document.status,
        versions: document.versions.map(v => ({
           id: v.id,
           version_number: v.versionNumber,
           size: v.size,
           created_at: v.createdAt.toISO(),
           uploaded_by: { full_name: v.uploadedBy?.fullName || v.uploadedBy?.username }
        }))
      }
    })
  }

  async versions({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const document = await Document.findOrFail(params.id)
    await document.load('versions', q => q.preload('uploadedBy').orderBy('version_number', 'desc'))
    await document.load('owner')

    const canView = user.isAdmin || document.ownerId === user.id || 
                    await PermissionService.canOnDocument(user, 'view', document.id) || 
                    (document.folderId && await PermissionService.canOnFolder(user, 'read', document.folderId))
    
    if (!canView) return response.unauthorized('Access denied')

    return inertia.render('(main)/documents/[id]/versions/page', {
      document: {
        id: document.id,
        name: document.name,
        original_name: document.originalName,
        extension: document.extension,
        owner: { full_name: document.owner?.fullName || document.owner?.username },
        latest_version: document.latestVersion,
        expire_at: document.expireAt?.toISO(),
        status: document.status,
        versions: document.versions.map(v => ({
           id: v.id,
           version_number: v.versionNumber,
           size: v.size,
           created_at: v.createdAt.toISO(),
           uploaded_by: { full_name: v.uploadedBy?.fullName || v.uploadedBy?.username }
        }))
      }
    })
  }

  async updateVersion({ params, request, response, auth, session }: HttpContext) {
     const user = auth.user!
     const document = await Document.findOrFail(params.id)

     const canUpload = user.isAdmin || document.ownerId === user.id || 
                    await PermissionService.canOnDocument(user, 'upload', document.id) || 
                    (document.folderId && await PermissionService.canOnFolder(user, 'write', document.folderId))
     
     if (!canUpload) return response.unauthorized('Access denied')

     const file = request.file('file', {
       size: '20mb',
       extnames: ['pdf', 'dwg', 'sldprt', 'sldasm', 'slddrw']
     })

     if (!file || !file.isValid) {
        session.flash('errors', { file: 'File is invalid' })
        return response.redirect().back()
     }

     const extension = file.extname || ''
     const uniqueFilename = `${randomUUID()}.${extension}`
     
     await file.move(app.makePath('storage/uploads'), {
       name: uniqueFilename
     })

     const newVersionNumber = document.latestVersion + 1

     await DocumentVersion.create({
        documentId: document.id,
        versionNumber: newVersionNumber,
        filepath: uniqueFilename,
        size: file.size,
        uploadedById: user.id
     })

     document.latestVersion = newVersionNumber
     await document.save()

     session.flash('success', 'New version uploaded successfully')
     return response.redirect().back()
  }

  async download({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const document = await Document.findOrFail(params.id)

    const canView = user.isAdmin || document.ownerId === user.id || 
                    await PermissionService.canOnDocument(user, 'view', document.id) || 
                    (document.folderId && await PermissionService.canOnFolder(user, 'read', document.folderId))
    
    if (!canView) return response.unauthorized('Access denied')

    const latestVersion = await DocumentVersion.query()
      .where('document_id', document.id)
      .orderBy('version_number', 'desc')
      .firstOrFail()

    await AuditLogService.log(user, 'View', document.id, { version: latestVersion.versionNumber })

    return response.download(app.makePath(`storage/uploads/${latestVersion.filepath}`), document.originalName)
  }

  async downloadVersion({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const version = await DocumentVersion.findOrFail(params.versionId)
    const document = await Document.findOrFail(version.documentId)

    const canView = user.isAdmin || document.ownerId === user.id || 
                    await PermissionService.canOnDocument(user, 'view', document.id) || 
                    (document.folderId && await PermissionService.canOnFolder(user, 'read', document.folderId))
    
    if (!canView) return response.unauthorized('Access denied')

    await AuditLogService.log(user, 'View', document.id, { version: version.versionNumber })

    const ext = document.extension ? `.${document.extension}` : ''
    const downloadName = `${document.originalName.replace(ext, '')}_v${version.versionNumber}${ext}`
    
    return response.download(app.makePath(`storage/uploads/${version.filepath}`), downloadName)
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    const document = await Document.findOrFail(params.id)

    // Only Admin or Folder Admin can delete
    const canDelete = user.isAdmin || 
                      (document.folderId && await PermissionService.canOnFolder(user, 'admin', document.folderId)) ||
                      await PermissionService.canOnDocument(user, 'delete', document.id)

    if (!canDelete) return response.unauthorized('Access denied')

    document.isDeleted = true
    await document.save()

    await AuditLogService.log(user, 'Delete', document.id)

    session.flash('success', 'Document moved to trash')
    return response.redirect().toRoute('documents.index')
  }
}