import { useForm } from "@inertiajs/react";
import { AuthLayout } from "@/layouts/default";
import { FileStack, LogIn } from "lucide-react";

export default function LoginPage() {
  const form = useForm({
    username: "",
    password: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/login");
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md font-sans">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl border border-emerald-950/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
              <FileStack className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Document Management System</h1>
              <p className="text-xs font-bold text-emerald-700">ระบบจัดการเอกสาร</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">เข้าสู่ระบบ</h2>
          <p className="text-sm font-medium text-slate-500 mb-6">ใช้ Username / Password ของ Active Directory</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">
                Username (AD)
              </label>
              <input
                type="text"
                value={form.data.username}
                onChange={(e) => form.setData("username", e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
              />
              {form.errors.username && (
                <p className="text-rose-600 text-xs font-semibold mt-1.5">{form.errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.data.password}
                onChange={(e) => form.setData("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
              />
              {form.errors.password && (
                <p className="text-rose-600 text-xs font-semibold mt-1.5">{form.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all mt-2 cursor-pointer"
            >
              <LogIn className="size-4" />
              {form.processing ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          
          {/* Dev Accounts Auto-fill */}
          <div className="mt-8 p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
            <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3 text-center">
              Dev Accounts (Auto-fill)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "admin");
                  form.setData("password", "password123");
                }}
                className="py-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 text-xs font-extrabold text-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "manager");
                  form.setData("password", "password123");
                }}
                className="py-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 text-xs font-extrabold text-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "engineer");
                  form.setData("password", "password123");
                }}
                className="py-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 text-xs font-extrabold text-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Engineer
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "test");
                  form.setData("password", "password123");
                }}
                className="py-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 text-xs font-extrabold text-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Test
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-medium text-slate-500 mt-6">
          Internal Use Only
        </p>
      </div>
    </AuthLayout>
  );
}
