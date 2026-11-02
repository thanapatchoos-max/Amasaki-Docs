import { useState } from 'react'
import { router } from '@inertiajs/react'
import { X, Shield, Trash2, User, Users } from 'lucide-react'
import { swalConfirm } from '@/lib/swal'

interface Props {
  folder: any
  users: any[]
  roles: any[]
  onClose: () => void
}

export default function FolderPermissionModal({ folder, users, roles, onClose }: Props) {
  const [selectedType, setSelectedType] = useState<'user' | 'role'>('user')
  const [selectedId, setSelectedId] = useState<string>('')
  const [permission, setPermission] = useState('read')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return

    setIsSubmitting(true)
    const payload = {
      permission,
      userId: selectedType === 'user' ? selectedId : null,
      roleId: selectedType === 'role' ? selectedId : null,
    }

    router.post(`/folders/${folder.id}/permissions`, payload, {
      onSuccess: () => {
        setSelectedId('')
        setIsSubmitting(false)
      },
      onError: () => setIsSubmitting(false)
    })
  }

  const handleRemove = async (permissionId: number) => {
    if (await swalConfirm({ title: 'แน่ใจหรือไม่ที่จะลบสิทธิ์นี้?' })) {
      router.delete(`/folders/${folder.id}/permissions/${permissionId}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">จัดการสิทธิ์โฟลเดอร์</h2>
              <p className="text-xs text-slate-500">{folder.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Permission Form */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <h3 className="text-sm font-bold text-slate-700 mb-3">เพิ่มสิทธิ์ใหม่</h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <select 
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as 'user'|'role')
                  setSelectedId('')
                }}
                className="rounded-xl border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="user">รายคน</option>
                <option value="role">ตามตำแหน่ง</option>
              </select>

              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                required
                className="flex-1 rounded-xl border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">-- เลือก --</option>
                {selectedType === 'user' 
                  ? users.map(u => <option key={u.id} value={u.id}>{u.fullName || u.username}</option>)
                  : roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                }
              </select>

              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="rounded-xl border-slate-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="read">อ่านอย่างเดียว</option>
                <option value="write">อัปโหลด/แก้ไข</option>
                <option value="admin">ผู้ดูแล</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={!selectedId || isSubmitting}
              className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              + เพิ่มสิทธิ์
            </button>
          </form>
        </div>

        {/* Current Permissions List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-700 mb-3">สิทธิ์ปัจจุบัน</h3>
          
          {(!folder.permissions || folder.permissions.length === 0) ? (
            <div className="text-center py-8 text-sm text-slate-500">
              ยังไม่มีการกำหนดสิทธิ์พิเศษ (ผู้สร้างเป็น Admin โดยอัตโนมัติ)
            </div>
          ) : (
            <ul className="space-y-2">
              {folder.permissions.map((p: any) => {
                const isEveryone = !p.roleId && !p.userId;
                return (
                <li key={p.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isEveryone ? 'bg-slate-100 text-slate-600' : p.roleId ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                      {isEveryone ? <Users className="w-4 h-4" /> : p.roleId ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {isEveryone ? 'ทุกคน (สาธารณะ)' : p.roleId ? (p.role?.name || 'ตำแหน่ง') : (p.user?.fullName || p.user?.username || 'คน')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isEveryone ? 'สาธารณะ' : p.roleId ? 'ตำแหน่ง' : 'บุคคล'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      p.permission === 'admin' ? 'bg-rose-100 text-rose-700' : 
                      p.permission === 'write' ? 'bg-amber-100 text-amber-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.permission === 'admin' ? 'ผู้ดูแล' : p.permission === 'write' ? 'แก้ไข' : 'อ่าน'}
                    </span>
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              )})}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
