import React, { useState } from 'react';
import { 
  Bell, 
  LogOut, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  ChevronDown,
  FolderOpen,
  Calendar
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { swalToast } from '@/lib/swal';

export function Header() {
  const { props } = usePage<any>();
  const user = props.user;
  const displayName = user?.fullName || user?.username || 'User';
  const roleName = user?.role?.name || 'USER';

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentDateThai = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'ต้องการการอนุมัติเอกสาร',
      message: 'คุณสมชาย ส่งเอกสาร "สัญญาจ้างงาน_2026.pdf" เพื่อรอการอนุมัติ',
      time: '5 นาทีที่แล้ว',
      isRead: false,
      type: 'approval',
      icon: CheckCircle2,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      id: 2,
      title: 'มีการอัปเดตเวอร์ชันเอกสาร',
      message: 'เอกสาร "Financial_Report_Q4.xlsx" ถูกปรับปรุงเป็น v2.0',
      time: '1 ชั่วโมงที่แล้ว',
      isRead: false,
      type: 'update',
      icon: FileText,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 3,
      title: 'การแจ้งเตือนความปลอดภัย',
      message: 'เข้าสู่ระบบจากอุปกรณ์ใหม่เมื่อ 10:15 น.',
      time: '3 ชั่วโมงที่แล้ว',
      isRead: true,
      type: 'alert',
      icon: AlertTriangle,
      color: 'text-blue-500 bg-blue-50',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    swalToast('ทำเป็นอ่านแล้วทั้งหมดเรียบร้อย', 'success');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <header className="h-16 w-full bg-white border-b border-emerald-100/70 px-6 lg:px-8 flex items-center justify-between shrink-0 relative z-30 shadow-2xs">
      
      {/* Left: Date & System Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Item 2: Thai Calendar Date */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
          <Calendar className="size-3.5 text-slate-400" />
          <span className="text-slate-700 font-semibold text-xs">{currentDateThai}</span>
        </div>

        {/* Item 3: Live System Status */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 shadow-2xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20"></span>
          ระบบพร้อมใช้งาน (Online)
        </span>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            className={`relative size-9 flex items-center justify-center rounded-xl border transition-all ${
              isNotifOpen 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10' 
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-emerald-700 border-slate-200/80 shadow-2xs'
            }`}
            title="การแจ้งเตือน"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-2xs ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {isNotifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/10 z-50 overflow-hidden font-sans transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      <Bell className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">การแจ้งเตือน</h3>
                      <p className="text-[11px] font-bold text-slate-500">
                        {unreadCount > 0 ? `ยังไม่ได้อ่าน ${unreadCount} รายการ` : 'อ่านครบทุกรายการแล้ว'}
                      </p>
                    </div>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="size-3" />
                      อ่านทั้งหมด
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell className="size-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const IconComp = n.icon;
                      return (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 transition-colors cursor-pointer hover:bg-slate-50/80 flex gap-3 items-start relative ${
                            !n.isRead ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          <div className={`size-9 rounded-2xl ${n.color} flex items-center justify-center shrink-0 mt-0.5 border border-slate-100 shadow-sm`}>
                            <IconComp className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-xs font-extrabold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                {n.title}
                              </h4>
                              <span className="text-[10px] font-semibold text-slate-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                          {!n.isRead && (
                            <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end text-xs">
                  <Link
                    href="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    ดูทั้งหมด
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200/90 mx-0.5 sm:mx-1"></div>

        {/* User Profile Pill Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl border bg-white shadow-2xs transition-all ${
              isUserMenuOpen 
                ? 'border-emerald-300 ring-2 ring-emerald-500/15 bg-slate-50' 
                : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {/* Gradient Avatar */}
            <div className="relative shrink-0">
              <div className="size-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            {/* User Info */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {displayName}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded-md uppercase tracking-wider leading-none">
                  {roleName}
                </span>
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown className={`size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10 z-50 overflow-hidden font-sans p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header User Summary */}
                <div className="px-3 py-2.5 bg-slate-50/80 rounded-xl mb-1 border border-slate-100/80">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{displayName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md uppercase">
                      {roleName}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">@{user?.username || 'user'}</span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="space-y-0.5">
                  <Link
                    href="/documents"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800 transition-colors"
                  >
                    <FolderOpen className="size-4 text-slate-400" />
                    <span>เอกสารทั้งหมด</span>
                  </Link>

                  <Link
                    href="/notifications"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="size-4 text-slate-400" />
                      <span>การแจ้งเตือน</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="h-px bg-slate-100 my-1 mx-1"></div>

                {/* Logout Action */}
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="size-4 text-rose-500" />
                  <span>ออกจากระบบ</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200/90 mx-0.5 sm:mx-1"></div>

        {/* Quick Logout Button */}
        <Link 
          href="/logout" 
          method="post" 
          as="button" 
          className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 shadow-2xs transition-all"
          title="ออกจากระบบ"
        >
          <LogOut className="size-4" />
        </Link>

      </div>
    </header>
  );
}
