import { usePage, useForm, Link, router } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { UserPlus, Pencil, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";

type User = {
  id: number;
  username: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  role: { id: number; name: string } | null;
  created_at: string;
};

type Role = { id: number; name: string };

function CreateUserModal({ roles, onClose }: { roles: Role[]; onClose: () => void }) {
  const form = useForm({
    username: "",
    full_name: "",
    email: "",
    password: "",
    role_id: roles[0]?.id ?? "",
    is_active: true,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/admin/users", { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-black text-slate-900 mb-5">เพิ่มผู้ใช้งานใหม่</h2>
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "Username", key: "username", type: "text", required: true },
            { label: "ชื่อ-นามสกุล", key: "full_name", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Password", key: "password", type: "password", required: true },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
              <input
                type={type}
                required={required}
                value={(form.data as any)[key]}
                onChange={(e) => form.setData(key as any, e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              {(form.errors as any)[key] && <p className="text-rose-500 text-xs mt-1">{(form.errors as any)[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
            <select
              value={form.data.role_id}
              onChange={(e) => form.setData("role_id", Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-colors"
            >
              {form.processing ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { users = [], roles = [] } = usePage<any>().props as { users: User[]; roles: Role[] };
  const [showCreate, setShowCreate] = useState(false);

  function toggleActive(user: User) {
    router.patch(`/admin/users/${user.id}`, { is_active: !user.is_active });
  }

  function deleteUser(user: User) {
    if (confirm(`ลบผู้ใช้ "${user.username}" ออกจากระบบ?`)) {
      router.delete(`/admin/users/${user.id}`);
    }
  }

  return (
    <MainLayout>
      {showCreate && <CreateUserModal roles={roles} onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-slate-500 mt-1">{users.length} ผู้ใช้งาน</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-600/30 transition-all"
        >
          <UserPlus className="size-4" />
          เพิ่มผู้ใช้
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้ใช้</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">ยังไม่มีผู้ใช้งาน</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-black">
                      {(u.full_name || u.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{u.full_name || u.username}</p>
                      <p className="text-xs text-slate-400">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{u.email || "—"}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    u.role?.name === "Admin"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}>
                    {u.role?.name ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    u.is_active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    {u.is_active ? "ใช้งาน" : "ระงับ"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`p-2 rounded-lg transition-colors ${
                        u.is_active
                          ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      title={u.is_active ? "ระงับผู้ใช้" : "เปิดใช้งาน"}
                    >
                      {u.is_active ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="ลบผู้ใช้"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
