'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user = {} }) {
  const pathname = usePathname();
  
  // Mock modules for now - in real app, derive from user.company.modules
  const modules = {
    accounting: true,
    inventory: false,
    hr: false
  };

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    ...(modules.accounting ? [
      { name: 'Accounting', href: '/accounting', subItems: [
        { name: 'Chart of Accounts', href: '/accounting/chart-of-accounts' },
        { name: 'Journal Entries', href: '/accounting/journal-entries' },
        { name: 'Invoices', href: '/invoices' },
        { name: 'Payments', href: '/payments' },
        { name: 'Trial Balance', href: '/accounting/trial-balance' },
      ]}
    ] : []),
    { name: 'Settings', href: '/settings', subItems: [
        { name: 'Modules', href: '/settings/modules' },
        { name: 'Company Info', href: '/settings/company' }
    ]},
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-slate-200 bg-slate-900 text-white md:flex">
      <div className="flex h-16 items-center px-6 font-bold text-lg border-b border-slate-800">
        Mini ERP
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <>
                   {/* Parent Item Header - could be a link or just label */}
                   <div className="px-3 py-2 text-sm font-semibold text-slate-400 mt-2">
                     {item.name}
                   </div>
                   <ul className="space-y-1 mt-1">
                     {item.subItems.map((sub) => (
                       <li key={sub.name}>
                         <Link 
                           href={sub.href}
                           className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                             isActive(sub.href) 
                               ? 'bg-slate-800 text-white' 
                               : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                           }`}
                         >
                           {sub.name}
                         </Link>
                       </li>
                     ))}
                   </ul>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                {user.initials || 'U'}
            </div>
            <div className="text-sm">
                <p className="font-medium">{user.name || 'User'}</p>
                <p className="text-xs text-slate-400">Admin</p>
            </div>
        </div>
      </div>
    </aside>
  );
}
