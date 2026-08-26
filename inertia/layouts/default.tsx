import { type ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import { AppSidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "sonner";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#EBF7EF] overflow-hidden font-sans text-slate-800">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 pb-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 flex items-center justify-center p-4">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EBF7EF] font-sans text-slate-800">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
}
