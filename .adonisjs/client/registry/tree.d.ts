/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  home: typeof routes['home']
  dashboard: {
    expiring: typeof routes['dashboard.expiring']
  }
  reports: {
    index: typeof routes['reports.index']
  }
  documents: {
    index: typeof routes['documents.index']
    upload: typeof routes['documents.upload']
    store: typeof routes['documents.store']
    show: typeof routes['documents.show']
    destroy: typeof routes['documents.destroy']
    download: typeof routes['documents.download']
    updateVersion: typeof routes['documents.updateVersion']
    versions: typeof routes['documents.versions']
    downloadVersion: typeof routes['documents.downloadVersion']
  }
  folders: {
    index: typeof routes['folders.index']
    show: typeof routes['folders.show']
    store: typeof routes['folders.store']
    update: typeof routes['folders.update']
    pin: typeof routes['folders.pin']
    destroy: typeof routes['folders.destroy']
  }
  folderPermissions: {
    store: typeof routes['folder_permissions.store']
    destroy: typeof routes['folder_permissions.destroy']
  }
  notifications: {
    index: typeof routes['notifications.index']
  }
  admin: {
    users: typeof routes['admin.users'] & {
      store: typeof routes['admin.users.store']
      update: typeof routes['admin.users.update']
      destroy: typeof routes['admin.users.destroy']
    }
    auditLogs: typeof routes['admin.audit_logs']
    roles: typeof routes['admin.roles'] & {
      create: typeof routes['admin.roles.create']
      store: typeof routes['admin.roles.store']
      edit: typeof routes['admin.roles.edit']
      update: typeof routes['admin.roles.update']
      destroy: typeof routes['admin.roles.destroy']
    }
  }
}
