import { usePage, Link, router } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import {
  FileText,
  AlertCircle,
  FolderOpen,
  Activity,
  User,
  Clock,
  ChevronRight,
  HardDrive,
  LayoutDashboard
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";


type DashboardProps = {
  stats: {
    total_documents: number;
    total_folders: number;
    expiring_soon: number;
    recent_actions: number;
  };
  expiring_documents: Array<{
    id: number;
    name: string;
    extension: string;
    expire_at: string;
    folder_name: string;
  }>;
  recent_activities: Array<{
    id: number;
    action: string;
    document_id?: number;
    document_name: string;
    extension: string;
    version: number;
    expire_at: string | null;
    folder_name: string;
    user: string;
    created_at: string;
  }>;
  file_type_breakdown: Array<{ extension: string; count: number }>;
  storage_breakdown: Array<{ extension: string; total_size: number }>;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const CHART_COLORS = {
  pdf: "#e11d48", // rose-600
  solidworks: "#059669", // emerald-600
  sldprt: "#059669", // emerald-600
  sldasm: "#10b981", // emerald-500
  slddrw: "#34d399", // emerald-400
  dwg: "#0284c7", // sky-600
  other: "#94a3b8", // slate-400
};

const ACTION_COLOR: Record<string, string> = {
  View: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Create: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Edit: "bg-amber-50 text-amber-700 border-amber-200",
  Delete: "bg-rose-50 text-rose-700 border-rose-200",
  Copy: "bg-purple-50 text-purple-700 border-purple-200",
  Move: "bg-orange-50 text-orange-700 border-orange-200",
};

const EXT_COLOR: Record<string, string> = {
  pdf: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
  dwg: "bg-sky-50 text-sky-700 border-sky-200/80 font-bold",
  sldprt: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
  sldasm: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
  slddrw: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-sm shadow-emerald-950/5 p-5 flex items-center gap-4">
      <div className={`size-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value.toLocaleString()}</p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    stats = { total_documents: 0, total_folders: 0, expiring_soon: 0, recent_actions: 0 },
    expiring_documents = [],
    recent_activities = [],
    file_type_breakdown = [],
    storage_breakdown = [],
  } = usePage<any>().props as DashboardProps;

  const user = usePage<any>().props.user;
  const displayName = user?.full_name || user?.username || "ผู้ใช้งาน";

  const totalStorage = storage_breakdown.reduce((sum, item) => sum + Number(item.total_size), 0);

  const groupedStorageBreakdown = [
    { extension: 'PDF', total_size: 0 },
    { extension: 'DWG', total_size: 0 },
    { extension: 'SolidWorks', total_size: 0 },
  ];

  storage_breakdown.forEach((item) => {
    const ext = item.extension.toLowerCase();
    const size = Number(item.total_size);
    if (ext === 'pdf') {
      groupedStorageBreakdown[0].total_size += size;
    } else if (ext === 'dwg') {
      groupedStorageBreakdown[1].total_size += size;
    } else if (['sldasm', 'slddrw', 'sldprt'].includes(ext)) {
      groupedStorageBreakdown[2].total_size += size;
    }
  });

  const chartData = groupedStorageBreakdown.filter((x) => x.total_size > 0);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
            <LayoutDashboard className="size-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">ยินดีต้อนรับ, {displayName}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="เอกสารทั้งหมด"
          value={stats.total_documents}
          icon={FileText}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="โฟลเดอร์ทั้งหมด"
          value={stats.total_folders}
          icon={FolderOpen}
          color="bg-teal-50 text-teal-600"
        />
        <StatCard
          label="ใกล้หมดอายุ"
          value={stats.expiring_soon}
          icon={AlertCircle}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="พื้นที่จัดเก็บรวม"
          value={formatBytes(totalStorage)}
          icon={HardDrive}
          color="bg-emerald-50 text-emerald-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table (Full Detail) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-emerald-900/10 shadow-sm shadow-emerald-950/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="size-4 text-emerald-600" />
              กิจกรรมล่าสุด (5 รายการ)
            </h2>
            <span className="text-xs font-bold text-slate-400">อัปเดตล่าสุด</span>
          </div>

          <div className="overflow-x-auto">
            {recent_activities.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-12">ยังไม่มีกิจกรรมในระบบ</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3.5">กิจกรรม</th>
                    <th className="px-3 py-3.5">ผู้ดำเนินการ</th>
                    <th className="px-4 py-3.5">ชื่อเอกสาร</th>
                    <th className="px-2 py-3.5 text-center">เวอร์ชัน</th>
                    <th className="px-2 py-3.5 text-center">ประเภท</th>
                    <th className="px-3 py-3.5">หมดอายุ</th>
                    <th className="px-3 py-3.5">โฟลเดอร์</th>
                    <th className="px-4 py-3.5 text-right">วันเวลา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent_activities.slice(0, 5).map((act) => (
                    <tr 
                      key={act.id} 
                      onClick={() => act.document_id && router.visit(`/documents/${act.document_id}`)}
                      className={`transition-colors text-xs ${act.document_id ? 'cursor-pointer hover:bg-emerald-50/80' : 'hover:bg-slate-50'}`}
                    >
                      {/* Action */}
                      <td className="px-4 py-[18px] font-semibold">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            ACTION_COLOR[act.action] ?? "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {act.action}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-3 py-[18px] text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="size-3.5 text-slate-400" />
                          <span className="truncate max-w-28">{act.user}</span>
                        </div>
                      </td>

                      {/* Document Name */}
                      <td className="px-4 py-[18px] font-bold text-slate-900">
                        {act.document_id ? (
                          <span className="text-slate-900 group-hover:text-emerald-700 transition-colors truncate block max-w-40" title={act.document_name}>
                            {act.document_name}
                          </span>
                        ) : (
                          <span className="truncate block max-w-40 text-slate-500" title={act.document_name}>{act.document_name}</span>
                        )}
                      </td>

                      {/* Version */}
                      <td className="px-2 py-[18px] text-center">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[11px]">
                          v{act.version}
                        </span>
                      </td>

                      {/* Extension */}
                      <td className="px-2 py-[18px] text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          EXT_COLOR[act.extension.toLowerCase()] ?? "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {act.extension}
                        </span>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-3 py-[18px] whitespace-nowrap">
                        {act.expire_at ? (
                          <span className={`font-semibold ${
                            new Date(act.expire_at) < new Date(Date.now() + 30 * 86400000)
                              ? "text-rose-600"
                              : "text-slate-500"
                          }`}>
                            {new Date(act.expire_at).toLocaleDateString("th-TH")}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Folder */}
                      <td className="px-3 py-[18px] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                          <FolderOpen className="size-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-24">{act.folder_name}</span>
                        </span>
                      </td>

                      {/* Event Timestamp */}
                      <td className="px-4 py-[18px] text-right text-slate-400 font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="size-3 text-slate-300" />
                          <span>
                            {new Date(act.created_at).toLocaleDateString("th-TH", { day: 'numeric', month: 'numeric', year: 'numeric' })}{" "}
                            <span className="text-slate-500 font-bold">{new Date(act.created_at).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* File Type Breakdown */}
        <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-sm shadow-emerald-950/5 overflow-hidden flex flex-col justify-between">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900">ประเภทไฟล์</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
              3 หมวดหลัก
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            {file_type_breakdown.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">ยังไม่มีไฟล์</p>
            ) : (
              (() => {
                const getCount = (ext: string) => {
                  const item = file_type_breakdown.find(x => x.extension.toLowerCase() === ext.toLowerCase());
                  return item ? Number(item.count) : 0;
                };

                const maxCount = Math.max(1, ...file_type_breakdown.map(x => Number(x.count)));

                const pdfCount = getCount('pdf');
                const dwgCount = getCount('dwg');
                
                const solidworksExts = [
                  { ext: 'SLDASM', label: 'SLDASM', count: getCount('sldasm') },
                  { ext: 'SLDDRW', label: 'SLDDRW', count: getCount('slddrw') },
                  { ext: 'SLDPRT', label: 'SLDPRT', count: getCount('sldprt') },
                ];
                
                const totalSolidworks = solidworksExts.reduce((sum, item) => sum + item.count, 0);

                return (
                  <div className="space-y-5">
                    {/* 1. PDF */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 1. PDF
                        </span>
                        <span className="text-xs font-bold text-slate-400">{pdfCount} ไฟล์</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(pdfCount / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-800 w-6 text-right">{pdfCount}</span>
                      </div>
                    </div>

                    {/* 2. DWG */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> 2. DWG
                        </span>
                        <span className="text-xs font-bold text-slate-400">{dwgCount} ไฟล์</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-sky-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(dwgCount / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-800 w-6 text-right">{dwgCount}</span>
                      </div>
                    </div>

                    {/* 3. SolidWorks Group */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> 3. SolidWorks
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          รวม {totalSolidworks} ไฟล์
                        </span>
                      </div>

                      {/* 3 SolidWorks Extensions with separate progress bars */}
                      <div className="pl-4 border-l-[3px] border-emerald-200/80 space-y-3">
                        {solidworksExts.map((item) => (
                          <div key={item.ext} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-600 uppercase">{item.ext}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-slate-700 w-6 text-right">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div> {/* End of First Row */}
      
      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Expiring Documents (New Section) lg:col-span-2 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-900/10 shadow-sm shadow-rose-950/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/30">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600" />
              เอกสารที่ใกล้หมดอายุ (ภายใน 30 วัน)
            </h2>
            <Link
              href="/dashboard/expiring"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 shadow-sm shadow-rose-100"
            >
              ดูทั้งหมด
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {expiring_documents.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="size-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 shadow-sm shadow-emerald-100">
                  <FileText className="size-6 text-emerald-500" />
                </div>
                <p className="text-emerald-700 font-bold text-sm">เยี่ยมมาก! ไม่มีเอกสารใกล้หมดอายุ</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3.5">ชื่อเอกสาร</th>
                    <th className="px-4 py-3.5">ประเภท</th>
                    <th className="px-4 py-3.5">โฟลเดอร์</th>
                    <th className="px-6 py-3.5 text-right">วันหมดอายุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expiring_documents.map((doc) => {
                    const daysLeft = Math.ceil((new Date(doc.expire_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    const isExpired = daysLeft <= 0;
                    const isCritical = daysLeft < 15 && !isExpired;
                    const dateColor = (isExpired || isCritical) ? 'text-rose-600' : 'text-amber-600';
                    const labelColor = (isExpired || isCritical) ? 'text-rose-500' : 'text-amber-500';

                    return (
                      <tr 
                        key={doc.id} 
                        onClick={() => router.visit(`/documents/${doc.id}`)}
                        className="cursor-pointer hover:bg-slate-50/80 transition-colors text-xs group"
                      >
                        <td className="px-6 py-3 font-bold text-slate-900">
                          <span className="group-hover:text-emerald-600 transition-colors block max-w-[200px] sm:max-w-xs truncate" title={doc.name}>
                            {doc.name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                            EXT_COLOR[doc.extension.toLowerCase()] ?? "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {doc.extension}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                            <FolderOpen className="size-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-32">{doc.folder_name}</span>
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-black ${dateColor}`}>
                              {new Date(doc.expire_at).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className={`text-[10px] font-bold mt-0.5 ${labelColor}`}>
                              {isExpired ? "หมดอายุแล้ว" : `เหลือเวลา ${daysLeft} วัน`}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Storage Usage Breakdown */}
        <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-sm shadow-emerald-950/5 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="size-4 text-emerald-600" />
              พื้นที่จัดเก็บ
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
              รวม {formatBytes(totalStorage)}
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {chartData.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">ไม่มีข้อมูลพื้นที่จัดเก็บ</p>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="total_size"
                        nameKey="extension"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[entry.extension.toLowerCase() as keyof typeof CHART_COLORS] ?? CHART_COLORS.other} 
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number, name: string) => [formatBytes(value), name.toUpperCase()]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-6 flex flex-wrap justify-center gap-4">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span 
                        className="w-3 h-3 rounded-full shadow-sm" 
                        style={{ backgroundColor: CHART_COLORS[item.extension.toLowerCase() as keyof typeof CHART_COLORS] ?? CHART_COLORS.other }}
                      />
                      <span className="uppercase">{item.extension}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
