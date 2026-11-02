import { useState } from 'react'
import { router } from '@inertiajs/react'
import { 
  Shield, 
  Save, 
  CheckSquare, 
  Square, 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Trash2, 
  BarChart3, 
  Users, 
  ClipboardList,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react'

interface FeatureFunction {
  id: string
  label: string
  description: string
}

interface ModuleConfig {
  id: string
  name: string
  badge: string
  icon: any
  description: string
  functions: FeatureFunction[]
}

const GRANULAR_MODULES: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard (ภาพรวมระบบ)',
    badge: 'หน้าหลัก',
    icon: LayoutDashboard,
    description: 'สิทธิ์การเข้าถึงข้อมูลภาพรวม สถิติ และการแจ้งเตือนสำคัญ',
    functions: [
      { id: 'view', label: 'ดูภาพรวมระบบ (View Dashboard)', description: 'เข้าถึงหน้าแดชบอร์ด ดูตัวเลขสถิติเอกสารและพื้นที่จัดเก็บ' },
      { id: 'view_expiring', label: 'ดูเอกสารใกล้หมดอายุ (View Expiring Docs)', description: 'ดูรายการแจ้งเตือนเอกสารที่จะหมดอายุใน 30 วัน' },
    ],
  },
  {
    id: 'folders',
    name: 'โฟลเดอร์ (Folders)',
    badge: 'โครงสร้างจัดเก็บ',
    icon: FolderOpen,
    description: 'สิทธิ์การจัดการโฟลเดอร์ แฟ้มเอกสาร และสิทธิ์ประจำโฟลเดอร์',
    functions: [
      { id: 'view', label: 'ดูโฟลเดอร์ (View Folders)', description: 'เข้าถึงและดูรายการโฟลเดอร์ย่อยในระบบ' },
      { id: 'create', label: 'สร้างโฟลเดอร์ใหม่ (Create Folder)', description: 'สร้างโฟลเดอร์และโฟลเดอร์ย่อยใหม่' },
      { id: 'edit', label: 'แก้ไขชื่อโฟลเดอร์ (Rename Folder)', description: 'แก้ไขชื่อและรายละเอียดของโฟลเดอร์' },
      { id: 'delete', label: 'ลบโฟลเดอร์ (Delete Folder)', description: 'ย้ายโฟลเดอร์ลงถังขยะ' },
      { id: 'pin', label: 'ปักหมุดโฟลเดอร์ (Pin Folder)', description: 'ปักหมุด / เลิกปักหมุดโฟลเดอร์สำคัญ' },
      { id: 'manage_permissions', label: 'จัดการสิทธิ์โฟลเดอร์ (Manage Permissions)', description: 'กำหนดสิทธิ์การเข้าถึงเฉพาะบุคคลในแต่ละโฟลเดอร์' },
    ],
  },
  {
    id: 'documents',
    name: 'เอกสาร (Documents)',
    badge: 'การจัดการไฟล์',
    icon: FileText,
    description: 'สิทธิ์การเข้าถึง อัปโหลด ดาวน์โหลด และอัปเดตเวอร์ชันเอกสาร',
    functions: [
      { id: 'view', label: 'ดูรายการและอ่านเอกสาร (View Documents)', description: 'ค้นหา ดูรายละเอียด และดูพรีวิวเอกสาร' },
      { id: 'upload', label: 'อัปโหลดเอกสารใหม่ (Upload Document)', description: 'เพิ่มเอกสารใหม่เข้าระบบ' },
      { id: 'update_version', label: 'อัปเดตเวอร์ชันเอกสาร (Update Version)', description: 'อัปโหลดไฟล์เวอร์ชันใหม่ (New Version) ให้กับเอกสารเดิม' },
      { id: 'download', label: 'ดาวน์โหลดไฟล์เอกสาร (Download Document)', description: 'ดาวน์โหลดไฟล์เอกสารลงเครื่อง' },
      { id: 'delete', label: 'ลบเอกสาร (Delete Document)', description: 'ย้ายไฟล์เอกสารลงถังขยะ (ลบเดี่ยว / ลบหลายรายการ)' },
    ],
  },
  {
    id: 'trash',
    name: 'ถังขยะ (Trash)',
    badge: 'คลังกู้คืน',
    icon: Trash2,
    description: 'สิทธิ์การตรวจสอบ กู้คืน และลบถาวรเอกสารที่ถูกลบ',
    functions: [
      { id: 'view', label: 'ดูรายการในถังขยะ (View Trash)', description: 'ดูรายการไฟล์และโฟลเดอร์ที่ถูกลบไว้ 30 วัน' },
      { id: 'restore', label: 'กู้คืนรายการ (Restore Items)', description: 'กู้คืนเอกสารหรือโฟลเดอร์กลับมาใช้งานปกติ' },
      { id: 'force_delete', label: 'ลบถาวร (Permanently Delete)', description: 'ลบเอกสารหรือโฟลเดอร์ออกจากระบบอย่างถาวรทันที' },
    ],
  },
  {
    id: 'reports',
    name: 'Report (รายงานสถิติ)',
    badge: 'รายงานวิเคราะห์',
    icon: BarChart3,
    description: 'สิทธิ์การดูรายงานเชิงลึกและส่งออกข้อมูล',
    functions: [
      { id: 'view', label: 'ดูรายงานสรุป (View Reports)', description: 'เข้าถึงรายงานสถิติการใช้งาน และอันดับผู้ใช้งาน' },
      { id: 'export', label: 'ส่งออกรายงาน PDF (Export Report PDF)', description: 'ดาวน์โหลดรายงานสรุปในรูปแบบไฟล์ PDF' },
    ],
  },
  {
    id: 'users',
    name: 'ผู้ใช้งาน (Users)',
    badge: 'ผู้ดูแลระบบ',
    icon: Users,
    description: 'สิทธิ์การจัดการบัญชีผู้ใช้งานในระบบ',
    functions: [
      { id: 'view', label: 'ดูรายชื่อผู้ใช้งาน (View Users)', description: 'เข้าถึงและค้นหารายชื่อผู้ใช้งานในระบบ' },
      { id: 'create', label: 'เพิ่มผู้ใช้งานใหม่ (Create User)', description: 'สร้างบัญชีผู้ใช้งานใหม่ในระบบ' },
      { id: 'edit', label: 'แก้ไขข้อมูลผู้ใช้ (Edit User)', description: 'แก้ไขชื่อ ตำแหน่ง และรีเซ็ตรหัสผ่าน' },
      { id: 'delete', label: 'ลบผู้ใช้งาน (Delete User)', description: 'ลบบัญชีผู้ใช้งานออกจากระบบ' },
    ],
  },
  {
    id: 'roles',
    name: 'ตำแหน่งและสิทธิ์ (Roles & Permissions)',
    badge: 'ผู้ดูแลระบบ',
    icon: Shield,
    description: 'สิทธิ์การจัดการตำแหน่งและกำหนดสิทธิ์การเข้าถึง',
    functions: [
      { id: 'view', label: 'ดูรายการตำแหน่ง (View Roles)', description: 'ดูรายการ Role และสรุปจำนวนสิทธิ์ในระบบ' },
      { id: 'create', label: 'สร้างตำแหน่งใหม่ (Create Role)', description: 'สร้างตำแหน่ง Role ใหม่และตั้งค่าสิทธิ์' },
      { id: 'edit', label: 'แก้ไขสิทธิ์ตำแหน่ง (Edit Role)', description: 'ปรับเปลี่ยนชื่อตำแหน่งและติ๊กกำหนดฟังก์ชันการเข้าถึง' },
      { id: 'delete', label: 'ลบตำแหน่ง (Delete Role)', description: 'ลบตำแหน่ง Role ออกจากระบบ' },
    ],
  },
  {
    id: 'audit_logs',
    name: 'ประวัติการใช้งาน (Audit Logs)',
    badge: 'ผู้ดูแลระบบ',
    icon: ClipboardList,
    description: 'สิทธิ์การตรวจสอบบันทึกการทำงานในระบบ (Audit Trail)',
    functions: [
      { id: 'view', label: 'ดูบันทึกประวัติ (View Audit Logs)', description: 'เข้าถึงบันทึกการเข้าใช้งาน อัปโหลด และลบไฟล์' },
      { id: 'export', label: 'ส่งออกประวัติการใช้งาน (Export Logs)', description: 'ส่งออกไฟล์บันทึกประวัติการใช้งาน' },
    ],
  },
]

export default function RoleForm({ role = null }: { role?: any }) {
  const [name, setName] = useState(role?.name || '')
  const [permissions, setPermissions] = useState<Record<string, string[]>>(role?.permissions || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleFunction = (moduleId: string, functionId: string) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleId] || []
      if (modulePerms.includes(functionId)) {
        return { ...prev, [moduleId]: modulePerms.filter(id => id !== functionId) }
      } else {
        return { ...prev, [moduleId]: [...modulePerms, functionId] }
      }
    })
  }

  const handleToggleAllInModule = (moduleId: string, moduleFunctions: FeatureFunction[]) => {
    const currentPerms = permissions[moduleId] || []
    const allFuncIds = moduleFunctions.map(f => f.id)
    const isAllChecked = allFuncIds.every(id => currentPerms.includes(id))

    setPermissions(prev => ({
      ...prev,
      [moduleId]: isAllChecked ? [] : [...allFuncIds]
    }))
  }

  const handleSelectAllGlobal = () => {
    const allPerms: Record<string, string[]> = {}
    GRANULAR_MODULES.forEach(mod => {
      allPerms[mod.id] = mod.functions.map(f => f.id)
    })
    setPermissions(allPerms)
  }

  const handleClearAllGlobal = () => {
    setPermissions({})
  }

  const getTotalSelectedCount = () => {
    return Object.values(permissions).reduce((acc, curr) => acc + (curr?.length || 0), 0)
  }

  const getTotalFunctionsCount = () => {
    return GRANULAR_MODULES.reduce((acc, curr) => acc + curr.functions.length, 0)
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 font-sans">
      
      {/* Basic Role Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-lg shadow-emerald-950/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Shield className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">ข้อมูลตำแหน่ง (Role Info)</h2>
            <p className="text-xs font-medium text-slate-500">กำหนดชื่อตำแหน่งหน้าที่ในองค์กร</p>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
            ชื่อตำแหน่ง (Role Name) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner disabled:bg-slate-100 disabled:text-slate-400"
            placeholder="เช่น Engineer, Designer, Manager..."
          />
        </div>
      </div>

      {/* Permissions Matrix Control Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-lg shadow-emerald-950/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Sliders className="size-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                กำหนดสิทธิ์ตามฟังก์ชันจริงของแต่ละหน้า (Granular Function Permissions)
              </h2>
            </div>
            <p className="text-xs font-medium text-slate-500">
              ติ๊กเลือกฟังก์ชันงานเฉพาะทางที่อนุญาตให้ตำแหน่งนี้สามารถใช้งานในแต่ละหน้าของระบบ
            </p>
          </div>

          {/* Quick Actions & Counter Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200/80">
              เลือกแล้ว {getTotalSelectedCount()} / {getTotalFunctionsCount()} ฟังก์ชัน
            </span>
            <button
              type="button"
              onClick={handleSelectAllGlobal}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition-colors"
            >
              เลือกทั้งหมด
            </button>
            <button
              type="button"
              onClick={handleClearAllGlobal}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>

        {/* Module Matrices */}
        <div className="flex flex-col gap-6">
          {GRANULAR_MODULES.map((module) => {
            const Icon = module.icon
            const modulePerms = permissions[module.id] || []
            const isAllChecked = module.functions.length > 0 && module.functions.every(f => modulePerms.includes(f.id))
            const checkedCount = modulePerms.length

            return (
              <div 
                key={module.id} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Module Header Accordion-style */}
                <div className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-800">{module.name}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                      {checkedCount}/{module.functions.length}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isAllChecked} 
                      onChange={() => handleToggleAllInModule(module.id, module.functions)} 
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 size-4 cursor-pointer" 
                    />
                    เลือกทั้งหมด
                  </label>
                </div>
                
                {/* Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-white">
                        <th className="py-3 px-5 text-xs font-bold text-slate-500">รายการ</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center w-24">ดู</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center w-24">สร้าง</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center w-24">แก้ไข</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center w-24">ลบ</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center w-28">อื่นๆ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {module.functions.map((func) => {
                        const isChecked = modulePerms.includes(func.id)
                        
                        // Map action ID to column index: 0=View, 1=Create, 2=Edit, 3=Delete, 4=Other
                        let colIdx = 4;
                        if (['view', 'view_expiring'].includes(func.id)) colIdx = 0;
                        else if (['create', 'upload'].includes(func.id)) colIdx = 1;
                        else if (['edit', 'update_version'].includes(func.id)) colIdx = 2;
                        else if (['delete', 'force_delete'].includes(func.id)) colIdx = 3;

                        return (
                          <tr key={func.id} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="py-3 px-5">
                              <p className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{func.label}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{func.description}</p>
                            </td>
                            {[0, 1, 2, 3, 4].map(idx => (
                              <td key={idx} className="py-3 px-4 text-center align-middle">
                                {idx === colIdx ? (
                                  <label className="flex items-center justify-center cursor-pointer w-full h-full p-2">
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked} 
                                      onChange={() => handleToggleFunction(module.id, func.id)}
                                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 size-4.5 cursor-pointer hover:border-emerald-400 transition-colors"
                                    />
                                  </label>
                                ) : (
                                  <span className="text-slate-200 font-bold">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Save Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.get('/admin/roles')}
          className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-sm"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 active:scale-[0.99] transition-all text-sm disabled:opacity-50 shadow-lg shadow-emerald-600/25 cursor-pointer"
        >
          <Save className="size-4" />
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกตำแหน่งและสิทธิ์'}
        </button>
      </div>
    </form>
  )
}
