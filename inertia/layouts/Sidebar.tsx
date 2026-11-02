import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  ClipboardList,
  FileStack,
  Bell,
  LogOut,
  FolderOpen,
  Trash2,
} from "lucide-react";

interface NavItemConfig {
  label: string;
  href: string;
  icon: any;
  module: string;
  action: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, module: "dashboard", action: "view" },
  { label: "โฟลเดอร์", href: "/folders", icon: FolderOpen, module: "folders", action: "view" },
  { label: "เอกสาร", href: "/documents", icon: FileText, module: "documents", action: "view" },
  { label: "ถังขยะ", href: "/trash", icon: Trash2, module: "trash", action: "view" },
  { label: "Report", href: "/reports", icon: ClipboardList, module: "reports", action: "view" },
  { label: "Notifications", href: "/notifications", icon: Bell, module: "", action: "" },
];

const ADMIN_ITEMS: NavItemConfig[] = [
  { label: "จัดการผู้ใช้", href: "/admin/users", icon: Users, module: "users", action: "view" },
  { label: "Role & สิทธิ์", href: "/admin/roles", icon: Shield, module: "roles", action: "view" },
  { label: "Audit Log", href: "/admin/audit-logs", icon: ClipboardList, module: "audit_logs", action: "view" },
];

function hasPermission(
  permissions: Record<string, string[]> | undefined,
  isAdmin: boolean,
  module: string,
  action: string
): boolean {
  if (!module) return true; // No permission required (e.g. notifications)
  if (isAdmin) return true;
  if (!permissions) return false;
  const modulePerms = permissions[module] || [];
  return modulePerms.includes(action);
}

function NavItem({ label, href, icon: Icon }: { label: string; href: string; icon: any }) {
  const { url } = usePage();
  const isActive = href === "/" ? url === "/" || url === "" : url.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
          isActive
            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold"
            : "text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-800"
        }`}
      >
        <Icon className={`size-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"}`} />
        <span>{label}</span>
      </Link>
    </li>
  );
}

export function AppSidebar() {
  const { props } = usePage<any>();
  const user = props.user;
  const isAdmin = user?.isAdmin ?? false;
  const permissions: Record<string, string[]> = user?.permissions ?? {};

  const initials = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";
  const displayName = user?.fullName || user?.username || "ผู้ใช้งาน";
  const roleName = user?.role?.name || "User";

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasPermission(permissions, isAdmin, item.module, item.action)
  );

  const visibleAdminItems = ADMIN_ITEMS.filter((item) =>
    hasPermission(permissions, isAdmin, item.module, item.action)
  );

  return (
    <aside className="flex h-screen w-64 flex-col bg-white border-r border-emerald-100/70 shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-emerald-100/60 shrink-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/30">
          <FileStack className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 tracking-tight">Document Management System</p>
          <p className="text-[10px] font-medium text-emerald-700/80">ระบบจัดการเอกสาร</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <p className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main
          </p>
          <ul className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>

        {visibleAdminItems.length > 0 && (
          <div>
            <p className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Admin
            </p>
            <ul className="space-y-1">
              {visibleAdminItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-emerald-100/60 px-4 py-4 bg-emerald-50/30">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
            <p className="truncate text-[10px] font-medium text-emerald-700">{roleName}</p>
          </div>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
