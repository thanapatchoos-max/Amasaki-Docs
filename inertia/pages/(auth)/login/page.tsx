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
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <FileStack className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">Amagasaki DMS</h1>
              <p className="text-xs text-emerald-300">Document Management System</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">เข้าสู่ระบบ</h2>
          <p className="text-sm text-slate-400 mb-6">ใช้ Username / Password ของ Active Directory</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Username (AD)
              </label>
              <input
                type="text"
                value={form.data.username}
                onChange={(e) => form.setData("username", e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
              {form.errors.username && (
                <p className="text-rose-400 text-xs mt-1">{form.errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.data.password}
                onChange={(e) => form.setData("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
              {form.errors.password && (
                <p className="text-rose-400 text-xs mt-1">{form.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
            >
              <LogIn className="size-4" />
              {form.processing ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          
          {/* Dev Accounts Auto-fill */}
          <div className="mt-8 p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 text-center">
              Dev Accounts (Auto-fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "admin");
                  form.setData("password", "123456");
                }}
                className="py-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-100 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "engineer1");
                  form.setData("password", "password");
                }}
                className="py-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-100 transition-colors"
              >
                Engineer
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setData("username", "designer1");
                  form.setData("password", "password");
                }}
                className="py-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-100 transition-colors"
              >
                Designer
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Amagasaki Pipe (Thailand) Co., Ltd. — Internal Use Only
        </p>
      </div>
    </AuthLayout>
  );
}
