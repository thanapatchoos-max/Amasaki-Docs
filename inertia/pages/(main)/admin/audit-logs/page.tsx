import { usePage, Link } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import {
  Users,
  Shield,
  ClipboardList,
  FileText,
  ChevronRight,
  Activity,
} from "lucide-react";

export default function AdminAuditLogsPage() {
  const { logs = [], meta = {} } = usePage<any>().props as {
    logs: Array<{
      id: number;
      user: { full_name: string; username: string };
      action: string;
      target_type: string;
      target_id: number;
      details: any;
      created_at: string;
    }>;
    meta: { total: number; current_page: number; last_page: number };
  };

  const ACTION_COLOR: Record<string, string> = {
    View: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Create: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Edit: "bg-amber-50 text-amber-700 border-amber-200",
    Delete: "bg-rose-50 text-rose-700 border-rose-200",
    Copy: "bg-purple-50 text-purple-700 border-purple-200",
    Move: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audit Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            บันทึกกิจกรรมทั้งหมดในระบบ — {meta.total ?? logs.length} รายการ
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">เวลา</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้ใช้</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">เป้าหมาย</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Activity className="size-12 text-slate-200" />
                      <p className="text-slate-400 font-medium">ยังไม่มีบันทึก</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("th-TH")}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {log.user?.full_name || log.user?.username || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          ACTION_COLOR[log.action] ?? "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {log.target_type} #{log.target_id}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
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
