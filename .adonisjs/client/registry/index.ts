/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'dashboard.expiring': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/expiring',
    tokens: [{"old":"/dashboard/expiring","type":0,"val":"dashboard","end":""},{"old":"/dashboard/expiring","type":0,"val":"expiring","end":""}],
    types: placeholder as Registry['dashboard.expiring']['types'],
  },
  'reports.index': {
    methods: ["GET","HEAD"],
    pattern: '/reports',
    tokens: [{"old":"/reports","type":0,"val":"reports","end":""}],
    types: placeholder as Registry['reports.index']['types'],
  },
  'documents.index': {
    methods: ["GET","HEAD"],
    pattern: '/documents',
    tokens: [{"old":"/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['documents.index']['types'],
  },
  'documents.bulkDestroy': {
    methods: ["POST"],
    pattern: '/documents/bulk-delete',
    tokens: [{"old":"/documents/bulk-delete","type":0,"val":"documents","end":""},{"old":"/documents/bulk-delete","type":0,"val":"bulk-delete","end":""}],
    types: placeholder as Registry['documents.bulkDestroy']['types'],
  },
  'documents.upload': {
    methods: ["GET","HEAD"],
    pattern: '/documents/upload',
    tokens: [{"old":"/documents/upload","type":0,"val":"documents","end":""},{"old":"/documents/upload","type":0,"val":"upload","end":""}],
    types: placeholder as Registry['documents.upload']['types'],
  },
  'documents.store': {
    methods: ["POST"],
    pattern: '/documents',
    tokens: [{"old":"/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['documents.store']['types'],
  },
  'documents.show': {
    methods: ["GET","HEAD"],
    pattern: '/documents/:id',
    tokens: [{"old":"/documents/:id","type":0,"val":"documents","end":""},{"old":"/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['documents.show']['types'],
  },
  'documents.destroy': {
    methods: ["DELETE"],
    pattern: '/documents/:id',
    tokens: [{"old":"/documents/:id","type":0,"val":"documents","end":""},{"old":"/documents/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['documents.destroy']['types'],
  },
  'documents.download': {
    methods: ["GET","HEAD"],
    pattern: '/documents/:id/download',
    tokens: [{"old":"/documents/:id/download","type":0,"val":"documents","end":""},{"old":"/documents/:id/download","type":1,"val":"id","end":""},{"old":"/documents/:id/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['documents.download']['types'],
  },
  'documents.updateVersion': {
    methods: ["POST"],
    pattern: '/documents/:id/update',
    tokens: [{"old":"/documents/:id/update","type":0,"val":"documents","end":""},{"old":"/documents/:id/update","type":1,"val":"id","end":""},{"old":"/documents/:id/update","type":0,"val":"update","end":""}],
    types: placeholder as Registry['documents.updateVersion']['types'],
  },
  'documents.versions': {
    methods: ["GET","HEAD"],
    pattern: '/documents/:id/versions',
    tokens: [{"old":"/documents/:id/versions","type":0,"val":"documents","end":""},{"old":"/documents/:id/versions","type":1,"val":"id","end":""},{"old":"/documents/:id/versions","type":0,"val":"versions","end":""}],
    types: placeholder as Registry['documents.versions']['types'],
  },
  'documents.downloadVersion': {
    methods: ["GET","HEAD"],
    pattern: '/documents/versions/:versionId/download',
    tokens: [{"old":"/documents/versions/:versionId/download","type":0,"val":"documents","end":""},{"old":"/documents/versions/:versionId/download","type":0,"val":"versions","end":""},{"old":"/documents/versions/:versionId/download","type":1,"val":"versionId","end":""},{"old":"/documents/versions/:versionId/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['documents.downloadVersion']['types'],
  },
  'folders.index': {
    methods: ["GET","HEAD"],
    pattern: '/folders',
    tokens: [{"old":"/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folders.index']['types'],
  },
  'folders.show': {
    methods: ["GET","HEAD"],
    pattern: '/folders/:id',
    tokens: [{"old":"/folders/:id","type":0,"val":"folders","end":""},{"old":"/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.show']['types'],
  },
  'folders.store': {
    methods: ["POST"],
    pattern: '/folders',
    tokens: [{"old":"/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folders.store']['types'],
  },
  'folders.update': {
    methods: ["PATCH"],
    pattern: '/folders/:id',
    tokens: [{"old":"/folders/:id","type":0,"val":"folders","end":""},{"old":"/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.update']['types'],
  },
  'folders.pin': {
    methods: ["POST"],
    pattern: '/folders/:id/pin',
    tokens: [{"old":"/folders/:id/pin","type":0,"val":"folders","end":""},{"old":"/folders/:id/pin","type":1,"val":"id","end":""},{"old":"/folders/:id/pin","type":0,"val":"pin","end":""}],
    types: placeholder as Registry['folders.pin']['types'],
  },
  'folders.destroy': {
    methods: ["DELETE"],
    pattern: '/folders/:id',
    tokens: [{"old":"/folders/:id","type":0,"val":"folders","end":""},{"old":"/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.destroy']['types'],
  },
  'folder_permissions.store': {
    methods: ["POST"],
    pattern: '/folders/:id/permissions',
    tokens: [{"old":"/folders/:id/permissions","type":0,"val":"folders","end":""},{"old":"/folders/:id/permissions","type":1,"val":"id","end":""},{"old":"/folders/:id/permissions","type":0,"val":"permissions","end":""}],
    types: placeholder as Registry['folder_permissions.store']['types'],
  },
  'folder_permissions.destroy': {
    methods: ["DELETE"],
    pattern: '/folders/:id/permissions/:permissionId',
    tokens: [{"old":"/folders/:id/permissions/:permissionId","type":0,"val":"folders","end":""},{"old":"/folders/:id/permissions/:permissionId","type":1,"val":"id","end":""},{"old":"/folders/:id/permissions/:permissionId","type":0,"val":"permissions","end":""},{"old":"/folders/:id/permissions/:permissionId","type":1,"val":"permissionId","end":""}],
    types: placeholder as Registry['folder_permissions.destroy']['types'],
  },
  'trash.index': {
    methods: ["GET","HEAD"],
    pattern: '/trash',
    tokens: [{"old":"/trash","type":0,"val":"trash","end":""}],
    types: placeholder as Registry['trash.index']['types'],
  },
  'trash.restore': {
    methods: ["POST"],
    pattern: '/trash/restore',
    tokens: [{"old":"/trash/restore","type":0,"val":"trash","end":""},{"old":"/trash/restore","type":0,"val":"restore","end":""}],
    types: placeholder as Registry['trash.restore']['types'],
  },
  'trash.forceDelete': {
    methods: ["POST"],
    pattern: '/trash/force-delete',
    tokens: [{"old":"/trash/force-delete","type":0,"val":"trash","end":""},{"old":"/trash/force-delete","type":0,"val":"force-delete","end":""}],
    types: placeholder as Registry['trash.forceDelete']['types'],
  },
  'notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/notifications',
    tokens: [{"old":"/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['notifications.index']['types'],
  },
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
  },
  'admin.users.store': {
    methods: ["POST"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.store']['types'],
  },
  'admin.users.update': {
    methods: ["PATCH"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.update']['types'],
  },
  'admin.users.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.destroy']['types'],
  },
  'admin.audit_logs': {
    methods: ["GET","HEAD"],
    pattern: '/admin/audit-logs',
    tokens: [{"old":"/admin/audit-logs","type":0,"val":"admin","end":""},{"old":"/admin/audit-logs","type":0,"val":"audit-logs","end":""}],
    types: placeholder as Registry['admin.audit_logs']['types'],
  },
  'admin.roles': {
    methods: ["GET","HEAD"],
    pattern: '/admin/roles',
    tokens: [{"old":"/admin/roles","type":0,"val":"admin","end":""},{"old":"/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['admin.roles']['types'],
  },
  'admin.roles.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/roles/create',
    tokens: [{"old":"/admin/roles/create","type":0,"val":"admin","end":""},{"old":"/admin/roles/create","type":0,"val":"roles","end":""},{"old":"/admin/roles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.roles.create']['types'],
  },
  'admin.roles.store': {
    methods: ["POST"],
    pattern: '/admin/roles',
    tokens: [{"old":"/admin/roles","type":0,"val":"admin","end":""},{"old":"/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['admin.roles.store']['types'],
  },
  'admin.roles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/roles/:id/edit',
    tokens: [{"old":"/admin/roles/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/roles/:id/edit","type":0,"val":"roles","end":""},{"old":"/admin/roles/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/roles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.roles.edit']['types'],
  },
  'admin.roles.update': {
    methods: ["PATCH"],
    pattern: '/admin/roles/:id',
    tokens: [{"old":"/admin/roles/:id","type":0,"val":"admin","end":""},{"old":"/admin/roles/:id","type":0,"val":"roles","end":""},{"old":"/admin/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.roles.update']['types'],
  },
  'admin.roles.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/roles/:id',
    tokens: [{"old":"/admin/roles/:id","type":0,"val":"admin","end":""},{"old":"/admin/roles/:id","type":0,"val":"roles","end":""},{"old":"/admin/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.roles.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
