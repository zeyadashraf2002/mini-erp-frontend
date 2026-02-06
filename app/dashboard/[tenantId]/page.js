'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage({ params }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
            <div className="text-sm text-slate-500">Welcome back, get an overview of your company</div>
         </div>
         <div className="flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">Pro Plan</span>
         </div>
      </div>
      
      {user && (
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name} 👋</h2>
                <p className="opacity-90">You are currently managing <span className="font-bold underline decoration-indigo-400 underline-offset-2">{user.company.name}</span>. Here is what is happening with your business today.</p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Accounting</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Manage chart of accounts, journals, and reports.</p>
              
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Last updated today</span>
              </div>
            </div>

            {/* Placeholder Module */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all opacity-70">
              <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Coming Soon
                  </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">HR Management</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Employee tracking, payroll, and attendance.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
