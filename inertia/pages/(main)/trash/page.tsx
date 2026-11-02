import { Head, router, usePage } from '@inertiajs/react'
import { MainLayout } from '@/layouts/default'
import { FolderOpen, FileText, RefreshCcw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { swalConfirm } from '@/lib/swal'
import { formatThaiDate, getExtensionBadgeClass, getPaginationItems } from '@/lib/utils'

export default function TrashPage({ folders = [], documents = [] }: { folders?: any[], documents?: any[] }) {
  const { props } = usePage<any>();
  const trashPerms = props.user?.permissions?.trash || [];
  const canRestore = trashPerms.includes('restore');
  const canForceDelete = trashPerms.includes('force_delete');

  const [selectedType, setSelectedType] = useState<'document' | 'folder'>('document')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const safeFolders = Array.isArray(folders) ? folders : []
  const safeDocuments = Array.isArray(documents) ? documents : []

  const items = [
    ...safeFolders,
    ...safeDocuments
  ].sort((a, b) => {
    const timeA = new Date(a?.deleted_at || a?.updated_at || 0).getTime()
    const timeB = new Date(b?.deleted_at || b?.updated_at || 0).getTime()
    return timeB - timeA
  })

  const filteredItems = items.filter(item => item.type === selectedType)

  const handleTabChange = (type: 'document' | 'folder') => {
    setSelectedType(type)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleRestore = async (id: number, type: string) => {
    if (await swalConfirm({ title: 'คุณต้องการกู้คืนรายการนี้ใช่หรือไม่?', confirmButtonText: 'กู้คืน', confirmButtonColor: '#10b981' })) {
      router.post('/trash/restore', { id, type })
    }
  }

  const handleForceDelete = async (id: number, type: string) => {
    if (await swalConfirm({ title: 'คุณต้องการลบรายการนี้แบบถาวรใช่หรือไม่?', text: 'ไม่สามารถกู้คืนได้อีก' })) {
      router.post('/trash/force-delete', { id, type })
    }
  }

  return (
    <MainLayout>
      <Head title="ถังขยะ (Trash)" />
      <div className="w-full h-full flex flex-col pt-2 pb-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 shadow-sm shrink-0">
              <Trash2 className="size-6 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">ถังขยะ (Trash)</h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                รายการไฟล์และโฟลเดอร์ที่ถูกลบ จะถูกเก็บไว้เป็นเวลา 30 วันก่อนลบถาวรอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => handleTabChange('document')}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${selectedType === 'document' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            เอกสาร
          </button>
          <button
            onClick={() => handleTabChange('folder')}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${selectedType === 'folder' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            โฟลเดอร์
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex-1 overflow-auto">
          <div className="w-full">
            
            {filteredItems.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="mx-auto w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                     <Trash2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">ถังขยะว่างเปล่า</h3>
                  <p className="text-sm text-slate-500">ไม่มีไฟล์หรือโฟลเดอร์ที่ถูกลบในขณะนี้</p>
               </div>
            ) : (
               <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[48px_1fr_110px_130px_140px_160px_160px_180px] gap-6 px-6 py-4 border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
                     <div className="w-10"></div>
                     <div>ชื่อรายการ</div>
                     <div>ประเภท</div>
                     <div>วันที่ลบ</div>
                     <div>ระยะเวลาคงเหลือ</div>
                     <div>ผู้สร้าง/เจ้าของ</div>
                     <div>ผู้ลบรายการ</div>
                     <div className="text-center">จัดการ</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                     {paginatedItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[48px_1fr_110px_130px_140px_160px_160px_180px] gap-6 px-6 py-4.5 items-center hover:bg-slate-50/80 transition-colors">
                           <div className="w-10 flex justify-center">
                              {item.type === 'folder' ? (
                                 <div className="size-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                                   <FolderOpen className="w-5 h-5 text-amber-600 fill-amber-200/50" />
                                 </div>
                              ) : (
                                 <div className="size-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                                   <FileText className="w-5 h-5 text-blue-600" />
                                 </div>
                              )}
                           </div>
                           <div className="min-w-0">
                              <div className="font-extrabold text-sm text-slate-900 truncate">{item.name || item.original_name}</div>
                           </div>
                           <div className="whitespace-nowrap">
                              {item.type === 'folder' ? (
                                <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 uppercase">
                                  FOLDER
                                </span>
                              ) : (
                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border uppercase ${getExtensionBadgeClass(item.extension)}`}>
                                  {item.extension || 'FILE'}
                                </span>
                              )}
                           </div>
                           <div className="text-sm text-slate-700 font-semibold whitespace-nowrap">
                              {formatThaiDate(item.deleted_at || item.updated_at)}
                           </div>
                           <div className="whitespace-nowrap">
                              {(() => {
                                const deletedTime = new Date(item.deleted_at || item.updated_at || Date.now()).getTime();
                                const diffDays = Math.floor((Date.now() - deletedTime) / (1000 * 60 * 60 * 24));
                                const rem = Math.max(0, 30 - diffDays);
                                return (
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                                    rem <= 7 
                                      ? 'bg-rose-50 text-rose-700 border-rose-200/80' 
                                      : 'bg-amber-50 text-amber-700 border-amber-200/80'
                                  }`}>
                                    เหลืออีก {rem} วัน
                                  </span>
                                );
                              })()}
                           </div>
                           <div className="text-sm text-slate-700 font-extrabold truncate">
                              {item.owner?.full_name || item.creator?.full_name || 'Admin'}
                           </div>
                           <div className="text-sm text-slate-700 font-extrabold truncate">
                              {item.deleted_by || 'Admin'}
                           </div>
                           <div className="flex justify-center gap-2">
                              {canRestore && (
                                <button 
                                   onClick={() => handleRestore(item.id, item.type)}
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-200/60 shadow-sm"
                                >
                                   <RefreshCcw className="w-3.5 h-3.5" />
                                   กู้คืน
                                </button>
                              )}
                              {canForceDelete && (
                                <button 
                                   onClick={() => handleForceDelete(item.id, item.type)}
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-200/60 shadow-sm"
                                >
                                   <Trash2 className="w-3.5 h-3.5" />
                                   ลบถาวร
                                </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="border-t border-slate-100 bg-white px-4 py-3 flex items-center justify-between sm:px-6">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-slate-700 font-medium">
                            แสดง <span className="font-bold text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> ถึง <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> จาก <span className="font-bold text-slate-900">{filteredItems.length}</span> รายการ
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              type="button"
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            
                            {getPaginationItems(currentPage, totalPages).map((page, idx) => (
                              typeof page === "number" ? (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setCurrentPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-extrabold transition-colors ${
                                    currentPage === page
                                      ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              ) : (
                                <span
                                  key={idx}
                                  className="relative inline-flex items-center px-3 py-2 border border-slate-200 bg-white text-sm font-bold text-slate-400 select-none"
                                >
                                  ...
                                </span>
                              )
                            ))}

                            <button
                              type="button"
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
