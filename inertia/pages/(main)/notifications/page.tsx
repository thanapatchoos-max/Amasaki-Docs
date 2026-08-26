import { usePage, Link } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { Bell, AlertTriangle, FileText, CheckCheck } from "lucide-react";

type Notification = {
  id: number;
  type: "expiring" | "delete" | "copy" | "general";
  message: string;
  document_id: number | null;
  document_name: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_COLOR: Record<string, string> = {
  expiring: "bg-amber-50 text-amber-700 border-amber-200",
  delete: "bg-rose-50 text-rose-700 border-rose-200",
  copy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  general: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function NotificationsPage() {
  const { notifications = [] } = usePage<any>().props as { notifications: Notification[] };
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">การแจ้งเตือน</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unread > 0 ? `${unread} รายการที่ยังไม่ได้อ่าน` : "อ่านครบแล้ว"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Bell className="size-12 text-slate-200" />
            <p className="text-slate-400 font-medium">ยังไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${
                  !n.is_read ? "bg-emerald-50/30" : ""
                }`}
              >
                <div className="size-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === "expiring" ? (
                    <AlertTriangle className="size-4 text-amber-600" />
                  ) : (
                    <Bell className="size-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{n.message}</p>
                  {n.document_name && (
                    <Link
                      href={`/documents/${n.document_id}`}
                      className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <FileText className="size-3" />
                      {n.document_name}
                    </Link>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleString("th-TH")}
                  </p>
                </div>
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
