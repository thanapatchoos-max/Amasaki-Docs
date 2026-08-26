import { Head, Link } from '@inertiajs/react'
import { MainLayout } from '@/layouts/default'
import { ChevronLeft } from 'lucide-react'
import RoleForm from '../RoleForm'

export default function RoleCreate() {
  return (
    <MainLayout>
      <Head title="สร้างตำแหน่งและสิทธิ์" />
      <div className="w-full h-full flex flex-col pt-2 pb-6">
        {/* Header Actions */}
        <div className="flex items-center mb-6 gap-3">
          <Link href="/admin/roles" className="p-2 -ml-2 rounded-full hover:bg-emerald-50/60 text-slate-500 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">สร้างตำแหน่งใหม่ (Create Role)</h1>
        </div>

        <RoleForm />
      </div>
    </MainLayout>
  )
}

