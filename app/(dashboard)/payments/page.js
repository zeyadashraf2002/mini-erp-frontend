'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchPayments();
        fetchInvoices(); // To populate dropdown in create form
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) setPayments(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchInvoices = async () => {
        try {
           const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/invoices`, {
               headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
           });
           const data = await res.json();
           if(data.success) setInvoices(data.data.filter(inv => inv.status !== 'PAID'));
        } catch(error) { console.error(error); }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payments</h1>
                <Button onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? 'View Payments' : 'Record Payment'}
                </Button>
            </div>

            {showCreate ? (
                <CreatePaymentForm invoices={invoices} onSuccess={() => {
                    setShowCreate(false);
                    fetchPayments();
                }} />
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Invoice Linked</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
                                ) : payments.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8">No payments recorded.</TableCell></TableRow>
                                ) : (
                                    payments.map(pay => (
                                        <TableRow key={pay.id}>
                                            <TableCell>{new Date(pay.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{pay.invoice ? pay.invoice.invoiceNumber : '-'}</TableCell>
                                            <TableCell>{pay.method || '-'}</TableCell>
                                            <TableCell className="text-right">{pay.amount}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function CreatePaymentForm({ invoices, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to record payment');
            
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Record Payment</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
                    )}
                    
                    <div className="grid gap-2">
                         <label className="text-sm font-medium text-slate-700">Select Invoice</label>
                         <select name="invoiceId" className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" required>
                             <option value="">-- Select Pending Invoice --</option>
                             {invoices.map(inv => (
                                 <option key={inv.id} value={inv.id}>
                                     {inv.invoiceNumber} - {inv.customerName} (${inv.amount})
                                 </option>
                             ))}
                         </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                        <Input label="Payment Method" name="method" placeholder="Bank Transfer, Cash..." />
                    </div>
                    
                    <Input label="Amount Received" name="amount" type="number" step="0.01" min="0" required />
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                    <Button type="submit" isLoading={loading}>Record Payment</Button>
                </div>
            </form>
        </Card>
    );
}
