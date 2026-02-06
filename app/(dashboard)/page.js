import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function DashboardPage() {
  // Mock Data - In real app, fetch from accounting API
  const stats = [
    { title: 'Total Revenue', value: 125000, type: 'success' },
    { title: 'Total Expenses', value: 45000, type: 'danger' },
    { title: 'Cash Balance', value: 80000, type: 'neutral' },
    { title: 'Outstanding Invoices', value: 12000, type: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stat.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Recent transactions will appear here.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
           <CardContent>
            <p className="text-sm text-slate-500">
              Create Invoice, Add Payment, etc.
            </p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
