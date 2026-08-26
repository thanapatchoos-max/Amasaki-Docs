import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'dashboard.expiring': { paramsTuple?: []; params?: {} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.upload': { paramsTuple?: []; params?: {} }
    'documents.store': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.updateVersion': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.versions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.downloadVersion': { paramsTuple: [ParamValue]; params: {'versionId': ParamValue} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.store': { paramsTuple?: []; params?: {} }
    'folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder_permissions.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder_permissions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'permissionId': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.audit_logs': { paramsTuple?: []; params?: {} }
    'admin.roles': { paramsTuple?: []; params?: {} }
    'admin.roles.create': { paramsTuple?: []; params?: {} }
    'admin.roles.store': { paramsTuple?: []; params?: {} }
    'admin.roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'session.create': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'dashboard.expiring': { paramsTuple?: []; params?: {} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.upload': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.versions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.downloadVersion': { paramsTuple: [ParamValue]; params: {'versionId': ParamValue} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.audit_logs': { paramsTuple?: []; params?: {} }
    'admin.roles': { paramsTuple?: []; params?: {} }
    'admin.roles.create': { paramsTuple?: []; params?: {} }
    'admin.roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'session.create': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'dashboard.expiring': { paramsTuple?: []; params?: {} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.upload': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.download': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.versions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.downloadVersion': { paramsTuple: [ParamValue]; params: {'versionId': ParamValue} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.audit_logs': { paramsTuple?: []; params?: {} }
    'admin.roles': { paramsTuple?: []; params?: {} }
    'admin.roles.create': { paramsTuple?: []; params?: {} }
    'admin.roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'documents.store': { paramsTuple?: []; params?: {} }
    'documents.updateVersion': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.store': { paramsTuple?: []; params?: {} }
    'folders.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder_permissions.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.roles.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder_permissions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'permissionId': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}