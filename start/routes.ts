/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// ─── Guest-only routes ────────────────────────────────────────────────────────
router
  .group(() => {
    router.get('/login', [controllers.Session, 'create']).as('session.create')
    router.post('/login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

// ─── Authenticated routes ─────────────────────────────────────────────────────
router
  .group(() => {

    // Auth
    router.post('/logout', [controllers.Session, 'destroy']).as('session.destroy')

    // Dashboard
    router.get('/', [controllers.Dashboard, 'index']).as('home')
    router.get('/dashboard/expiring', [controllers.Dashboard, 'expiring']).as('dashboard.expiring')

    // Reports
    const ReportsController = () => import('#controllers/reports_controller')
    router.get('/reports', [ReportsController, 'index']).as('reports.index')

    // ─── Documents ───────────────────────────────────────────────────────────
    router.get('/documents', [controllers.Documents, 'index']).as('documents.index')
    router.get('/documents/upload', [controllers.Documents, 'upload']).as('documents.upload')
    router.post('/documents', [controllers.Documents, 'store']).as('documents.store')
    router.get('/documents/:id', [controllers.Documents, 'show']).as('documents.show')
    router.delete('/documents/:id', [controllers.Documents, 'destroy']).as('documents.destroy')
    router.get('/documents/:id/download', [controllers.Documents, 'download']).as('documents.download')
    router.post('/documents/:id/update', [controllers.Documents, 'updateVersion']).as('documents.updateVersion')
    router.get('/documents/:id/versions', [controllers.Documents, 'versions']).as('documents.versions')
    router.get('/documents/versions/:versionId/download', [controllers.Documents, 'downloadVersion']).as('documents.downloadVersion')

    // ─── Folders ─────────────────────────────────────────────────────────────
    router.get('/folders', [controllers.Folders, 'index']).as('folders.index')
    router.get('/folders/:id', [controllers.Folders, 'show']).as('folders.show')
    router.post('/folders', [controllers.Folders, 'store']).as('folders.store')
    router.patch('/folders/:id', [controllers.Folders, 'update']).as('folders.update')
    router.post('/folders/:id/pin', [controllers.Folders, 'togglePin']).as('folders.pin')
    router.delete('/folders/:id', [controllers.Folders, 'destroy']).as('folders.destroy')
    router.post('/folders/:id/permissions', [controllers.FolderPermissions, 'store']).as('folder_permissions.store')
    router.delete('/folders/:id/permissions/:permissionId', [controllers.FolderPermissions, 'destroy']).as('folder_permissions.destroy')

    // ─── Notifications ────────────────────────────────────────────────────────
    router.get('/notifications', async ({ inertia }) =>
      inertia.render('(main)/notifications/page', { notifications: [] })
    ).as('notifications.index')

    // ─── Admin ────────────────────────────────────────────────────────────────
    router
      .group(() => {
        // Users
        router.get('/users', [controllers.AdminUsers, 'index']).as('admin.users')
        router.post('/users', [controllers.AdminUsers, 'store']).as('admin.users.store')
        router.patch('/users/:id', [controllers.AdminUsers, 'update']).as('admin.users.update')
        router.delete('/users/:id', [controllers.AdminUsers, 'destroy']).as('admin.users.destroy')

        // Audit Logs
        router.get('/audit-logs', [controllers.AuditLogs, 'index']).as('admin.audit_logs')

        // Roles
        router.get('/roles', [controllers.AdminRoles, 'index']).as('admin.roles')
        router.get('/roles/create', [controllers.AdminRoles, 'create']).as('admin.roles.create')
        router.post('/roles', [controllers.AdminRoles, 'store']).as('admin.roles.store')
        router.get('/roles/:id/edit', [controllers.AdminRoles, 'edit']).as('admin.roles.edit')
        router.patch('/roles/:id', [controllers.AdminRoles, 'update']).as('admin.roles.update')
        router.delete('/roles/:id', [controllers.AdminRoles, 'destroy']).as('admin.roles.destroy')
      })
      .prefix('/admin')

  })
  .use(middleware.auth())
