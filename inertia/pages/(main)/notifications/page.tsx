import { usePage, Link, router } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { Bell, AlertTriangle, FileText, CheckCheck, CheckCircle2, Info } from "lucide-react";
import { useState } from "react";
import { swalToast } from "@/lib/swal";

type Notification = {
  id: number;
  title?: string;
  type: string;
  message: string;
  document_id?: number | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  alert: <AlertTriangle className="size-4 text-amber-600" />,
  warning: <AlertTriangle className="size-4 text-amber-600" />,
  error: <AlertTriangle className="size-4 text-rose-600" />,
  info: <Info className="size-4 text-sky-500" />,
  success: <CheckCircle2 className="size-4 text-emerald-500" />,
};

const TYPE_BG: Record<string, string> = {
  alert: "bg-amber-50",
  warning: "bg-amber-50",
  error: "bg-rose-50",
  info: "bg-sky-50",
  success: "bg-emerald-50",
};

export default function NotificationsPage() {
  const { notifications: propNotifications = [] } = usePage<any>().props as { notifications: Notification[] };

  const [list, setList] = useState<Notification[]>(propNotifications);

  const unread = list.filter((n) => !n.is_read).length;

  const markAllRead = () => {
    setList((prev) => prev.map((n) => ({ ...n, is_read: true })));
    swalToast("ทำเป็นอ่านแล้วทั้งหมดเรียบร้อย", "success");
  };

  const markRead = (id: number) => {
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
            <Bell className="size-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">การแจ้งเตือนทั้งหมด</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {unread > 0 ? `มี ${unread} รายการยังไม่ได้อ่าน` : "อ่านครบถ้วนทุกรายการแล้ว"}
            </p>
          </div>
        </div>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all shrink-0"
          >
            <CheckCheck className="size-4 text-emerald-600" />
            อ่านทั้งหมด
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Bell className="size-12 text-slate-200" />
            <p className="text-slate-400 font-medium">ยังไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((n) => (
              <li
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                  !n.is_read ? "bg-emerald-50/30" : ""
                }`}
              >
                {/* Icon */}
                <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${TYPE_BG[n.type] ?? "bg-slate-100"}`}>
                  {TYPE_ICON[n.type] ?? <Bell className="size-4 text-slate-500" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {n.title && (
                    <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  )}
                  <p className="text-sm font-medium text-slate-600 mt-0.5">{n.message}</p>

                  {/* Clickable document link */}
                  {n.document_id && (
                    <Link
                      href={`/documents/${n.document_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <FileText className="size-3" />
                      ดูเอกสาร
                    </Link>
                  )}

                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleString("th-TH")}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  );
}
