import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Shield, Save, X } from 'lucide-react'

const PERMISSION_MODULES = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'folders', name: 'โฟลเดอร์ (Folders)' },
  { id: 'documents', name: 'เอกสาร (Documents)' },
  { id: 'users', name: 'ผู้ใช้งาน (Users)' },
  { id: 'roles', name: 'ตำแหน่งและสิทธิ์ (Roles)' },
  { id: 'audit_logs', name: 'ประวัติการใช้งาน (Audit Logs)' },
]

const PERMISSION_ACTIONS = [
  { id: 'view', name: 'ดู (View)' },
  { id: 'create', name: 'สร้าง (Create)' },
  { id: 'edit', name: 'แก้ไข (Edit)' },
  { id: 'delete', name: 'ลบ (Delete)' },
]

export default function RoleForm({ role = null }: { role?: any }) {
  const [name, setName] = useState(role?.name || '')
  const [permissions, setPermissions] = useState<Record<string, string[]>>(role?.permissions || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTogglePermission = (moduleId: string, actionId: string) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleId] || []
      if (modulePerms.includes(actionId)) {
        return { ...prev, [moduleId]: modulePerms.filter(a => a !== actionId) }
      } else {
        return { ...prev, [moduleId]: [...modulePerms, actionId] }
      }
    })
  }

  const handleSelectAllModule = (moduleId: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: checked ? PERMISSION_ACTIONS.map(a => a.id) : []
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    
    if (role) {
      router.patch(`/admin/roles/${role.id}`, { name, permissions }, {
        onFinish: () => setIsSubmitting(false)
      })
    } else {
      router.post('/admin/roles', { name, permissions }, {
        onFinish: () => setIsSubmitting(false)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          ข้อมูลตำแหน่ง
        </h2>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อตำแหน่ง (Role Name)</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={role?.name === 'Admin'}
            className="w-full sm:w-1/2 rounded-xl border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm transition-colors disabled:bg-slate-100 disabled:text-slate-500"
            placeholder="เช่น Manager, Staff..."
          />
          {role?.name === 'Admin' && (
            <p className="mt-2 text-sm text-amber-600 font-medium">ไม่สามารถแก้ไขชื่อตำแหน่ง Admin ได้</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            กำหนดสิทธิ์การใช้งาน (Permissions)
          </h2>
          <p className="text-sm text-slate-500 mt-1">เลือกสิทธิ์ที่ต้องการให้ตำแหน่งนี้เข้าถึงในแต่ละระบบ</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-bold text-slate-700 w-1/3">ระบบ (Module)</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-700 text-center">ทั้งหมด</th>
                {PERMISSION_ACTIONS.map(action => (
                  <th key={action.id} className="py-4 px-6 text-sm font-bold text-slate-700 text-center">
                    {action.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_MODULES.map(module => {
                const modulePerms = permissions[module.id] || []
                const isAllSelected = modulePerms.length === PERMISSION_ACTIONS.length

                return (
                  <tr key={module.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">{module.name}</td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAllModule(module.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                      />
                    </td>
                    {PERMISSION_ACTIONS.map(action => (
                      <td key={action.id} className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={modulePerms.includes(action.id)}
                          onChange={() => handleTogglePermission(module.id, action.id)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.get('/admin/roles')}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm shadow-emerald-600/20"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกตำแหน่ง'}
        </button>
      </div>
    </form>
  )
}
