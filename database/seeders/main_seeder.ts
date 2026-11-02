import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Role from '#models/role'
import User from '#models/user'
import Folder from '#models/folder'
import Document from '#models/document'
import DocumentVersion from '#models/document_version'
import AuditLog from '#models/audit_log'
import Notification from '#models/notification'

export default class extends BaseSeeder {
  async run() {
    // ── Clear all data ────────────────────────────────────────────────────
    await db.rawQuery('DELETE FROM notifications')
    await db.rawQuery('DELETE FROM audit_logs')
    await db.rawQuery('DELETE FROM document_versions')
    await db.rawQuery('DELETE FROM document_permissions')
    await db.rawQuery('DELETE FROM folder_permissions')
    await db.rawQuery('DELETE FROM documents')
    await db.rawQuery('DELETE FROM folders')
    await db.rawQuery('DELETE FROM users')
    await db.rawQuery('DELETE FROM roles')

    // ── Roles ─────────────────────────────────────────────────────────────
    const adminPermissions = {
      dashboard: ['view', 'view_expiring'],
      reports: ['view'],
      documents: ['view', 'delete', 'upload', 'download', 'update_version'],
      folders: ['view', 'create', 'edit', 'pin', 'delete', 'manage_permissions'],
      trash: ['view', 'restore', 'force_delete'],
      users: ['view', 'create', 'edit', 'delete'],
      audit_logs: ['view'],
      roles: ['view', 'create', 'edit', 'delete']
    }
    const managerPermissions = {
      dashboard: ['view', 'view_expiring'],
      reports: ['view'],
      documents: ['view', 'upload', 'download', 'update_version'],
      folders: ['view', 'create', 'edit'],
      trash: ['view', 'restore']
    }
    const engineerPermissions = {
      dashboard: ['view'],
      documents: ['view', 'upload', 'download', 'update_version'],
      folders: ['view', 'create']
    }
    const employeePermissions = {
      dashboard: ['view'],
      documents: ['view', 'download'],
      folders: ['view']
    }

    const adminRole = await Role.create({ name: 'Admin', permissions: JSON.stringify(adminPermissions) })
    const managerRole = await Role.create({ name: 'Manager', permissions: JSON.stringify(managerPermissions) })
    const engineerRole = await Role.create({ name: 'Engineer', permissions: JSON.stringify(engineerPermissions) })
    const employeeRole = await Role.create({ name: 'Employee', permissions: JSON.stringify(employeePermissions) })

    // ── Users ─────────────────────────────────────────────────────────────
    // User model's beforeSave hook (via AuthFinder) hashes passwords automatically
    const admin = await User.create({ username: 'admin', fullName: 'สมชาย อมากาซากิ', email: 'admin@amasaki.co.th', password: 'password123', roleId: adminRole.id, isActive: true })
    const manager = await User.create({ username: 'manager', fullName: 'วันชัย มาเนเจอร์', email: 'wanchai@amasaki.co.th', password: 'password123', roleId: managerRole.id, isActive: true })
    const engineer = await User.create({ username: 'engineer', fullName: 'ปรีชา วิศวกร', email: 'preecha@amasaki.co.th', password: 'password123', roleId: engineerRole.id, isActive: true })
    const testUser = await User.create({ username: 'test', fullName: 'ทดสอบ ระบบ', email: 'test@amasaki.co.th', password: 'password123', roleId: employeeRole.id, isActive: true })

    // ── Folders ───────────────────────────────────────────────────────────
    const engFolder = await Folder.create({ name: 'Engineering Documents', createdBy: admin.id, isDeleted: false, isPinned: true })
    const cadFolder = await Folder.create({ name: 'CAD Drawings', parentId: engFolder.id, createdBy: engineer.id, isDeleted: false, isPinned: false })
    const qcFolder = await Folder.create({ name: 'Quality Control', createdBy: manager.id, isDeleted: false, isPinned: true })
    const maintFolder = await Folder.create({ name: 'Maintenance Records', createdBy: engineer.id, isDeleted: false, isPinned: false })
    const hrFolder = await Folder.create({ name: 'HR & Administration', createdBy: admin.id, isDeleted: false, isPinned: false })
    const mktFolder = await Folder.create({ name: 'Marketing & Sales', createdBy: manager.id, isDeleted: false, isPinned: false })
    const archivedFolder = await Folder.create({ name: 'Old Projects 2023 (Archived)', createdBy: manager.id, isDeleted: true, isPinned: false })

    // ── Folder permissions — everyone can read all folders ────────────────
    const { default: FolderPermission } = await import('#models/folder_permission')
    const allFolderIds = [
      engFolder.id, cadFolder.id, qcFolder.id, maintFolder.id,
      hrFolder.id, mktFolder.id, archivedFolder.id
    ]
    for (const fid of allFolderIds) {
      // Everyone (null/null) gets read
      await FolderPermission.create({ folderId: fid, userId: null, roleId: null, permission: 'read' })
    }
    // Admin gets admin on all folders
    for (const fid of allFolderIds) {
      await FolderPermission.create({ folderId: fid, userId: admin.id, roleId: null, permission: 'admin' })
    }
    // Manager gets write on their folders
    for (const fid of [qcFolder.id, mktFolder.id, archivedFolder.id]) {
      await FolderPermission.create({ folderId: fid, userId: manager.id, roleId: null, permission: 'write' })
    }
    // Engineer gets write on engineering folders
    for (const fid of [engFolder.id, cadFolder.id, maintFolder.id]) {
      await FolderPermission.create({ folderId: fid, userId: engineer.id, roleId: null, permission: 'write' })
    }

    // ── Helper: create doc + version ──────────────────────────────────────
    const createDoc = async (
      name: string,
      ext: string,
      folderId: number,
      ownerId: number,
      opts: { status?: string; isDeleted?: boolean; expireDays?: number | null; createdDaysAgo?: number; versionCount?: number; latestVersion?: number } = {}
    ) => {
      const {
        status = 'active',
        isDeleted = false,
        expireDays = null,
        createdDaysAgo = 30,
        versionCount = 1,
        latestVersion = versionCount,
      } = opts

      const filename = `${name}.${ext}`
      const doc = await Document.create({
        name,
        originalName: filename,
        extension: ext,
        folderId,
        ownerId,
        status,
        isDeleted,
        latestVersion,
        expireAt: expireDays !== null ? DateTime.now().plus({ days: expireDays }) : null,
        createdAt: DateTime.now().minus({ days: createdDaysAgo }),
      })

      for (let v = 1; v <= versionCount; v++) {
        await DocumentVersion.create({
          documentId: doc.id,
          versionNumber: v,
          filepath: `uploads/${name}_v${v}.${ext}`,
          size: Math.floor(Math.random() * 15000000) + 500000,
          uploadedById: ownerId,
          createdAt: DateTime.now().minus({ days: createdDaysAgo - (v - 1) * 7 }),
        })
      }

      return doc
    }

    // ── Documents: Engineering ────────────────────────────────────────────
    const docPump = await createDoc('Water_Pump_Assembly_Rev3', 'SLDASM', engFolder.id, engineer.id, { expireDays: 20, createdDaysAgo: 90, versionCount: 3, latestVersion: 3 })
    const docPipe = await createDoc('High_Pressure_Pipe_Vessel_DN250', 'SLDPRT', engFolder.id, engineer.id, { expireDays: 180, createdDaysAgo: 60, versionCount: 2, latestVersion: 2 })
    const docSpec = await createDoc('Technical_Specification_Stainless_Pipe', 'pdf', engFolder.id, engineer.id, { expireDays: 365, createdDaysAgo: 45 })
    const docInstall = await createDoc('Installation_Manual_Pump_Station_A', 'pdf', engFolder.id, manager.id, { expireDays: 730, createdDaysAgo: 120 })

    // ── Documents: CAD Drawings ───────────────────────────────────────────
    const docFlange = await createDoc('Pipe_Flange_DN200_Assembly', 'dwg', cadFolder.id, engineer.id, { expireDays: 365, createdDaysAgo: 30, versionCount: 2, latestVersion: 2 })
    const docLayout = await createDoc('Factory_Floor_Layout_Building_A', 'dwg', cadFolder.id, engineer.id, { expireDays: 500, createdDaysAgo: 20 })
    const docPipeDrw = await createDoc('Pipe_Routing_Floor2_Rev2', 'SLDDRW', cadFolder.id, engineer.id, { expireDays: 12, createdDaysAgo: 15 }) // near expiry!

    // ── Documents: Quality Control ────────────────────────────────────────
    const docQC = await createDoc('ISO_9001_QC_Checklist_Q3_2026', 'xlsx', qcFolder.id, manager.id, { expireDays: 90, createdDaysAgo: 10 })
    const docTest = await createDoc('Hydrostatic_Test_Report_2026', 'pdf', qcFolder.id, manager.id, { expireDays: 5, createdDaysAgo: 5 }) // critical expiry!
    const docSDS = await createDoc('Safety_Data_Sheet_Carbon_Steel_Pipe', 'pdf', qcFolder.id, engineer.id, { expireDays: 730, createdDaysAgo: 60 })

    // ── Documents: Maintenance ────────────────────────────────────────────
    const docMaint = await createDoc('Preventive_Maintenance_Schedule_2026', 'pdf', maintFolder.id, engineer.id, { expireDays: 365, createdDaysAgo: 25 })
    const docRepair = await createDoc('Machine_Repair_Log_Aug2026', 'xlsx', maintFolder.id, engineer.id, { expireDays: 60, createdDaysAgo: 8 })

    // ── Documents: HR ─────────────────────────────────────────────────────
    const docHR = await createDoc('Employee_Handbook_2026', 'pdf', hrFolder.id, admin.id, { expireDays: 365, createdDaysAgo: 180, versionCount: 2, latestVersion: 2 })
    const docContract = await createDoc('Employment_Contract_Template_TH', 'docx', hrFolder.id, admin.id, { expireDays: 730, createdDaysAgo: 200 })

    // ── Documents: Marketing ─────────────────────────────────────────────
    const docCatalog = await createDoc('Product_Catalog_Steel_Pipe_2026', 'pdf', mktFolder.id, manager.id, { expireDays: 180, createdDaysAgo: 30 })

    // ── Documents: Trash ─────────────────────────────────────────────────
    const docTrash1 = await createDoc('Old_Design_Spec_2023', 'pdf', archivedFolder.id, admin.id, { status: 'expired', isDeleted: true, expireDays: -30, createdDaysAgo: 365 })
    const docTrash2 = await createDoc('Draft_Proposal_Rejected_ABC', 'docx', mktFolder.id, manager.id, { isDeleted: true, createdDaysAgo: 60 })

    // ── Audit Logs ────────────────────────────────────────────────────────
    const auditData = [
      { userId: engineer.id, action: 'Upload', targetType: 'Document', targetId: docPump.id, details: { filename: 'Water_Pump_Assembly_Rev1.SLDASM', version: 1 }, daysAgo: 90 },
      { userId: engineer.id, action: 'Edit', targetType: 'Document', targetId: docPump.id, details: { filename: 'Water_Pump_Assembly_Rev2.SLDASM', version: 2 }, daysAgo: 60 },
      { userId: engineer.id, action: 'Edit', targetType: 'Document', targetId: docPump.id, details: { filename: 'Water_Pump_Assembly_Rev3.SLDASM', version: 3 }, daysAgo: 30 },
      { userId: manager.id, action: 'View', targetType: 'Document', targetId: docPump.id, details: { browser: 'Chrome', ip: '192.168.1.45' }, daysAgo: 5 },
      { userId: manager.id, action: 'Download', targetType: 'Document', targetId: docPump.id, details: { filename: 'Water_Pump_Assembly_Rev3.SLDASM', version: 3 }, daysAgo: 4 },
      { userId: engineer.id, action: 'Upload', targetType: 'Document', targetId: docFlange.id, details: { filename: 'Pipe_Flange_DN200_Assembly_v1.dwg', version: 1 }, daysAgo: 30 },
      { userId: manager.id, action: 'View', targetType: 'Document', targetId: docQC.id, details: { browser: 'Edge', ip: '192.168.1.20' }, daysAgo: 2 },
      { userId: admin.id, action: 'Delete', targetType: 'Document', targetId: docTrash1.id, details: { filename: 'Old_Design_Spec_2023.pdf', reason: 'Obsolete — replaced by 2026 version' }, daysAgo: 10 },
      { userId: manager.id, action: 'Delete', targetType: 'Document', targetId: docTrash2.id, details: { filename: 'Draft_Proposal_Rejected_ABC.docx', reason: 'Proposal rejected by management' }, daysAgo: 3 },
      { userId: engineer.id, action: 'Upload', targetType: 'Document', targetId: docTest.id, details: { filename: 'Hydrostatic_Test_Report_2026.pdf', version: 1 }, daysAgo: 5 },
      { userId: manager.id, action: 'View', targetType: 'Document', targetId: docCatalog.id, details: { browser: 'Chrome', ip: '192.168.1.20' }, daysAgo: 1 },
      { userId: admin.id, action: 'Edit', targetType: 'Document', targetId: docHR.id, details: { filename: 'Employee_Handbook_2026_v2.pdf', version: 2 }, daysAgo: 7 },
      { userId: testUser.id, action: 'View', targetType: 'Document', targetId: docSpec.id, details: { browser: 'Safari', ip: '192.168.1.88' }, daysAgo: 1 },
      { userId: engineer.id, action: 'Download', targetType: 'Document', targetId: docSDS.id, details: { filename: 'Safety_Data_Sheet_Carbon_Steel_Pipe.pdf', version: 1 }, daysAgo: 2 },
    ]

    for (const entry of auditData) {
      await AuditLog.create({
        userId: entry.userId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        details: JSON.stringify(entry.details),
        createdAt: DateTime.now().minus({ days: entry.daysAgo }),
      })
    }

    // ── Notifications ─────────────────────────────────────────────────────
    await Notification.createMany([
      {
        userId: engineer.id,
        type: 'ALERT',
        title: 'เอกสารใกล้หมดอายุ — ต้องดำเนินการ',
        message: 'ไฟล์ Water_Pump_Assembly_Rev3.SLDASM จะหมดอายุในอีก 20 วัน กรุณาตรวจสอบและต่ออายุ',
        isRead: false,
        documentId: docPump.id,
        createdAt: DateTime.now().minus({ hours: 2 }),
      },
      {
        userId: engineer.id,
        type: 'ALERT',
        title: 'เอกสารใกล้หมดอายุวิกฤต!',
        message: 'ไฟล์ Pipe_Routing_Floor2_Rev2.SLDDRW จะหมดอายุในอีก 12 วัน กรุณาต่ออายุหรืออัปเดตเอกสาร',
        isRead: false,
        documentId: docPipeDrw.id,
        createdAt: DateTime.now().minus({ hours: 1 }),
      },
      {
        userId: manager.id,
        type: 'ALERT',
        title: 'เอกสารหมดอายุแล้ว — ดำเนินการด่วน',
        message: 'ไฟล์ Hydrostatic_Test_Report_2026.pdf หมดอายุในอีก 5 วัน กรุณาส่งรายงานฉบับใหม่',
        isRead: false,
        documentId: docTest.id,
        createdAt: DateTime.now().minus({ minutes: 30 }),
      },
      {
        userId: admin.id,
        type: 'INFO',
        title: 'มีการลบเอกสารในระบบ',
        message: 'ผู้ใช้ วันชัย มาเนเจอร์ (manager) ได้ลบเอกสาร Draft_Proposal_Rejected_ABC.docx เข้าถังขยะ',
        isRead: true,
        documentId: docTrash2.id,
        readAt: DateTime.now().minus({ hours: 2 }),
        createdAt: DateTime.now().minus({ days: 3 }),
      },
      {
        userId: admin.id,
        type: 'INFO',
        title: 'อัปเดตเอกสารเวอร์ชันใหม่',
        message: 'ผู้ใช้ ปรีชา วิศวกร (engineer) ได้อัปเดต Water_Pump_Assembly_Rev3.SLDASM เป็น Rev3',
        isRead: true,
        documentId: docPump.id,
        readAt: DateTime.now().minus({ days: 1 }),
        createdAt: DateTime.now().minus({ days: 30 }),
      },
      {
        userId: testUser.id,
        type: 'INFO',
        title: 'เอกสารพร้อมดาวน์โหลด',
        message: 'ไฟล์ Technical_Specification_Stainless_Pipe.pdf พร้อมให้ดาวน์โหลดแล้ว',
        isRead: false,
        documentId: docSpec.id,
        createdAt: DateTime.now().minus({ days: 1 }),
      },
    ])

    // ── Batch documents for chart/report diversity ────────────────────────
    const batchFolders = [engFolder.id, cadFolder.id, qcFolder.id, maintFolder.id]
    const batchOwners = [engineer.id, manager.id]
    const batchExts = ['pdf', 'dwg', 'sldprt', 'sldasm', 'slddrw']
    const batchNames = [
      'Pump_Seal_Kit_Spec', 'Valve_Body_Design', 'Pipe_Support_Bracket',
      'Corrosion_Resistance_Test', 'Weld_Inspection_Report', 'Flow_Rate_Analysis',
      'Pressure_Drop_Calculation', 'Heat_Exchanger_Drawing', 'Compressor_Overhaul_Guide',
      'Bolt_Torque_Specification', 'Gasket_Selection_Guide', 'Nozzle_Assembly_Detail',
      'Tank_Foundation_Drawing', 'Expansion_Joint_Spec', 'Instrument_Loop_Diagram',
    ]

    for (let i = 0; i < batchNames.length; i++) {
      const ext = batchExts[i % batchExts.length]
      const name = batchNames[i]
      const folderId = batchFolders[i % batchFolders.length]
      const ownerId = batchOwners[i % batchOwners.length]
      const expireDays = [30, 60, 90, 180, 365, -1][i % 6] // some expired
      const status = expireDays < 0 ? 'expired' : 'active'

      const bDoc = await Document.create({
        name,
        originalName: `${name}.${ext}`,
        extension: ext,
        folderId,
        ownerId,
        status,
        isDeleted: false,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: expireDays }),
        createdAt: DateTime.now().minus({ days: Math.floor(Math.random() * 60) + 10 }),
      })

      await DocumentVersion.create({
        documentId: bDoc.id,
        versionNumber: 1,
        filepath: `uploads/${name}.${ext}`,
        size: Math.floor(Math.random() * 30000000) + 500000,
        uploadedById: ownerId,
      })
    }

    console.log('✅ Database seeded successfully — Amagasaki Pipe DMS realistic mock data')
    console.log(`   Users: admin / manager / engineer / test  (password: password123)`)
  }
}