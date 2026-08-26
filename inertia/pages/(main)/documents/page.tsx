import { usePage, Link, router } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Download,
  History,
  MoreHorizontal,
  FolderOpen,
} from "lucide-react";

type Document = {
  id: number;
  name: string;
  original_name: string;
  extension: string;
  owner: { full_name: string; username: string };
  folder: { id: number; name: string } | null;
  expire_at: string | null;
  created_at: string;
  latest_version: number;
};

export default function DocumentsPage() {
  const { documents = [], meta = {}, filters = {} } = usePage<any>().props as {
    documents: Document[];
    meta: { current_page: number; last_page: number; total: number };
    filters: any;
  };

  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [typeFilters, setTypeFilters] = useState<string[]>(
    filters.type ? (Array.isArray(filters.type) ? filters.type : filters.type.split(',')) : []
  );
  const [ownerFilter, setOwnerFilter] = useState(filters.owner || "");
  
  const [createdFrom, setCreatedFrom] = useState(filters.created_from || "");
  const [createdTo, setCreatedTo] = useState(filters.created_to || "");
  const [expireFrom, setExpireFrom] = useState(filters.expire_from || "");
  const [expireTo, setExpireTo] = useState(filters.expire_to || "");

  const handleTypeToggle = (ext: string) => {
    setTypeFilters(prev => 
      prev.includes(ext) ? prev.filter(t => t !== ext) : [...prev, ext]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams: any = {
      search: searchQuery,
      owner: ownerFilter,
      created_from: createdFrom,
      created_to: createdTo,
      expire_from: expireFrom,
      expire_to: expireTo,
    };
    
    if (typeFilters.length > 0) {
      queryParams.type = typeFilters.join(',');
    }
    
    // Clean empty values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key]) delete queryParams[key];
    });

    router.get("/documents", queryParams, { preserveState: true });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilters([]);
    setOwnerFilter("");
    setCreatedFrom("");
    setCreatedTo("");
    setExpireFrom("");
    setExpireTo("");
    router.get("/documents");
  };

  const EXT_COLOR: Record<string, string> = {
    pdf: "bg-rose-50 text-rose-700 border-rose-200/80",
    sldprt: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    sldasm: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dwg: "bg-teal-50 text-teal-800 border-teal-200/80",
    dxf: "bg-teal-50 text-teal-800 border-teal-200/80",
  };

  const EXT_LIST = ["pdf", "dwg", "sldprt", "sldasm", "slddrw"];

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">เอกสาร</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{meta.total ?? documents.length} รายการ</p>
        </div>
        <Link
          href="/documents/upload"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
        >
          <Upload className="size-4" />
          อัปโหลดเอกสาร
        </Link>
      </div>

      {/* Advanced Filters */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-5 rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col gap-5">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Search File Name */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ค้นหาชื่อไฟล์</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="กรอกชื่อไฟล์..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Extension Filter Chips */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">นามสกุลไฟล์ (เลือกได้มากกว่า 1)</label>
            <div className="flex flex-wrap gap-1.5">
              {EXT_LIST.map(ext => (
                <button
                  key={ext}
                  type="button"
                  onClick={() => handleTypeToggle(ext)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    typeFilters.includes(ext)
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                      : 'bg-white text-slate-600 border-slate-200/80 hover:bg-emerald-50/60 hover:border-emerald-200'
                  }`}
                >
                  {ext.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Owner */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">เจ้าของเอกสาร</label>
            <input
              type="text"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              placeholder="ชื่อผู้ใช้..."
              className="w-full px-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Date Filters & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end pt-4 border-t border-slate-100">
          <div className="md:col-span-5">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">วันที่สร้าง</label>
             <div className="flex items-center gap-2">
                <input type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)} className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
                <span className="text-slate-400 text-sm">ถึง</span>
                <input type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)} className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
             </div>
          </div>
          <div className="md:col-span-5">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">วันหมดอายุ</label>
             <div className="flex items-center gap-2">
                <input type="date" value={expireFrom} onChange={e => setExpireFrom(e.target.value)} className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
                <span className="text-slate-400 text-sm">ถึง</span>
                <input type="date" value={expireTo} onChange={e => setExpireTo(e.target.value)} className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
             </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              ค้นหา
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              ล้างค่า
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อไฟล์</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">โฟลเดอร์</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ประเภท</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">เจ้าของ</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">เวอร์ชัน</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">หมดอายุ</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สร้างเมื่อ</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FolderOpen className="size-12 text-slate-300" />
                      <p className="text-slate-400 font-medium">ยังไม่มีเอกสาร</p>
                      <Link
                        href="/documents/upload"
                        className="text-emerald-600 text-sm font-semibold hover:underline"
                      >
                        อัปโหลดเอกสารแรก
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr 
                    key={doc.id} 
                    onClick={() => router.get(`/documents/${doc.id}`)}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText className="size-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{doc.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-48">{doc.original_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-600">
                      {doc.folder ? (
                        <Link 
                          href={`/folders/${doc.folder.id}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-semibold transition-colors"
                        >
                          <FolderOpen className="size-3.5 text-emerald-600" />
                          {doc.folder.name}
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">หน้าหลัก</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border uppercase ${
                          EXT_COLOR[doc.extension.toLowerCase()] ??
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {doc.extension}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                      {doc.owner?.full_name || doc.owner?.username}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-slate-700">v{doc.latest_version ?? 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      {doc.expire_at ? (
                        <span
                          className={`text-xs font-semibold ${
                            new Date(doc.expire_at) < new Date(Date.now() + 30 * 86400000)
                              ? "text-rose-600"
                              : "text-slate-500"
                          }`}
                        >
                          {new Date(doc.expire_at).toLocaleDateString("th-TH")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {doc.created_at && !isNaN(new Date(doc.created_at).getTime()) 
                        ? new Date(doc.created_at).toLocaleDateString("th-TH") 
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/documents/${doc.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/documents/${doc.id}/versions`}
                          className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="ประวัติเวอร์ชัน"
                        >
                          <History className="size-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
