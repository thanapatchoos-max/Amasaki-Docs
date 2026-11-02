import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { MainLayout } from "@/layouts/default";
import { Shield, Plus, Users, Trash2, X, Search, CheckCircle2, Edit2 } from 'lucide-react';

interface RoleItem {
  id: number;
  name: string;
  user_count: number;
  created_at?: string;
}

export default function AdminRolesPage() {
  const { props } = usePage<any>();
  const { roles = [] } = props as { roles: RoleItem[] };
  const user = props.user;
  const rolePerms = user?.permissions?.roles || [];
  
  const canCreate = rolePerms.includes('create');
  const canEdit = rolePerms.includes('edit');
  const canDelete = rolePerms.includes('delete');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    setIsSubmitting(true);
    router.post('/admin/roles', { name: roleName.trim() }, {
      onSuccess: () => {
        setIsAddOpen(false);
        setRoleName('');
        setIsSubmitting(false);
      },
      onError: () => setIsSubmitting(false)
    });
  };

  const handleDeleteRole = (role: RoleItem) => {
    if (role.user_count > 0) {
      alert(`ไม่สามารถลบตำแหน่งนี้ได้ เนื่องจากมีผู้ใช้งานสังกัดอยู่ ${role.user_count} คน`);
      return;
    }

    if (confirm(`แน่ใจหรือไม่ที่จะลบตำแหน่ง "${role.name}"?`)) {
      router.delete(`/admin/roles/${role.id}`);
    }
  };

  return (
    <MainLayout>
      <Head title="จัดการ Role & สิทธิ์" />
      <div className="w-full h-full flex flex-col py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Shield className="h-6 w-6 text-emerald-600" />
              จัดการ Role & ตำแหน่ง
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              กำหนดตำแหน่งหน้าที่ของผู้ใช้งานและสิทธิ์การเข้าถึงในระบบ
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {canCreate && (
              <Link
                href="/admin/roles/create"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มตำแหน่งใหม่
              </Link>
            )}
          </div>
        </div>

        {/* Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ตำแหน่งทั้งหมด</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{roles.length} <span className="text-xs font-normal text-slate-500">ตำแหน่ง</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ผู้ใช้งานรวมทุกตำแหน่ง</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {roles.reduce((acc, r) => acc + r.user_count, 0)} <span className="text-xs font-normal text-slate-500">คน</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">สถานะระบบ</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">พร้อมใช้งานปกติ</p>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อตำแหน่ง..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อตำแหน่ง (Role)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">จำนวนผู้ใช้งาน</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      ไม่พบตำแหน่งที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role, idx) => (
                    <tr key={role.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{role.name}</p>
                            <p className="text-xs text-slate-400">ID: {role.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          {role.user_count} คน
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          กำหนดเอง (Custom)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit && (
                            <Link
                              href={`/admin/roles/${role.id}/edit`}
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="แก้ไขตำแหน่ง"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(role)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="ลบตำแหน่ง"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
