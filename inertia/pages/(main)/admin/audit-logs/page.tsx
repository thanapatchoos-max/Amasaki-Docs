import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MainLayout } from "@/layouts/default";
import {
  Activity,
  X,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
  Eye,
  Trash2,
  Edit3,
  Upload,
  Layers
} from "lucide-react";
import { formatThaiDate, getPaginationItems } from "@/lib/utils";

function LogDetailsCell({ log }: { log: any }) {
  const details = log.details || {};
  const action = log.action;

  if (action === "View") {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Eye className="size-3.5 text-emerald-600 shrink-0" />
          เปิดดูตัวอย่างเอกสาร
        </span>
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
          {details.browser && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
              <Globe className="size-3 text-slate-500" />
              {details.browser}
            </span>
          )}
          {details.ip && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500 font-mono text-[10px]">
              IP: {details.ip}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (action === "Download") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Download className="size-3.5 text-sky-600 shrink-0" />
          <span className="text-xs font-semibold text-sky-800">
            ดาวน์โหลดไฟล์เอกสาร
          </span>
          {details.version && (
            <span className="px-1.5 py-0.5 rounded bg-sky-100/70 text-sky-700 border border-sky-200 text-[10px] font-bold">
              v{details.version}
            </span>
          )}
        </div>
        {details.filename && (
          <span className="text-[11px] font-mono text-slate-600 truncate max-w-[260px] block" title={details.filename}>
            📄 {details.filename}
          </span>
        )}
      </div>
    );
  }

  if (action === "Delete") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Trash2 className="size-3.5 text-rose-500 shrink-0" />
          <span className="text-xs font-semibold text-rose-700">
            ลบเอกสารย้ายเข้าถังขยะ
          </span>
        </div>
        {details.reason && (
          <span className="text-[11px] font-medium text-rose-700/90 bg-rose-50 border border-rose-200/70 rounded-md px-2 py-0.5 max-w-[280px] truncate block" title={details.reason}>
            เหตุผล: {details.reason}
          </span>
        )}
        {details.filename && (
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[260px] block" title={details.filename}>
            {details.filename}
          </span>
        )}
      </div>
    );
  }

  if (action === "Upload" || action === "Create") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Upload className="size-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-emerald-800">
            อัปโหลด / สร้างเอกสารใหม่
          </span>
          {details.version && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              v{details.version}
            </span>
          )}
        </div>
        {details.filename && (
          <span className="text-[11px] font-mono text-slate-600 truncate max-w-[260px] block" title={details.filename}>
            📄 {details.filename}
          </span>
        )}
      </div>
    );
  }

  if (action === "Edit") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Edit3 className="size-3.5 text-amber-600 shrink-0" />
          <span className="text-xs font-semibold text-amber-800">
            อัปเดตเวอร์ชันเอกสาร
          </span>
          {details.version && (
            <span className="px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-700 border border-amber-200 text-[10px] font-bold">
              v{details.version}
            </span>
          )}
        </div>
        {details.filename && (
          <span className="text-[11px] font-mono text-slate-600 truncate max-w-[260px] block" title={details.filename}>
            📄 {details.filename}
          </span>
        )}
      </div>
    );
  }

  if (log.activity_summary) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-800">{log.activity_summary}</span>
        {typeof details === "object" && Object.keys(details).length > 0 && (
          <span className="text-[11px] text-slate-500 truncate max-w-[260px] block">
            {Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(" • ")}
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="text-xs text-slate-600">
      {log.details ? (typeof log.details === "string" ? log.details : JSON.stringify(log.details)) : "—"}
    </span>
  );
}

export default function AdminAuditLogsPage() {
  const { props } = usePage<any>();
  const { logs = [], meta = {}, filters = {} } = props as {
    logs: Array<{
      id: number;
      user: { full_name: string; username: string };
      action: string;
      target_type: string;
      target_id: number;
      document_id: number | null;
      document_name: string | null;
      activity_summary?: string;
      details: any;
      created_at: string;
    }>;
    meta: { total: number; current_page: number; last_page: number };
    filters: { actions?: string[]; user?: string; date_from?: string; date_to?: string };
  };
  const auditPerms = props.user?.permissions?.audit_logs || [];
  const canExport = auditPerms.includes('export');

  const [currentPage, setCurrentPage] = useState(meta.current_page || 1);
  const itemsPerPage = 20;

  const totalItems = meta.total || logs.length;
  const totalPages = meta.last_page || Math.ceil(totalItems / itemsPerPage);
  
  const isServerPaginated = Boolean(meta.last_page);
  const paginatedLogs = isServerPaginated || logs.length <= itemsPerPage
    ? logs
    : logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (isServerPaginated) {
      router.get("/admin/audit-logs", { ...filters, page }, { preserveState: true });
    }
  };

  const ACTION_COLOR: Record<string, string> = {
    View: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Create: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Upload: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Edit: "bg-amber-100 text-amber-800 border-amber-300",
    Download: "bg-sky-100 text-sky-800 border-sky-300",
    Delete: "bg-rose-100 text-rose-800 border-rose-300",
    Copy: "bg-purple-100 text-purple-800 border-purple-300",
    Move: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const SYSTEM_ACTIONS = ["View", "Create", "Upload", "Edit", "Download", "Delete", "Copy", "Move"];

  const [filterActions, setFilterActions] = useState<string[]>(filters.actions || []);
  const [filterUser, setFilterUser] = useState(filters.user || "");
  const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || "");
  const [filterDateTo, setFilterDateTo] = useState(filters.date_to || "");

  const applyFilters = (updates: any = {}) => {
    const newFilters = {
      actions: filterActions,
      user: filterUser,
      date_from: filterDateFrom,
      date_to: filterDateTo,
      ...updates
    };
    
    router.get(
      "/admin/audit-logs",
      newFilters,
      { preserveState: true, replace: true }
    );
  };

  const handleActionToggle = (action: string) => {
    let newActions = [...filterActions];
    if (newActions.includes(action)) {
      newActions = newActions.filter((a) => a !== action);
    } else {
      newActions.push(action);
    }
    setFilterActions(newActions);
    applyFilters({ actions: newActions });
  };

  const handleDateChange = (type: 'from' | 'to', val: string) => {
    if (type === 'from') {
      setFilterDateFrom(val);
      applyFilters({ date_from: val });
    } else {
      setFilterDateTo(val);
      applyFilters({ date_to: val });
    }
  };

  const clearFilters = () => {
    setFilterActions([]);
    setFilterUser("");
    setFilterDateFrom("");
    setFilterDateTo("");
    router.get("/admin/audit-logs", {}, { preserveState: true, replace: true });
  };

  const exportCSV = () => {
    alert("Exporting CSV...");
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col pt-0 pb-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
              <Activity className="size-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Audit Log (บันทึกกิจกรรม)</h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                ติดตามและตรวจสอบประวัติกิจกรรมการใช้งานทั้งหมดในระบบ ({meta.total ?? logs.length} รายการ)
              </p>
            </div>
          </div>
        </div>

        {/* Compact & Efficient Filter Box */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/60 shadow-sm shadow-emerald-900/5 mb-4 flex flex-col gap-4">
          
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Date From */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">DATE FROM</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
              />
            </div>

            {/* Date To */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">DATE TO</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
              />
            </div>

            {/* Search User */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">SEARCH USER</label>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-base font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                />
              </div>
            </div>

            {/* Actions (Clear & Export) */}
            <div className="md:col-span-2 flex items-center gap-2 justify-end">
              <button
                onClick={clearFilters}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-all"
                title="Clear all filters"
              >
                <X className="h-4 w-4 mr-1 text-slate-500" />
                Clear
              </button>
              {canExport && (
                <button
                  onClick={exportCSV}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 transition-all"
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4 mr-1 text-emerald-600" />
                  CSV
                </button>
              )}
            </div>
          </div>

          {/* Action Pills Row (Inline & Clean) */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">ACTION TYPES:</span>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_ACTIONS.map((action) => {
                const isSelected = filterActions.includes(action);
                return (
                  <button
                    key={action}
                    onClick={() => handleActionToggle(action)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                      isSelected 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-sm"
                    }`}
                  >
                    {action}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-width Responsive Table */}
        <div className="bg-white rounded-2xl border border-emerald-100/60 shadow-sm shadow-emerald-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="w-[16%] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th className="w-[18%] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="w-[12%] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="w-[22%] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                  <th className="w-[32%] px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details (รายละเอียดกิจกรรม)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <Activity className="size-8 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-700">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
                        <p className="text-sm font-medium text-slate-400">ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                        {formatThaiDate(log.created_at)} {new Date(log.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {log.user?.full_name || "—"}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            @{log.user?.username || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${
                            ACTION_COLOR[log.action] ?? "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {log.document_id ? (
                          <button
                            type="button"
                            onClick={() => router.visit(`/documents/${log.document_id}`)}
                            className="text-left hover:text-emerald-700 transition-colors group/link block"
                          >
                            <span className="text-slate-400 font-semibold text-[11px] block uppercase tracking-wide">
                              {log.target_type}
                            </span>
                            <span className="group-hover/link:underline font-bold text-slate-800 truncate block max-w-[210px]" title={log.document_name || undefined}>
                              {log.document_name || `#${log.target_id}`}
                            </span>
                          </button>
                        ) : (
                          <div>
                            <span className="text-slate-400 font-semibold text-[11px] block uppercase tracking-wide">
                              {log.target_type}
                            </span>
                            <span className="font-bold text-slate-800 truncate block max-w-[210px]" title={log.document_name || undefined}>
                              {log.document_name || `#${log.target_id}`}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <LogDetailsCell log={log} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 bg-white px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700 font-medium">
                    แสดง <span className="font-bold text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> ถึง <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> จาก <span className="font-bold text-slate-900">{totalItems}</span> รายการ
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                          onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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

      </div>
    </MainLayout>
  );
}
