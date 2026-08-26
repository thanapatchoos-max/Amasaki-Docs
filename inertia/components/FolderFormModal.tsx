import { useState } from 'react'
import { router } from '@inertiajs/react'
import { X, Shield, FolderPlus, Trash2, User, Users } from 'lucide-react'

interface Props {
  parentId: number | null
  users: any[]
  roles: any[]
  onClose: () => void
}

export default function FolderFormModal({ parentId, users, roles, onClose }: Props) {
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState<any[]>([])
  
  const [selectedType, setSelectedType] = useState<'user' | 'role'>('user')
  const [selectedId, setSelectedId] = useState<string>('')
  const [permissionLevel, setPermissionLevel] = useState('read')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddPermission = () => {
    if (!selectedId) return
    const idNum = parseInt(selectedId)
    // Avoid duplicates
    if (permissions.some(p => p.type === selectedType && p.id === idNum)) return
    
    setPermissions([...permissions, { type: selectedType, id: idNum, permission: permissionLevel }])
    setSelectedId('')
  }

  const handleRemovePermission = (index: number) => {
    const newPerms = [...permissions]
    newPerms.splice(index, 1)
    setPermissions(newPerms)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    router.post('/folders', { 
      name, 
      parentId, 
      initialPermissions: permissions 
    }, {
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => setIsSubmitting(false)
    })
  }

  const getEntityName = (p: any) => {
    if (p.type === 'user') {
      const u = users.find(u => u.id === p.id)
      return u ? (u.fullName || u.username) : 'Unknown User'
    } else {
      const r = roles.find(r => r.id === p.id)
      return r ? r.name : 'Unknown Role'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">สร้างโฟลเดอร์ใหม่</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Form */}
          <form id="create-folder-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อโฟลเดอร์ <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="พิมพ์ชื่อโฟลเดอร์..."
                required
                className="block w-full rounded-xl border-slate-200 py-2.5 px-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-all"
                autoFocus
              />
            </div>
            
            <div className="border-t border-slate-100 pt-5 mt-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-emerald-500" /> กำหนดสิทธิ์ให้ผู้อื่น (ไม่บังคับ)
              </label>
              <p className="text-xs text-slate-500 mb-3">
                * หากไม่ตั้งค่าอะไรเลย โฟลเดอร์นี้จะแสดงให้ <b>ทุกคน</b> เห็นได้ (อ่านอย่างเดียว)
              </p>
              
              <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex gap-2">
                  <select 
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value as 'user'|'role')
                      setSelectedId('')
                    }}
                    className="rounded-lg border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-1.5"
                  >
                    <option value="user">รายคน</option>
                    <option value="role">ตามตำแหน่ง</option>
                  </select>

                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="flex-1 rounded-lg border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-1.5"
                  >
                    <option value="">-- เลือก --</option>
                    {selectedType === 'user' 
                      ? users.map(u => <option key={u.id} value={u.id}>{u.fullName || u.username}</option>)
                      : roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                    }
                  </select>

                  <select
                    value={permissionLevel}
                    onChange={(e) => setPermissionLevel(e.target.value)}
                    className="rounded-lg border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-1.5"
                  >
                    <option value="read">อ่าน</option>
                    <option value="write">แก้ไข</option>
                    <option value="admin">ผู้ดูแล</option>
                  </select>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleAddPermission}
                  disabled={!selectedId}
                  className="w-full mt-1 rounded-lg bg-white border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                >
                  + เพิ่มในรายการ
                </button>
              </div>

              {permissions.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {permissions.map((p, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-sm">
                      <div className="flex items-center gap-2">
                        {p.type === 'role' ? <Users className="w-4 h-4 text-emerald-500" /> : <User className="w-4 h-4 text-purple-500" />}
                        <span className="font-medium text-slate-700">{getEntityName(p)}</span>
                        <span className="text-xs text-slate-400">({p.type === 'role' ? 'ตำแหน่ง' : 'บุคคล'})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          p.permission === 'admin' ? 'bg-rose-100 text-rose-700' : 
                          p.permission === 'write' ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.permission}
                        </span>
                        <button type="button" onClick={() => handleRemovePermission(idx)} className="text-slate-400 hover:text-rose-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50">
            ยกเลิก
          </button>
          <button type="submit" form="create-folder-form" disabled={!name.trim() || isSubmitting} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
            บันทึก
          </button>
        </div>

      </div>
    </div>
  )
}
