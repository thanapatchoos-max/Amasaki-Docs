import { usePage, Link } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { ArrowLeft, Clock, Download, FileText, History, User, AlertTriangle, Upload, CheckCircle2 } from "lucide-react";

type Version = {
  id: number;
  version_number: number;
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

export default function DocumentDetailPage() {
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

  const isExpired = document.status === "expired";

  return (
    <MainLayout>
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
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
            <p className="text-xs text-slate-400 mt-0.5">ชื่อไฟล์เดิม: {document.original_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/documents/${document.id}/versions`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl transition-colors"
          >
            <History className="size-4" />
            ดูเวอร์ชันทั้งหมด ({document.versions?.length || 0})
          </Link>
          <a
            href={`/documents/${document.id}/download`}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-600/30 transition-all"
          >
            <Download className="size-4" />
            ดาวน์โหลดเวอร์ชันล่าสุด (v{document.latest_version})
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="size-5 text-emerald-600" />
              รายละเอียดเอกสาร
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">เจ้าของเอกสาร</span>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <User className="size-4 text-slate-400" />
                  {document.owner?.full_name || "—"}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">เวอร์ชันปัจจุบัน</span>
                <span className="text-base font-black text-emerald-600">v{document.latest_version}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">วันหมดอายุ</span>
                <span className={`font-bold ${isExpired ? "text-rose-600" : "text-slate-800"}`}>
                  {document.expire_at ? new Date(document.expire_at).toLocaleDateString("th-TH") : "ไม่กำหนด"}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">สถานะเอกสาร</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                  isExpired ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {isExpired ? <AlertTriangle className="size-3" /> : <CheckCircle2 className="size-3" />}
                  {isExpired ? "หมดอายุ" : "ปกติ (Active)"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Version History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <History className="size-5 text-emerald-600" />
                ประวัติเวอร์ชันย้อนหลัง
              </h2>
              <Link href={`/documents/${document.id}/versions`} className="text-xs font-bold text-emerald-600 hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>
            <div className="space-y-3">
              {document.versions?.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                      v{v.version_number}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">อัปโหลดโดย {v.uploaded_by?.full_name || "—"}</p>
                      <p className="text-[11px] text-slate-400">{new Date(v.created_at).toLocaleString("th-TH")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">{formatSize(v.size)}</span>
                    <a
                      href={`/documents/versions/${v.id}/download`}
                      className="p-2 hover:bg-emerald-100 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors"
                      title="ดาวน์โหลดเวอร์ชันนี้"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Upload className="size-4 text-emerald-600" />
              อัปเดตเวอร์ชันใหม่
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              เมื่อมีการแก้ไขไฟล์งาน SolidWorks/AutoCAD หรือ PDF ให้อัปโหลดไฟล์ใหม่ระบบจะนับเป็น เวอร์ชัน v{document.latest_version + 1} อัตโนมัติ โดยไม่ทับไฟล์เดิม
            </p>

            <form action={`/documents/${document.id}/update`} method="POST" encType="multipart/form-data" className="space-y-3">
              <input
                type="file"
                name="file"
                required
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/30"
              >
                <Upload className="size-4" />
                อัปโหลดเป็น v{document.latest_version + 1}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
