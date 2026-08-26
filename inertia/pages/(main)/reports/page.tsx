import { Head, usePage } from '@inertiajs/react';
import { MainLayout } from '@/layouts/default';
import { BarChart3, Users, FolderOpen, FileText, Download, Trophy, FileBadge2, Archive } from 'lucide-react';

interface PageProps {
  topUploaders: { id: number; name: string; count: number }[];
  folderBreakdown: { id: number; name: string; doc_count: number; total_size: number }[];
  statuses: Record<string, number>;
  fileTypes: { ext: string; count: number }[];
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ReportsPage() {
  const { topUploaders, folderBreakdown, statuses, fileTypes } = usePage<any>().props as PageProps;

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-amber-100 text-amber-600 ring-amber-200';
    if (index === 1) return 'bg-slate-200 text-slate-600 ring-slate-300';
    if (index === 2) return 'bg-orange-100 text-orange-600 ring-orange-200';
    return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
  };

  return (
    <MainLayout>
      <Head title="ภาพรวมรายงาน (Reports)" />
      
      <div className="w-full h-full flex flex-col pt-4 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <BarChart3 className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">ภาพรวมรายงาน</h1>
            </div>
            <p className="text-sm font-medium text-slate-500 ml-16">
              ข้อมูลสถิติเชิงลึกและสรุปการใช้งานระบบจัดการเอกสาร (Analytics & Insights)
            </p>
          </div>
          <button className="group inline-flex items-center rounded-2xl bg-white border border-emerald-100/50 px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm shadow-emerald-900/5 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
            <Download className="size-4 mr-2.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            ส่งออก PDF
          </button>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Object.entries(statuses || {}).map(([status, count]) => {
            const isExpiring = status.toUpperCase().includes('EXPIR');
            const colorClass = isExpiring ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50';
            const icon = isExpiring ? <Archive className="size-5" /> : <FileBadge2 className="size-5" />;
            
            return (
              <div key={status} className="bg-white p-6 rounded-[24px] border border-emerald-100/40 shadow-sm shadow-emerald-900/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className={`absolute -right-4 -top-4 size-24 rounded-full opacity-50 blur-2xl transition-all group-hover:opacity-100 ${colorClass.split(' ')[1]}`} />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">เอกสาร ({status})</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{count as React.ReactNode} <span className="text-sm font-medium text-slate-500 tracking-normal">ไฟล์</span></p>
                  </div>
                  <div className={`p-3 rounded-2xl ${colorClass}`}>
                    {icon}
                  </div>
                </div>
              </div>
            );
          })}
          {Object.keys(statuses || {}).length === 0 && (
            <div className="bg-white p-6 rounded-[24px] border border-emerald-100/40 shadow-sm col-span-full text-center text-slate-400 font-medium">
              ไม่มีข้อมูลสถานะเอกสาร
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Top Uploaders Card */}
          <div className="bg-white rounded-[24px] border border-emerald-100/40 shadow-sm shadow-emerald-900/5 flex flex-col">
            <div className="p-6 border-b border-slate-100/60 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Trophy className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">นักอัปโหลดตัวท็อป (Top Uploaders)</h2>
            </div>
            <div className="flex-1 p-2">
              <ul className="divide-y divide-slate-100/60">
                {(topUploaders || []).map((user, idx) => (
                  <li key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-300 w-5 text-right">{idx + 1}</span>
                      <div className={`flex size-10 items-center justify-center rounded-xl font-bold ring-1 ring-inset ${getRankColor(idx)}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{user.name}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
                      {user.count} ไฟล์
                    </span>
                  </li>
                ))}
                {(topUploaders || []).length === 0 && (
                  <li className="p-10 text-center text-slate-400 text-sm font-medium">ยังไม่มีข้อมูลการอัปโหลด</li>
                )}
              </ul>
            </div>
          </div>

          {/* File Types Card */}
          <div className="bg-white rounded-[24px] border border-emerald-100/40 shadow-sm shadow-emerald-900/5 flex flex-col">
            <div className="p-6 border-b border-slate-100/60 flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <FileText className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">ประเภทไฟล์ฮิต (File Extensions)</h2>
            </div>
            <div className="flex-1 p-2">
              <ul className="divide-y divide-slate-100/60">
                {(fileTypes || []).map((type) => (
                  <li key={type.ext} className="p-4 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center bg-slate-50 text-slate-500 rounded-xl group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                        <FileText className="size-5" />
                      </div>
                      <p className="font-bold text-slate-700 group-hover:text-sky-700 transition-colors">{type.ext}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
                      {type.count} ไฟล์
                    </span>
                  </li>
                ))}
                {(fileTypes || []).length === 0 && (
                  <li className="p-10 text-center text-slate-400 text-sm font-medium">ยังไม่มีข้อมูลประเภทไฟล์</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Folder Breakdown Table */}
        <div className="bg-white rounded-[24px] border border-emerald-100/40 shadow-sm shadow-emerald-900/5 overflow-hidden">
          <div className="p-6 border-b border-slate-100/60 flex items-center gap-3 bg-white">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <FolderOpen className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">สรุปพื้นที่จัดเก็บตามโฟลเดอร์ (Folder Storage)</h2>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">ชื่อโฟลเดอร์</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">จำนวนไฟล์เอกสาร</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">ขนาดพื้นที่รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(folderBreakdown || []).map(folder => (
                  <tr key={folder.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-50 transition-colors">
                          <FolderOpen className="size-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <span className="font-bold text-slate-700">{folder.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      {folder.doc_count} <span className="text-xs font-normal">ไฟล์</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      {formatBytes(folder.total_size)}
                    </td>
                  </tr>
                ))}
                {(folderBreakdown || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-slate-400 font-medium">
                      ยังไม่มีข้อมูลโฟลเดอร์
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
