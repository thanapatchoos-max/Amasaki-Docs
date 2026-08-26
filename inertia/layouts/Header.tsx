import React from 'react';
import { Calendar, Bell, User, LogOut } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export function Header() {
  const user = usePage<any>().props.user;
  const displayName = user?.fullName || user?.username || 'User';
  const roleName = user?.role?.name || 'USER';

  return (
    <div className="flex items-center justify-end px-6 lg:px-8 pt-4 pb-2 w-full bg-transparent">
      <div className="flex items-center gap-3">
        {/* Actions Box */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-200/50 px-4 py-2.5 h-[52px]">
          <button className="text-slate-500 hover:text-emerald-600 transition-colors relative">
            <Bell className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Profile Box */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-200/50 pl-2 pr-3 py-2 h-[52px] gap-3">
          <div className="w-[36px] h-[36px] rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-center text-blue-600">
            <User className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col justify-center min-w-[70px]">
            <span className="text-[13px] font-extrabold text-slate-800 leading-none mb-1">{displayName}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">{roleName}</span>
          </div>
          <Link 
            href="/logout" 
            method="post" 
            as="button" 
            className="ml-2 text-rose-500 hover:text-rose-600 transition-colors bg-rose-50/50 hover:bg-rose-100 p-1.5 rounded-lg border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
