import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { MainLayout } from "@/layouts/default";
import { FolderOpen, FileText, Plus, Upload, Trash2, Edit2, ChevronRight, ChevronLeft, Shield, Pin, Download, X } from 'lucide-react';
import FolderPermissionModal from '@/components/FolderPermissionModal';
import FolderFormModal from '@/components/FolderFormModal';
import { swalConfirm } from '@/lib/swal';
import { formatThaiDate, getExtensionBadgeClass, getPaginationItems } from '@/lib/utils';

export default function FolderShow({ folder, breadcrumbs, documents, users, roles }: { folder: any, breadcrumbs: any[], documents: any[], users: any[], roles: any[] }) {
  const { props } = usePage<any>()
  const user = props.user
  const folderPerms = user?.permissions?.folders || []
  const docPerms = user?.permissions?.documents || []
  
  const canCreate = folderPerms.includes('create')
  const canEdit = folderPerms.includes('edit')
  const canDelete = folderPerms.includes('delete')
  const canPin = folderPerms.includes('pin')
  const canManagePerms = folderPerms.includes('manage_permissions')
  
  const canUploadDoc = docPerms.includes('upload')
  const canDownloadDoc = docPerms.includes('download')
  const canDeleteDoc = docPerms.includes('delete')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPermissionOpen, setIsPermissionOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((documents?.length || 0) / itemsPerPage);
  const currentDocuments = (documents || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    
    router.post('/folders', { name: newFolderName, parentId: folder.id }, {
      onSuccess: () => {
        setIsCreateOpen(false)
        setNewFolderName('')
      }
    })
  }

  const startEdit = (e: React.MouseEvent, child: any) => {
    e.preventDefault()
    setEditingId(child.id)
    setEditName(child.name)
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

  const handleTogglePin = (e: React.MouseEvent, childId: number) => {
    e.preventDefault()
    e.stopPropagation()
    router.post(`/folders/${childId}/pin`)
  }

  const handleDelete = (e: React.MouseEvent, childId: number) => {
    e.preventDefault()
    if (confirm('แน่ใจหรือไม่ที่จะลบโฟลเดอร์นี้? เอกสารข้างในจะต้องถูกย้ายหรือลบออกก่อน')) {
      router.delete(`/folders/${childId}`)
    }
  }

  const scrollSubfolders = (direction: 'left' | 'right') => {
    const el = document.getElementById('subfolders-scroll-container')
    if (el) {
      el.scrollBy({
        left: direction === 'left' ? -600 : 600,
        behavior: 'smooth'
      })
    }
  }

  return (
    <MainLayout>
      <Head title={folder.name} />
      <div className="w-full h-full flex flex-col pt-2 pb-6">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-4 border-b border-emerald-100/60 pb-3 pt-3 overflow-x-auto" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2 text-sm text-slate-500 min-w-max py-1">
            <li>
              <Link href="/folders" className="flex items-center hover:text-emerald-600 transition-colors">
                <FolderOpen className="h-5 w-5 flex-shrink-0 mr-1.5 text-emerald-600" />
                <span className="font-semibold text-slate-900">หน้าหลัก</span>
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.id} className="flex items-center">
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 mx-1" />
                <Link
                  href={`/folders/${crumb.id}`}
                  className={`ml-1 font-medium transition-colors ${crumb.id === folder.id ? 'text-slate-900 font-bold pointer-events-none' : 'hover:text-emerald-600'}`}
                >
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            {folder.parentId ? (
              <Link href={`/folders/${folder.parentId}`} className="p-2 -ml-2 rounded-full hover:bg-emerald-50/60 text-slate-500 transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </Link>
            ) : (
              <Link href="/folders" className="p-2 -ml-2 rounded-full hover:bg-emerald-50/60 text-slate-500 transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </Link>
            )}
            <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-[20px] border border-emerald-100/60 shadow-sm shadow-emerald-900/5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <FolderOpen className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{folder.name}</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {canManagePerms && (
              <button
                onClick={() => setIsPermissionOpen(true)}
                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
              >
                <Shield className="h-4 w-4 mr-2 text-slate-500" />
                จัดการสิทธิ์
              </button>
            )}
            {canUploadDoc && (
              <Link
                href={`/documents/upload?folderId=${folder.id}`}
                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-emerald-50/50 transition-all"
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
                สร้างโฟลเดอร์ย่อย
              </button>
            )}
          </div>
        </div>

        {/* Permission Modal */}
        {isPermissionOpen && (
          <FolderPermissionModal 
            folder={folder} 
            users={users} 
            roles={roles} 
            onClose={() => setIsPermissionOpen(false)} 
          />
        )}

        {/* Create Folder Modal */}
        {isCreateOpen && (
          <FolderFormModal 
            parentId={folder.id} 
            users={users} 
            roles={roles} 
            onClose={() => setIsCreateOpen(false)} 
          />
        )}

        {/* Folders Section - Only show when there are subfolders */}
        {folder.children && folder.children.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>โฟลเดอร์ย่อย</span>
                <span className="bg-emerald-100/70 text-emerald-800 py-0.2 px-2 rounded-full text-[11px] font-bold">
                  {folder.children.length}
                </span>
              </h2>
            </div>
            
            <div 
              id="subfolders-scroll-container"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 transition-all"
            >
              {folder.children.map((child: any) => (
                <div key={child.id} className="relative group">
                  <Link
                    href={`/folders/${child.id}`}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-2xs hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-xs transition-all overflow-hidden h-[50px]"
                  >
                    <div className="size-7 shrink-0 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/80 group-hover:scale-105 transition-transform">
                      <FolderOpen className="size-3.5 fill-emerald-100" />
                    </div>
                    
                    {editingId === child.id ? (
                      <form onSubmit={handleEdit} className="flex-1 flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="block w-full text-xs font-bold rounded-md border-0 py-1 px-1.5 text-slate-900 shadow-2xs ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-emerald-600"
                          autoFocus
                        />
                        <button type="submit" className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-1 rounded">บันทึก</button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-1 rounded">ยกเลิก</button>
                      </form>
                    ) : (
                      <div className="flex-1 min-w-0 pr-1">
                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate" title={child.name}>
                          {child.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                          โฟลเดอร์ย่อย
                        </p>
                      </div>
                    )}

                    {child.isPinned && (
                      <Pin className="size-3 text-amber-500 fill-amber-400 shrink-0" />
                    )}
                    <ChevronRight className="size-3 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                  </Link>

                  {/* Hover Actions */}
                  {editingId !== child.id && (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/95 px-1 py-0.5 rounded-lg border border-slate-200/80 shadow-xs z-20">
                      {canPin && (
                        <button 
                          onClick={(e) => handleTogglePin(e, child.id)} 
                          className={`p-1 rounded transition-colors ${
                            child.isPinned 
                              ? 'text-amber-500 hover:bg-amber-50' 
                              : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          }`} 
                          title={child.isPinned ? "ยกเลิกปักหมุด" : "ปักหมุดโฟลเดอร์"}
                        >
                          <Pin className={`size-3.5 ${child.isPinned ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                      {canEdit && (
                        <button onClick={(e) => startEdit(e, child)} className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="แก้ไขชื่อ">
                          <Edit2 className="size-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={(e) => handleDelete(e, child.id)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="ลบโฟลเดอร์">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            ไฟล์เอกสาร <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{documents?.length || 0}</span>
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
            {(!documents || documents.length === 0) ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900">ไม่มีเอกสารในโฟลเดอร์นี้</p>
                <p className="text-sm text-gray-500 mt-1">อัปโหลดเอกสารเพื่อเพิ่มไฟล์</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อเอกสาร</th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภท</th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้สร้าง</th>
                    <th className="px-3 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">เวอร์ชัน</th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">อัปเดตล่าสุด</th>
                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">วันหมดอายุ</th>
                    <th className="relative py-4 pl-3 pr-6"><span className="sr-only">จัดการ</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentDocuments.map((doc: any) => (
                    <tr 
                      key={doc.id} 
                      onClick={() => router.get(`/documents/${doc.id}`)}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 flex items-center group-hover:text-emerald-600 transition-colors">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        {doc.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 uppercase">
                          {doc.extension || 'FILE'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-emerald-700">
                              {doc.owner?.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <span className="truncate max-w-[120px]" title={doc.owner?.full_name || 'ไม่ทราบ'}>
                            {doc.owner?.full_name || 'ไม่ทราบ'}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                          V.{doc.latest_version || 1}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {doc.updated_at || doc.updatedAt ? new Date(doc.updated_at || doc.updatedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {doc.expire_at ? <span className="text-rose-600 font-medium">{new Date(doc.expire_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span> : <span className="text-gray-400">ไม่มีวันหมดอายุ</span>}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                        <Link 
                          href={`/documents/${doc.id}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center text-emerald-600 hover:text-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ดูรายละเอียด <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      แสดง <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> ถึง <span className="font-semibold">{Math.min(currentPage * itemsPerPage, documents.length)}</span> จาก <span className="font-semibold">{documents.length}</span> รายการ
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </MainLayout>
  )
}
