import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }) {
  // In a real app, we'd fetch the user from a session or token here to pass to Sidebar
  const user = { name: 'Admin User', initials: 'AD' }; 

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="ml-0 md:ml-64 flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
