import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Folder from '#models/folder'
import Document from '#models/document'
import DocumentVersion from '#models/document_version'
import AuditLog from '#models/audit_log'
import Role from '#models/role'
import { DateTime } from 'luxon'

export default class MockupSeeder extends BaseSeeder {
  async run() {
    // 1. Roles
    const userRole = await Role.firstOrCreate({ name: 'User' }, { name: 'User' })
    const adminRole = await Role.findBy('name', 'Admin')
    
    // 2. Users
    const engUser = await User.firstOrCreate({ username: 'engineer1' }, {
      username: 'engineer1',
      fullName: 'Somchai Engineer',
      email: 'engineer1@amagasaki.co.th',
      password: 'password',
      roleId: userRole.id,
      isActive: true,
    })

    const designerUser = await User.firstOrCreate({ username: 'designer1' }, {
      username: 'designer1',
      fullName: 'Anan Designer',
      email: 'designer1@amagasaki.co.th',
      password: 'password',
      roleId: userRole.id,
      isActive: true,
    })

    const adminUser = await User.findBy('username', 'admin')

    // 3. Folders
    const rootFolder = await Folder.firstOrCreate({ name: 'Engineering Drawings' }, {
      name: 'Engineering Drawings',
      createdBy: adminUser!.id
    })

    const projectAlpha = await Folder.firstOrCreate({ name: 'Project Alpha' }, {
      name: 'Project Alpha',
      parentId: rootFolder.id,
      createdBy: engUser.id
    })

    const projectBeta = await Folder.firstOrCreate({ name: 'Project Beta' }, {
      name: 'Project Beta',
      parentId: rootFolder.id,
      createdBy: designerUser.id
    })

    const standardSpecs = await Folder.firstOrCreate({ name: 'Standard Specs' }, {
      name: 'Standard Specs',
      parentId: rootFolder.id,
      createdBy: adminUser!.id
    })

    // 4. 10 Documents covering all 5 file extensions (pdf, dwg, sldprt, sldasm, slddrw)
    const mockupDocs = [
      {
        name: 'Machine Part A',
        originalName: 'part_a_v2.sldprt',
        extension: 'sldprt',
        ownerId: engUser.id,
        folderId: projectAlpha.id,
        latestVersion: 2,
        expireAt: DateTime.now().plus({ days: 120 }),
        status: 'active',
        size: 5 * 1024 * 1024
      },
      {
        name: 'Factory Layout 2026',
        originalName: 'layout_2026_final.dwg',
        extension: 'dwg',
        ownerId: adminUser!.id,
        folderId: rootFolder.id,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: 5 }), // Expiring in 5 days
        status: 'active',
        size: 8 * 1024 * 1024
      },
      {
        name: 'Main Pump Assembly',
        originalName: 'main_pump_asm.sldasm',
        extension: 'sldasm',
        ownerId: engUser.id,
        folderId: projectAlpha.id,
        latestVersion: 3,
        expireAt: DateTime.now().plus({ days: 45 }),
        status: 'active',
        size: 14 * 1024 * 1024
      },
      {
        name: 'Piping Diagram Spec Sheet',
        originalName: 'piping_spec_v1.pdf',
        extension: 'pdf',
        ownerId: adminUser!.id,
        folderId: standardSpecs.id,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: 365 }),
        status: 'active',
        size: 2 * 1024 * 1024
      },
      {
        name: 'Flange Mounting Bracket 2D',
        originalName: 'flange_bracket_2d.slddrw',
        extension: 'slddrw',
        ownerId: designerUser.id,
        folderId: projectBeta.id,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: 20 }), // Expiring in 20 days
        status: 'active',
        size: 3 * 1024 * 1024
      },
      {
        name: 'Pressure Vessel Tank Model',
        originalName: 'pv_tank_model.sldprt',
        extension: 'sldprt',
        ownerId: designerUser.id,
        folderId: projectBeta.id,
        latestVersion: 2,
        expireAt: DateTime.now().minus({ days: 2 }), // Expired
        status: 'expired',
        size: 6 * 1024 * 1024
      },
      {
        name: 'Plant Electrical Schematic',
        originalName: 'elec_schematic_rev3.dwg',
        extension: 'dwg',
        ownerId: engUser.id,
        folderId: rootFolder.id,
        latestVersion: 3,
        expireAt: DateTime.now().plus({ days: 200 }),
        status: 'active',
        size: 9 * 1024 * 1024
      },
      {
        name: 'Cooling System Sub-Assembly',
        originalName: 'cooling_system.sldasm',
        extension: 'sldasm',
        ownerId: designerUser.id,
        folderId: projectBeta.id,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: 25 }), // Expiring in 25 days
        status: 'active',
        size: 11 * 1024 * 1024
      },
      {
        name: 'Quality Control Standard Operating Procedure',
        originalName: 'qc_sop_2026.pdf',
        extension: 'pdf',
        ownerId: adminUser!.id,
        folderId: standardSpecs.id,
        latestVersion: 1,
        expireAt: DateTime.now().plus({ days: 500 }),
        status: 'active',
        size: 1.5 * 1024 * 1024
      },
      {
        name: 'Hydraulic Cylinder Technical Drawing',
        originalName: 'hydraulic_cyl_dwg.slddrw',
        extension: 'slddrw',
        ownerId: engUser.id,
        folderId: projectAlpha.id,
        latestVersion: 2,
        expireAt: DateTime.now().plus({ days: 90 }),
        status: 'active',
        size: 4 * 1024 * 1024
      }
    ]

    for (const item of mockupDocs) {
      const doc = await Document.firstOrCreate(
        { name: item.name },
        {
          name: item.name,
          originalName: item.originalName,
          extension: item.extension,
          ownerId: item.ownerId,
          folderId: item.folderId,
          latestVersion: item.latestVersion,
          expireAt: item.expireAt,
          status: item.status,
        }
      )

      // Versions
      for (let v = 1; v <= item.latestVersion; v++) {
        await DocumentVersion.firstOrCreate(
          { documentId: doc.id, versionNumber: v },
          {
            documentId: doc.id,
            versionNumber: v,
            filepath: `mock_${doc.id}_v${v}.${item.extension}`,
            size: item.size,
            uploadedById: item.ownerId,
          }
        )
      }

      // Audit Logs for actions
      await AuditLog.firstOrCreate(
        { targetId: doc.id, action: 'Create' },
        {
          userId: item.ownerId,
          action: 'Create',
          targetType: 'document',
          targetId: doc.id,
          details: JSON.stringify({ filename: item.originalName, version: item.latestVersion }),
        }
      )
    }

    // Additional Audit logs for View & Edit
    await AuditLog.create({
      userId: engUser.id,
      action: 'View',
      targetType: 'document',
      targetId: 1,
      details: JSON.stringify({ version: 2 }),
    })

    await AuditLog.create({
      userId: adminUser!.id,
      action: 'Edit',
      targetType: 'document',
      targetId: 3,
      details: JSON.stringify({ version: 3 }),
    })
  }
}