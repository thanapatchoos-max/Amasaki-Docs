import { usePage, useForm, Link, router } from "@inertiajs/react";
import { MainLayout } from "@/layouts/default";
import { UserPlus, Pencil, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { swalConfirm } from '@/lib/swal';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-[24px] shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/50 w-full max-w-md relative overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100/80">
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">เพิ่มผู้ใช้งานใหม่</h2>
          <p className="text-[13px] font-medium text-slate-500 mt-1.5 leading-relaxed">
            กำหนดรายละเอียดบัญชีและสิทธิ์การเข้าถึงสำหรับผู้ใช้งานใหม่ในระบบ
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={submit} className="flex flex-col">
          <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[60vh]">
            {[
              { label: "ชื่อบัญชีผู้ใช้ (Username)", key: "username", type: "text", required: true, placeholder: "เช่น admin, j.doe" },
              { label: "ชื่อ-นามสกุล", key: "full_name", type: "text", placeholder: "เช่น John Doe" },
              { label: "อีเมล (Email)", key: "email", type: "email", placeholder: "john@example.com" },
              { label: "รหัสผ่าน (Password)", key: "password", type: "password", required: true, placeholder: "อย่างน้อย 6 ตัวอักษร" },
            ].map(({ label, key, type, required, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-slate-700">
                  {label} {required && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type={type}
                  required={required}
                  placeholder={placeholder}
                  value={(form.data as any)[key]}
                  onChange={(e) => form.setData(key as any, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                />
                {(form.errors as any)[key] && (
                  <p className="text-rose-500 text-[12px] font-medium mt-1.5">{(form.errors as any)[key]}</p>
                )}
              </div>
            ))}
            
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-slate-700">
                ตำแหน่งและสิทธิ์ (Role) <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={form.data.role_id}
                onChange={(e) => form.setData("role_id", Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
              >
                <option value="" disabled>-- เลือกตำแหน่ง --</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-60 rounded-xl transition-all shadow-sm shadow-emerald-600/20"
            >
              {form.processing ? "กำลังสร้าง..." : "สร้างผู้ใช้งาน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { props } = usePage<any>();
  const { users = [], roles = [] } = props as { users: User[]; roles: Role[] };
  const user = props.user;
  const userPerms = user?.permissions?.users || [];
  
  const canCreate = userPerms.includes('create');
  const canEdit = userPerms.includes('edit');
  const canDelete = userPerms.includes('delete');

  const [showCreate, setShowCreate] = useState(false);

  function toggleActive(user: User) {
    router.patch(`/admin/users/${user.id}`, { is_active: !user.is_active });
  }

  async function deleteUser(user: User) {
    if (await swalConfirm({ title: `ลบผู้ใช้ "${user.username}" ออกจากระบบ?` })) {
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
        {canCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-emerald-600/30 transition-all"
          >
            <UserPlus className="size-4" />
            เพิ่มผู้ใช้
          </button>
        )}
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
                    {canEdit && (
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
                    )}
                    {canDelete && (
                      <button
                        onClick={() => deleteUser(u)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="ลบผู้ใช้"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
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
