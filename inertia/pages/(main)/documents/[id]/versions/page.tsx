import { usePage, Link } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { ArrowLeft, Clock, Download, FileText, CheckCircle2, History, User } from "lucide-react";

type Version = {
  id: number;
  version_number: number;
  filepath: string;
  size: number;
  created_at: string;
  uploaded_by: { full_name: string } | null;
};

type DocumentData = {
  id: number;
  name: string;
  original_name: string;
  extension: string;
  owner: { full_name: string };
  latest_version: number;
  expire_at: string | null;
  status: string;
  versions: Version[];
};

export default function DocumentVersionsPage() {
  const { document } = usePage<any>().props as { document: DocumentData };

  if (!document) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-slate-400">ไม่พบข้อมูลเอกสาร</p>
          <Link href="/documents" className="mt-4 inline-block text-sm text-emerald-600 font-bold hover:underline">
            ← กลับไปหน้าเอกสาร
          </Link>
        </div>
      </MainLayout>
    );
  }

  function formatSize(bytes: number) {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  return (
    <MainLayout>
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/documents/${document.id}`}
          className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">{document.name}</h1>
            <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
              .{document.extension}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            <History className="size-4 text-slate-400" />
            ประวัติเวอร์ชันทั้งหมด ({document.versions?.length || 0} เวอร์ชัน)
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">รายการเวอร์ชัน</h2>
          <span className="text-xs text-slate-400">เวอร์ชันล่าสุด: v{document.latest_version}</span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">เวอร์ชัน</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้อัปโหลด</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ขนาดไฟล์</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">วันที่อัปโหลด</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ดาวน์โหลด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {document.versions.map((v) => {
              const isLatest = v.version_number === document.latest_version;
              return (
                <tr key={v.id} className={`hover:bg-slate-50/60 transition-colors ${isLatest ? "bg-emerald-50/20" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        isLatest ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        v{v.version_number}
                      </span>
                      {isLatest && <span className="text-xs font-bold text-emerald-600">(ล่าสุด)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-slate-400" />
                      {v.uploaded_by?.full_name || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-500">
                    {formatSize(v.size)}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {new Date(v.created_at).toLocaleString("th-TH")}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      isLatest
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {isLatest ? <CheckCircle2 className="size-3" /> : null}
                      {isLatest ? "เวอร์ชันใช้งาน" : "ประวัติเก่า"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/documents/versions/${v.id}/download`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-xs font-bold rounded-lg transition-colors"
                    >
                      <Download className="size-3.5" />
                      โหลด v{v.version_number}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
