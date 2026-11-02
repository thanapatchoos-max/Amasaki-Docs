import { usePage, useForm, Link } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import {
  ArrowLeft,
  Upload,
  FileText,
  Folder,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  Info,
  X,
} from "lucide-react";

type FolderItem = { id: number; name: string };

const SUPPORTED_TYPES = [
  { ext: "PDF", name: "PDF Document", color: "bg-rose-50 text-rose-700 border-rose-200/80" },
  { ext: "DWG", name: "AutoCAD Drawing", color: "bg-sky-50 text-sky-700 border-sky-200/80" },
  { ext: "SLDPRT", name: "SolidWorks Part", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  { ext: "SLDASM", name: "SolidWorks Assembly", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  { ext: "SLDDRW", name: "SolidWorks Drawing", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
];

export default function DocumentUploadPage() {
  const { folders = [], initialFolderId = null } = usePage<any>().props as { folders: FolderItem[], initialFolderId: number | null };

  const form = useForm({
    name: "",
    folder_id: initialFolderId ? initialFolderId.toString() : "",
    expire_at: "",
    file: null as File | null,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/documents", {
      forceFormData: true,
    });
  }

  function handleFileSelect(selectedFile: File | null) {
    form.setData("file", selectedFile);
    if (selectedFile && !form.data.name) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
      form.setData("name", baseName);
    }
  }

  return (
    <MainLayout>
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
            className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shrink-0 shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">อัปโหลดเอกสารใหม่</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Document Management System
            </p>
          </div>
        </div>

        {/* Supported extension badges - Grouped into 3 Main Categories */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Category 1: PDF */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/80 border border-red-200">
            <span className="text-[10px] font-bold text-red-400 uppercase">1. PDF:</span>
            <span className="text-xs font-black text-red-600">.PDF</span>
          </div>

          {/* Category 2: AutoCAD */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">2. AutoCAD:</span>
            <span className="text-xs font-black text-emerald-600">.DWG</span>
          </div>

          {/* Category 3: SolidWorks */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200">
            <span className="text-[10px] font-bold text-purple-400 uppercase">3. SolidWorks:</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-purple-700">.SLDPRT</span>
              <span className="text-[10px] text-purple-300">•</span>
              <span className="text-xs font-black text-purple-700">.SLDASM</span>
              <span className="text-[10px] text-purple-300">•</span>
              <span className="text-xs font-black text-purple-700">.SLDDRW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Width Form Grid */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Drag & Drop Zone */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                ไฟล์เอกสาร / Engineering File <span className="text-rose-500">*</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  form.data.file
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/10"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  required
                  accept=".pdf,.dwg,.sldprt,.sldasm,.slddrw"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {form.data.file ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="size-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <p className="text-base font-bold text-slate-900 max-w-md truncate">
                      {form.data.file.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      ขนาดไฟล์: {(form.data.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <div className="mt-4 flex gap-2">
                      <label
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all"
                      >
                        เปลี่ยนไฟล์
                      </label>
                      <button
                        type="button"
                        onClick={() => form.setData("file", null)}
                        className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-all"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="cursor-pointer block py-6">
                    <div className="size-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Upload className="size-8" />
                    </div>
                    <p className="text-base font-bold text-slate-800">
                      คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      1. PDF (.pdf) &nbsp;•&nbsp; 2. AutoCAD (.dwg) &nbsp;•&nbsp; 3. SolidWorks (.sldprt, .sldasm, .slddrw)
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20">
                      เลือกไฟล์จากคอมพิวเตอร์
                    </div>
                  </label>
                )}
              </div>

              {form.errors.file && (
                <p className="text-rose-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  {form.errors.file}
                </p>
              )}
            </div>

            {/* Supported Files Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-3">
              <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                <Info className="size-4 text-emerald-600" />
                คำแนะนำประเภทไฟล์และขนาดข้อมูล
              </h4>
              <ul className="space-y-1.5 text-slate-600 pl-6 list-disc">
                <li>ขนาดไฟล์มาตรฐานประมาณ 5–10 MB (รองรับสูงสุด 20 MB ต่อไฟล์)</li>
                <li>ชื่อเอกสารควรมีความยาวระหว่าง 20–50 ตัวอักษร เพื่อความสะดวกในการค้นหา</li>
                <li>ทุกครั้งที่มีการอัปเดตไฟล์เดิม ระบบจะสร้างเป็นเวอร์ชันใหม่ (v2, v3...) โดยอัตโนมัติ</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Metadata Form & Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
                ข้อมูลเอกสาร (Metadata)
              </h2>

              {/* Document Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ชื่อเอกสาร <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="size-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={50}
                    placeholder="ระบุชื่อเอกสาร (20-50 ตัวอักษร)"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                {form.errors.name && (
                  <p className="text-rose-500 text-xs mt-1">{form.errors.name}</p>
                )}
              </div>

              {/* Folder Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  โฟลเดอร์จัดเก็บ
                </label>
                <div className="relative">
                  <Folder className="size-5 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={form.data.folder_id}
                    onChange={(e) => form.setData("folder_id", e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  >
                    <option value="">— เลือกโฟลเดอร์ ( Root Folder ) —</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  วันหมดอายุเอกสาร (File Expiry Date)
                </label>
                <div className="relative">
                  <Calendar className="size-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    value={form.data.expire_at}
                    onChange={(e) => form.setData("expire_at", e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Policy note */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  ระบบจะแจ้งเตือนก่อนครบกำหนดอายุไฟล์ โดยระบบจะไม่ลบไฟล์ให้อัตโนมัติ ( Admin เป็นผู้จัดการเท่านั้น )
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/documents"
                  className="flex-1 py-3 text-center text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  ยกเลิก
                </Link>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="flex-1 py-3 text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Upload className="size-4" />
                  {form.processing ? "กำลังอัปโหลด..." : "อัปโหลดเอกสาร"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
}
