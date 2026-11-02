import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { MainLayout } from "@/layouts/default";
import { FolderOpen, Plus, Upload, Trash2, Edit2, ChevronRight, ChevronLeft, Shield, Clock, Pin } from 'lucide-react';
import FolderPermissionModal from '@/components/FolderPermissionModal';
import FolderFormModal from '@/components/FolderFormModal';
import { swalConfirm } from '@/lib/swal';

export default function FoldersIndex({ pinnedFolders = [], recentFolders = [], folders = [], users = [], roles = [] }: { pinnedFolders: any[], recentFolders: any[], folders: any[], users: any[], roles: any[] }) {
  const { props } = usePage<any>()
  const user = props.user
  const permissions = user?.permissions?.folders || []
  const docPerms = user?.permissions?.documents || []
  
  const canCreate = permissions.includes('create')
  const canEdit = permissions.includes('edit')
  const canDelete = permissions.includes('delete')
  const canPin = permissions.includes('pin')
  const canManagePerms = permissions.includes('manage_permissions')
  const canUploadDoc = docPerms.includes('upload')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [permissionFolder, setPermissionFolder] = useState<any>(null)

  const startEdit = (e: React.MouseEvent, folder: any) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingId(folder.id)
    setEditName(folder.name)
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim() || !editingId) return

    router.patch(`/folders/${editingId}`, { name: editName }, {
      onSuccess: () => {
        setEditingId(null)
      }
    })
  }

  const handleDelete = async (e: React.MouseEvent, folder: any) => {
    e.preventDefault()
    e.stopPropagation()

    const docsCount = folder.documentsCount ?? folder.documents_count ?? folder.documents?.length ?? 0;
    const childrenCount = folder.childrenCount ?? folder.children_count ?? folder.children?.length ?? 0;
    const totalItems = docsCount + childrenCount;

    let confirmTitle = `คุณต้องการลบโฟลเดอร์ "${folder.name}" ใช่หรือไม่?`;
    let confirmText = 'โฟลเดอร์จะถูกย้ายไปที่ถังขยะ';

    if (totalItems > 0) {
      confirmTitle = `⚠️ คำเตือน: มีเอกสาร/โฟลเดอร์ย่อยอยู่ภายใน ${totalItems} รายการ!`;
      confirmText = `โฟลเดอร์ "${folder.name}" มีไฟล์และโฟลเดอร์ย่อยบรรจุอยู่รวม ${totalItems} รายการ หากคุณยืนยันที่จะลบ รายการทั้งหมดภายในโฟลเดอร์นี้จะถูกย้ายไปที่ถังขยะด้วย คุณต้องการลบใช่หรือไม่?`;
    }

    if (await swalConfirm({ title: confirmTitle, text: confirmText, icon: totalItems > 0 ? 'warning' : 'question' })) {
      router.delete(`/folders/${folder.id}`)
    }
  }

  const handleTogglePin = (e: React.MouseEvent, folderId: number) => {
    e.preventDefault()
    e.stopPropagation()
    router.post(`/folders/${folderId}/pin`)
  }

  const scrollFolders = (direction: 'left' | 'right') => {
    const el = document.getElementById('folders-scroll-container')
    if (el) {
      el.scrollBy({
        left: direction === 'left' ? -600 : 600,
        behavior: 'smooth'
      })
    }
  }

  return (
    <MainLayout>
      <Head title="แฟ้มเอกสารทั้งหมด" />
      <div className="w-full h-full flex flex-col pt-2 pb-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center mb-4 border-b border-emerald-100/60 pt-2 pb-3" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2 text-sm text-slate-500 py-0.5">
            <li>
              <div className="flex items-center">
                <FolderOpen className="h-4 w-4 flex-shrink-0 text-emerald-600 mr-2" />
                <span className="font-semibold text-slate-900">หน้าหลัก (My Drive)</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
              <FolderOpen className="size-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">แฟ้มเอกสารทั้งหมด</h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">คลังจัดเก็บโฟลเดอร์หลัก และโครงสร้างแฟ้มเอกสารในระบบ ({folders.length} แฟ้ม)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {canUploadDoc && (
              <Link
                href="/documents/upload"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all"
              >
                <Upload className="h-4 w-4 mr-2 text-slate-500" />
                อัปโหลดเอกสาร
              </Link>
            )}
            {canCreate && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                สร้างโฟลเดอร์
              </button>
            )}
          </div>
        </div>

        {/* Create Folder Modal */}
        {isCreateOpen && (
          <FolderFormModal 
            parentId={null} 
            users={users} 
            roles={roles} 
            onClose={() => setIsCreateOpen(false)} 
          />
        )}



        {/* SECTION 2: Recently Accessed Folders */}
        {recentFolders.length > 0 && (
          <div className="mb-10 bg-slate-50/70 border border-slate-200/60 p-6 rounded-3xl shadow-sm">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              โฟลเดอร์ที่เข้าล่าสุด (Recent)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {recentFolders.map((folder, idx) => {
                let displayClass = 'flex';
                if (idx === 2) displayClass = 'hidden sm:flex';
                if (idx === 3) displayClass = 'hidden md:flex';
                if (idx === 4) displayClass = 'hidden lg:flex';
                if (idx === 5) displayClass = 'hidden xl:flex';
                if (idx >= 6) displayClass = 'hidden';

                return (
                  <Link
                    key={`recent-${folder.id}`}
                    href={`/folders/${folder.id}`}
                    className={`group relative ${displayClass} flex-col justify-between rounded-2xl border border-emerald-100/80 bg-white p-5 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all h-[140px] overflow-hidden`}
                  >
                  <div className="absolute -right-4 -top-4 size-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 z-10 transition-transform group-hover:scale-105">
                    <FolderOpen className="h-5 w-5 fill-emerald-200" />
                  </div>
                  <div className="z-10 mt-3">
                    <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 truncate" title={folder.name}>
                      {folder.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1">
                      {folder.documentsCount || 0} ไฟล์ • {folder.childrenCount || 0} โฟลเดอร์ย่อย
                    </p>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: All Folders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <FolderOpen className="h-4 w-4 text-emerald-600 mr-2" />
              โฟลเดอร์ทั้งหมด <span className="ml-2 bg-emerald-100/60 text-emerald-800 py-0.5 px-2.5 rounded-full text-xs font-semibold">{folders.length}</span>
            </h2>
            {folders.length > 8 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollFolders('left')}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm"
                  title="เลื่อนซ้าย"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFolders('right')}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm"
                  title="เลื่อนขวา"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {folders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white/50">
              <FolderOpen className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">ยังไม่มีโฟลเดอร์</p>
            </div>
          ) : (
            <div 
              id="folders-scroll-container"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {[...folders].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((folder) => (
                <div key={folder.id} className="relative group">
                  <Link
                    href={`/folders/${folder.id}`}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all h-[140px] overflow-hidden ${
                      folder.isPinned ? 'border-amber-200/80 bg-amber-50/20' : 'border-slate-200/60 bg-white'
                    }`}
                  >
                    <div className={`absolute -right-4 -top-4 size-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none ${
                      folder.isPinned ? 'bg-amber-100/50' : 'bg-emerald-50/80'
                    }`}></div>

                    <div className="flex justify-between items-start z-10 w-full">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                        folder.isPinned ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <FolderOpen className={`h-5 w-5 ${folder.isPinned ? 'fill-amber-200' : 'fill-emerald-100'}`} />
                      </div>
                    </div>
                    
                    {editingId === folder.id ? (
                      <form onSubmit={handleEdit} className="z-10 mt-2 w-full" onClick={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="block w-full text-xs font-bold rounded-lg border-0 py-1.5 px-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-emerald-600"
                          autoFocus
                        />
                        <div className="mt-1.5 flex space-x-1.5">
                          <button type="submit" className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="z-10 mt-3 w-full">
                        <div className="flex items-center gap-1.5 w-full">
                          <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 truncate" title={folder.name}>
                            {folder.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {folder.isPinned && (
                            <Pin className="h-3 w-3 text-amber-500 fill-amber-400 shrink-0" />
                          )}
                          <p className="text-[10px] text-slate-400 font-bold tracking-wider">
                            {folder.documentsCount || 0} ไฟล์ • {folder.childrenCount || 0} โฟลเดอร์ย่อย
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Hover Actions */}
                  {editingId !== folder.id && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white pl-2 rounded-lg">
                      {canPin && (
                        <button 
                          onClick={(e) => handleTogglePin(e, folder.id)} 
                          className={`p-1.5 rounded-md transition-colors ${
                            folder.isPinned 
                              ? 'text-amber-500 hover:bg-amber-50' 
                              : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          }`} 
                          title={folder.isPinned ? "ยกเลิกปักหมุด" : "ปักหมุดโฟลเดอร์"}
                        >
                          <Pin className={`h-4 w-4 ${folder.isPinned ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                      {canManagePerms && (
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPermissionFolder(folder); }} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="จัดการสิทธิ์">
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                      {canEdit && (
                        <button onClick={(e) => startEdit(e, folder)} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="แก้ไขชื่อ">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={(e) => handleDelete(e, folder)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="ลบโฟลเดอร์">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Permission Modal */}
        {permissionFolder && (
          <FolderPermissionModal 
            folder={permissionFolder} 
            users={users} 
            roles={roles} 
            onClose={() => setPermissionFolder(null)} 
          />
        )}
        
      </div>
    </MainLayout>
  )
}
