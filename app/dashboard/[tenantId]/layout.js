'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  
  // Get tenantId from URL params
  const tenantId = params.tenantId;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden print:bg-white print:h-auto print:overflow-visible">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-30 flex items-center justify-between px-4 shadow-md print:hidden">
         <div className="font-bold text-lg">Mini ERP</div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
         </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-slate-900 text-slate-400 flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} print:hidden`}>
        <div className="p-8 flex items-center gap-4 border-b border-slate-800/50 hidden md:flex mb-4">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
             M
           </div>
           <div>
             <span className="text-xl font-black text-white tracking-tight block">Mini ERP</span>
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[2px]">Enterprise</span>
           </div>
        </div>
        
        {/* Mobile Menu Header */}
        <div className="p-6 md:hidden bg-slate-800/30 mb-4 pt-20">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation Menu</div>
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Main Section */}
          <div>
            <div className="px-3 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">
              System Core
            </div>
            <div className="space-y-1">
              <Link 
                href={`/dashboard/${tenantId}`} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive(`/dashboard/${tenantId}`) 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive(`/dashboard/${tenantId}`) ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="font-semibold text-sm">Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Finance Section */}
          <div>
            <div className="px-3 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">
              Finance & Accounting
            </div>
            <div className="space-y-1">
              {[
                { label: 'Journal Entries', tab: 'journals', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                { label: 'Chart of Accounts', tab: 'coa', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { label: 'Trial Balance', tab: 'reports', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8 13h11a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z' }
              ].map(item => {
                // Get current tab from URL query params
                const currentTab = searchParams.get('tab');
                
                // Check if this item should be active
                const isItemActive = pathname.includes('/accounting') && (
                  currentTab === item.tab || 
                  (item.tab === 'journals' && !currentTab) // Default to journals if no tab specified
                );
                
                return (
                <Link 
                  key={item.tab}
                  href={`/dashboard/${tenantId}/accounting?tab=${item.tab}`} 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isItemActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-6 ${isItemActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )})}


              <Link 
                href={`/dashboard/${tenantId}/invoices`} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  pathname.includes('/invoices') 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${pathname.includes('/invoices') ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold text-sm">Invoices</span>
              </Link>

              <Link 
                href={`/dashboard/${tenantId}/payments`} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  pathname.includes('/payments') 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${pathname.includes('/payments') ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-sm">Payments</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/40">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 mt-16 md:mt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
