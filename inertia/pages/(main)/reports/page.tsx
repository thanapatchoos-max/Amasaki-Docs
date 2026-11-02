import { Head, usePage } from '@inertiajs/react';
import { MainLayout } from '@/layouts/default';
import { FileText, Download, Shield, HardDrive, History, CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { DateTime } from 'luxon';

interface PageProps {
  expiryData: any[];
  auditData: any[];
  storageData: any[];
  inactiveData: any[];
}

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateValue: string | Date) {
  if (!dateValue) return '-';
  
  if (dateValue instanceof Date) {
    return DateTime.fromJSDate(dateValue).toFormat('dd MMM yyyy HH:mm');
  }
  
  const strVal = String(dateValue);
  
  const isoDt = DateTime.fromISO(strVal);
  if (isoDt.isValid) return isoDt.toFormat('dd MMM yyyy HH:mm');
  
  const sqlDt = DateTime.fromSQL(strVal);
  if (sqlDt.isValid) return sqlDt.toFormat('dd MMM yyyy HH:mm');
  
  const nativeDate = new Date(strVal);
  if (!isNaN(nativeDate.getTime())) {
     return DateTime.fromJSDate(nativeDate).toFormat('dd MMM yyyy HH:mm');
  }
  
  return strVal;
}

export default function ReportsPage() {
  const { props } = usePage<any>();
  const { expiryData, auditData, storageData, inactiveData } = props as PageProps;
  const reportPerms = props.user?.permissions?.reports || [];
  const canExport = reportPerms.includes('export');

  const [activeTab, setActiveTab] = useState<'expiry' | 'audit' | 'storage' | 'inactive'>('expiry');

  const tabs = [
    { id: 'expiry', label: 'เอกสารหมดอายุ (Expiry)', icon: CalendarClock },
    { id: 'audit', label: 'ประวัติการใช้งาน (Audit Trail)', icon: Shield },
    { id: 'storage', label: 'พื้นที่จัดเก็บ (Storage)', icon: HardDrive },
    { id: 'inactive', label: 'เอกสารไม่มีการใช้งาน (Inactive)', icon: History },
  ];

  const exportToCSV = () => {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    if (activeTab === 'expiry') {
      headers = ['Document ID', 'Name', 'Status', 'Expire At', 'Folder', 'Owner'];
      data = (expiryData || []).map(d => [d.id, d.document_name, d.status, formatDate(d.expire_at), d.folder_name, d.owner_name]);
      filename = 'expiry_report.csv';
    } else if (activeTab === 'audit') {
      headers = ['Audit ID', 'Action', 'Target Type', 'Target ID', 'Details', 'Date', 'User'];
      data = (auditData || []).map(d => [d.id, d.action, d.target_type, d.target_id, d.details, formatDate(d.created_at), d.user_name]);
      filename = 'audit_trail_report.csv';
    } else if (activeTab === 'storage') {
      headers = ['Folder ID', 'Folder Name', 'Document Count', 'Total Size (Bytes)', 'Total Size (Formatted)'];
      data = (storageData || []).map(d => [d.id, d.folder_name, d.doc_count, d.total_size, formatBytes(d.total_size)]);
      filename = 'storage_report.csv';
    } else if (activeTab === 'inactive') {
      headers = ['Document ID', 'Name', 'Folder', 'Owner', 'Size (Bytes)', 'Last Updated'];
      data = (inactiveData || []).map(d => [d.id, d.document_name, d.folder_name, d.owner_name, d.size, formatDate(d.updated_at)]);
      filename = 'inactive_documents_report.csv';
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map((val: any) => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel UTF-8 BOM
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <Head title="Report" />
      
      <div className="w-full h-full flex flex-col pt-4 pb-12 mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <FileText className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Report</h1>
            </div>
            <p className="text-sm font-medium text-slate-500 ml-16">
              รายงานเชิงลึกและข้อมูลสรุปเพื่อการตรวจสอบ (Auditing & Insights)
            </p>
          </div>
          {canExport && (
            <button 
              onClick={exportToCSV}
              className="group inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
            >
              <Download className="size-4 mr-2.5 group-hover:scale-110 transition-transform" />
              Export to CSV
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <tab.icon className={`size-4 ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[24px] border border-emerald-100/40 shadow-sm shadow-emerald-900/5 overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              
              {/* Tab 1: Expiry */}
              {activeTab === 'expiry' && (
                <>
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Document</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Folder</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Owner</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Expire At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {expiryData?.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{doc.document_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.folder_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.owner_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${doc.status === 'expired' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-bold ${doc.status === 'expired' ? 'text-rose-600' : 'text-amber-600'}`}>{formatDate(doc.expire_at)}</td>
                      </tr>
                    ))}
                    {(!expiryData || expiryData.length === 0) && (
                      <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">ไม่มีข้อมูลเอกสารที่กำลังจะหมดอายุ</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {/* Tab 2: Audit */}
              {activeTab === 'audit' && (
                <>
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Target</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 max-w-xs">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {auditData?.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatDate(log.created_at)}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{log.user_name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{log.target_type} #{log.target_id}</td>
                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate" title={log.details}>{log.details}</td>
                      </tr>
                    ))}
                    {(!auditData || auditData.length === 0) && (
                      <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">ไม่มีข้อมูลประวัติการใช้งาน</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {/* Tab 3: Storage */}
              {activeTab === 'storage' && (
                <>
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Folder Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Total Documents</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Total Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {storageData?.map(folder => (
                      <tr key={folder.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{folder.folder_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{folder.doc_count} ไฟล์</td>
                        <td className="px-6 py-4 font-black text-emerald-600">{formatBytes(folder.total_size)}</td>
                      </tr>
                    ))}
                    {(!storageData || storageData.length === 0) && (
                      <tr><td colSpan={3} className="px-6 py-16 text-center text-slate-400 font-medium">ไม่มีข้อมูลโฟลเดอร์</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {/* Tab 4: Inactive */}
              {activeTab === 'inactive' && (
                <>
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Document</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Folder</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Owner</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Size</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inactiveData?.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{doc.document_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.folder_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.owner_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{formatBytes(doc.size)}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{formatDate(doc.updated_at)}</td>
                      </tr>
                    ))}
                    {(!inactiveData || inactiveData.length === 0) && (
                      <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">ไม่มีข้อมูลเอกสาร</td></tr>
                    )}
                  </tbody>
                </>
              )}

            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
