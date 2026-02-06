'use client';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.tenantId;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-700">
          Mini ERP
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href={`/dashboard/${tenantId}`} className="block p-3 hover:bg-slate-700 rounded">
            Dashboard
          </Link>
          <div className="pt-4 pb-2 text-xs text-slate-400 uppercase">Modules</div>
          <Link href={`/dashboard/${tenantId}/accounting`} className="block p-3 hover:bg-slate-700 rounded">
            Accounting
          </Link>
          {/* Future Modules */}
          <div className="block p-3 text-slate-500 cursor-not-allowed">
            HR (Coming Soon)
          </div>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-sm">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
