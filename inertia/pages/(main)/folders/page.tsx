import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { MainLayout } from "@/layouts/default";
import { FolderOpen, Plus, Upload, Trash2, Edit2, ChevronRight, ChevronLeft, Shield, Clock, Pin } from 'lucide-react';
import FolderPermissionModal from '@/components/FolderPermissionModal';
import FolderFormModal from '@/components/FolderFormModal';

export default function FoldersIndex({ pinnedFolders = [], recentFolders = [], folders = [], users = [], roles = [] }: { pinnedFolders: any[], recentFolders: any[], folders: any[], users: any[], roles: any[] }) {
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

  const handleDelete = (e: React.MouseEvent, folderId: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('แน่ใจหรือไม่ที่จะลบโฟลเดอร์นี้? เอกสารข้างในจะต้องถูกย้ายหรือลบออกก่อน')) {
      router.delete(`/folders/${folderId}`)
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
        <nav className="flex mb-4 border-b border-emerald-100/60 pb-3" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2 text-sm text-slate-500">
            <li>
              <div className="flex items-center">
                <FolderOpen className="h-5 w-5 flex-shrink-0 text-emerald-600 mr-2" />
                <span className="font-semibold text-slate-900">หน้าหลัก (My Drive)</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">แฟ้มเอกสารทั้งหมด</h1>
          <div className="flex space-x-3">
            <Link
              href="/documents/upload"
              className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-emerald-50/50 transition-all"
            >
              <Upload className="h-4 w-4 mr-2 text-slate-500" />
              อัปโหลดเอกสาร
            </Link>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              สร้างโฟลเดอร์
            </button>
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

        {/* SECTION 1: Pinned Folders */}
        {pinnedFolders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Pin className="h-4 w-4 text-amber-500 fill-amber-400" />
              โฟลเดอร์ที่ปักหมุด (Pinned) <span className="ml-1 bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs font-semibold">{pinnedFolders.length}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {pinnedFolders.map((folder) => (
                <div key={`pinned-${folder.id}`} className="relative group">
                  <Link
                    href={`/folders/${folder.id}`}
                    className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/30 p-5 shadow-sm hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all h-[140px] overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 size-20 bg-amber-100/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 z-10 transition-transform group-hover:scale-105">
                      <FolderOpen className="h-5 w-5 fill-amber-200" />
                    </div>
                    <div className="z-10 mt-3">
                      <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-amber-800 truncate" title={folder.name}>
                        {folder.name}
                      </h3>
                      <p className="text-[10px] text-amber-600/80 font-bold uppercase tracking-wider mt-1">ปักหมุดไว้</p>
                    </div>
                  </Link>

                  {/* Unpin Action */}
                  <button
                    onClick={(e) => handleTogglePin(e, folder.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-colors z-20 bg-white/50 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100"
                    title="ยกเลิกปักหมุด"
                  >
                    <Pin className="h-4 w-4 fill-amber-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Recently Accessed Folders */}
        {recentFolders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              โฟลเดอร์ที่เข้าล่าสุด (Recent)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {recentFolders.map((folder) => (
                <Link
                  key={`recent-${folder.id}`}
                  href={`/folders/${folder.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-emerald-100/80 bg-white p-5 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all h-[140px] overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 size-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 z-10 transition-transform group-hover:scale-105">
                    <FolderOpen className="h-5 w-5 fill-emerald-200" />
                  </div>
                  <div className="z-10 mt-3">
                    <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 truncate" title={folder.name}>
                      {folder.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">เข้าถึงล่าสุด</p>
                  </div>
                </Link>
              ))}
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
              {folders.map((folder) => (
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
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {folder.isPinned ? "ปักหมุด" : "โฟลเดอร์ปกติ"}
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Hover Actions */}
                  {editingId !== folder.id && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white pl-2 rounded-lg">
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
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPermissionFolder(folder); }} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="จัดการสิทธิ์">
                        <Shield className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => startEdit(e, folder)} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="แก้ไขชื่อ">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => handleDelete(e, folder.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="ลบโฟลเดอร์">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
