import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { MainLayout } from "@/layouts/default";
import { AlertCircle, FileText, FolderOpen, ArrowLeft, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpiringDocument {
  id: number;
  name: string;
  extension: string;
  expire_at: string;
  latest_version: number;
  folder_name: string;
  owner: string;
}

const EXT_COLOR: Record<string, string> = {
  pdf: "bg-rose-50 text-rose-700 border-rose-200",
  sldprt: "bg-emerald-50 text-emerald-800 border-emerald-200",
  sldasm: "bg-emerald-50 text-emerald-800 border-emerald-200",
  slddrw: "bg-emerald-50 text-emerald-800 border-emerald-200",
  dwg: "bg-teal-50 text-teal-800 border-teal-200",
};

export default function ExpiringDocumentsPage() {
  const { documents = [] } = usePage<any>().props as { documents: ExpiringDocument[] };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const currentDocuments = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MainLayout>
      <Head title="เอกสารใกล้หมดอายุ" />
      <div className="w-full h-full flex flex-col py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                เอกสารที่กำลังจะหมดอายุ
              </h1>
            </div>
            <p className="text-sm font-medium text-slate-500 ml-12">
              รายการเอกสารทั้งหมดที่จะหมดอายุภายใน 30 วันข้างหน้า
            </p>
          </div>
        </div>

        {/* List */}
        <div className="mt-2">
          {documents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-rose-900/10 shadow-sm shadow-rose-950/5 py-20 flex flex-col items-center justify-center">
              <div className="size-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-sm shadow-emerald-100">
                <FileText className="size-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-emerald-700 mb-1">ยอดเยี่ยมมาก!</h3>
              <p className="text-slate-500 font-medium text-sm">ปัจจุบันไม่มีเอกสารที่กำลังจะหมดอายุภายใน 30 วัน</p>
            </div>
          ) : (
            <div className="w-full">
              {/* Header Row (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-500 uppercase mb-4 shadow-sm">
                <div className="col-span-4 flex items-center gap-2">
                  <FileText className="size-4 text-slate-400" />
                  ชื่อเอกสาร
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  ประเภท & เวอร์ชัน
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <FolderOpen className="size-4 text-slate-400" />
                  โฟลเดอร์
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  สถานะวันหมดอายุ
                  <AlertCircle className="size-4 text-slate-400" />
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                {currentDocuments.map((doc, idx) => {
                  const daysLeft = Math.ceil((new Date(doc.expire_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  const isExpired = daysLeft <= 0;
                  const isCritical = daysLeft < 15 && !isExpired;
                  
                  const dateColor = (isExpired || isCritical) ? 'text-rose-600' : 'text-amber-600';
                  const badgeClasses = (isExpired || isCritical)
                    ? 'bg-rose-100 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200';

                  const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;

                  return (
                    <div 
                      key={doc.id}
                      onClick={() => router.visit(`/documents/${doc.id}`)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:px-6 md:py-4 rounded-2xl border shadow-sm transition-all cursor-pointer group hover:shadow-md bg-white border-slate-200/60 hover:border-emerald-300`}
                    >
                      {/* Name & Owner */}
                      <div className="col-span-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black text-slate-300 w-4">{globalIndex}</span>
                          <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm truncate">
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pl-6.5">
                          <User className="size-3.5 text-slate-400" />
                          <span>{doc.owner}</span>
                        </div>
                      </div>

                      {/* Type & Version */}
                      <div className="col-span-2 flex items-center justify-start md:justify-center gap-3">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase ${
                          EXT_COLOR[doc.extension.toLowerCase()] ?? "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {doc.extension}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-slate-100/80 text-slate-700 border border-slate-200/60 rounded font-bold text-xs">
                          v{doc.latest_version}
                        </span>
                      </div>

                      {/* Folder */}
                      <div className="col-span-3 flex items-center">
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold text-xs">
                          <FolderOpen className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-40">{doc.folder_name}</span>
                        </span>
                      </div>

                      {/* Expiry Status */}
                      <div className="col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1">
                        <span className={`font-black text-sm ${dateColor}`}>
                          {new Date(doc.expire_at).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${badgeClasses}`}>
                          {isExpired ? "หมดอายุแล้ว!" : `เหลืออีก ${daysLeft} วัน`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between px-2">
                  <div className="text-xs font-bold text-slate-500">
                    แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง {Math.min(currentPage * itemsPerPage, documents.length)} จากทั้งหมด {documents.length} รายการ
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`size-8 rounded-xl text-xs font-bold transition-colors ${
                            currentPage === page 
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 border-none' 
                              : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
