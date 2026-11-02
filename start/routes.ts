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
    router.get('/', [controllers.Dashboard, 'index']).as('home').use(middleware.permission(['dashboard', 'view']))
    router.get('/dashboard/expiring', [controllers.Dashboard, 'expiring']).as('dashboard.expiring').use(middleware.permission(['dashboard', 'view_expiring']))

    // Reports
    const ReportsController = () => import('#controllers/reports_controller')
    router.get('/reports', [ReportsController, 'index']).as('reports.index').use(middleware.permission(['reports', 'view']))

    // ─── Documents ───────────────────────────────────────────────────────────
    router.get('/documents', [controllers.Documents, 'index']).as('documents.index').use(middleware.permission(['documents', 'view']))
    router.post('/documents/bulk-delete', [controllers.Documents, 'bulkDestroy']).as('documents.bulkDestroy').use(middleware.permission(['documents', 'delete']))
    router.get('/documents/upload', [controllers.Documents, 'upload']).as('documents.upload').use(middleware.permission(['documents', 'upload']))
    router.post('/documents', [controllers.Documents, 'store']).as('documents.store').use(middleware.permission(['documents', 'upload']))
    router.get('/documents/:id', [controllers.Documents, 'show']).as('documents.show').use(middleware.permission(['documents', 'view']))
    router.delete('/documents/:id', [controllers.Documents, 'destroy']).as('documents.destroy').use(middleware.permission(['documents', 'delete']))
    router.get('/documents/:id/download', [controllers.Documents, 'download']).as('documents.download').use(middleware.permission(['documents', 'download']))
    router.post('/documents/:id/update', [controllers.Documents, 'updateVersion']).as('documents.updateVersion').use(middleware.permission(['documents', 'update_version']))
    router.get('/documents/:id/versions', [controllers.Documents, 'versions']).as('documents.versions').use(middleware.permission(['documents', 'view']))
    router.get('/documents/versions/:versionId/download', [controllers.Documents, 'downloadVersion']).as('documents.downloadVersion').use(middleware.permission(['documents', 'download']))

    // ─── Folders ─────────────────────────────────────────────────────────────
    router.get('/folders', [controllers.Folders, 'index']).as('folders.index').use(middleware.permission(['folders', 'view']))
    router.get('/folders/:id', [controllers.Folders, 'show']).as('folders.show').use(middleware.permission(['folders', 'view']))
    router.post('/folders', [controllers.Folders, 'store']).as('folders.store').use(middleware.permission(['folders', 'create']))
    router.patch('/folders/:id', [controllers.Folders, 'update']).as('folders.update').use(middleware.permission(['folders', 'edit']))
    router.post('/folders/:id/pin', [controllers.Folders, 'togglePin']).as('folders.pin').use(middleware.permission(['folders', 'pin']))
    router.delete('/folders/:id', [controllers.Folders, 'destroy']).as('folders.destroy').use(middleware.permission(['folders', 'delete']))
    router.post('/folders/:id/permissions', [controllers.FolderPermissions, 'store']).as('folder_permissions.store').use(middleware.permission(['folders', 'manage_permissions']))
    router.delete('/folders/:id/permissions/:permissionId', [controllers.FolderPermissions, 'destroy']).as('folder_permissions.destroy').use(middleware.permission(['folders', 'manage_permissions']))

    // ─── Trash ────────────────────────────────────────────────────────────────
    const TrashController = () => import('#controllers/trash_controller')
    router.get('/trash', [TrashController, 'index']).as('trash.index').use(middleware.permission(['trash', 'view']))
    router.post('/trash/restore', [TrashController, 'restore']).as('trash.restore').use(middleware.permission(['trash', 'restore']))
    router.post('/trash/force-delete', [TrashController, 'forceDelete']).as('trash.forceDelete').use(middleware.permission(['trash', 'force_delete']))

    // ─── Notifications ────────────────────────────────────────────────────────
    router.get('/notifications', async ({ auth, inertia }) => {
      const { default: Notification } = await import('#models/notification')
      const notifications = await Notification.query()
        .where('user_id', auth.user!.id)
        .orderBy('created_at', 'desc')
        .limit(50)
      return inertia.render('(main)/notifications/page', {
        notifications: notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type.toLowerCase(),
          document_id: n.documentId,
          is_read: n.isRead ?? false,
          created_at: n.createdAt?.toISO() ?? new Date().toISOString()
        }))
      })
    }).as('notifications.index')

    // ─── Admin ────────────────────────────────────────────────────────────────
    router
      .group(() => {
        // Users
        router.get('/users', [controllers.AdminUsers, 'index']).as('admin.users').use(middleware.permission(['users', 'view']))
        router.post('/users', [controllers.AdminUsers, 'store']).as('admin.users.store').use(middleware.permission(['users', 'create']))
        router.patch('/users/:id', [controllers.AdminUsers, 'update']).as('admin.users.update').use(middleware.permission(['users', 'edit']))
        router.delete('/users/:id', [controllers.AdminUsers, 'destroy']).as('admin.users.destroy').use(middleware.permission(['users', 'delete']))

        // Audit Logs
        router.get('/audit-logs', [controllers.AuditLogs, 'index']).as('admin.audit_logs').use(middleware.permission(['audit_logs', 'view']))

        // Roles
        router.get('/roles', [controllers.AdminRoles, 'index']).as('admin.roles').use(middleware.permission(['roles', 'view']))
        router.get('/roles/create', [controllers.AdminRoles, 'create']).as('admin.roles.create').use(middleware.permission(['roles', 'create']))
        router.post('/roles', [controllers.AdminRoles, 'store']).as('admin.roles.store').use(middleware.permission(['roles', 'create']))
        router.get('/roles/:id/edit', [controllers.AdminRoles, 'edit']).as('admin.roles.edit').use(middleware.permission(['roles', 'edit']))
        router.patch('/roles/:id', [controllers.AdminRoles, 'update']).as('admin.roles.update').use(middleware.permission(['roles', 'edit']))
        router.delete('/roles/:id', [controllers.AdminRoles, 'destroy']).as('admin.roles.destroy').use(middleware.permission(['roles', 'delete']))
      })
      .prefix('/admin')

  })
  .use(middleware.auth())
