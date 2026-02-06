'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/api';

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) setToken(t);
    }, []);

    useEffect(() => {
        if (token) {
            fetchPayments();
            fetchInvoices();
        }
    }, [token]);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments', token);
            setPayments(res.data);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    };

    const fetchInvoices = async () => {
        try {
           const res = await api.get('/invoices', token);
           // Strictly filter out PAID status
           setInvoices(res.data.filter(inv => inv.status !== 'PAID'));
        } catch(error) { 
            console.error(error); 
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payments</h1>
                <Button onClick={() => setShowCreate(!showCreate)} className="w-full sm:w-auto">
                    {showCreate ? 'View Payments' : 'Record Payment'}
                </Button>
            </div>

            {showCreate ? (
                <CreatePaymentForm token={token} invoices={invoices} onSuccess={() => {
                    setShowCreate(false);
                    fetchPayments();
                }} />
            ) : (
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-transparent md:bg-white">
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
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
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading...</div>
                            ) : payments.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">No payments recorded.</div>
                            ) : (
                                payments.map(pay => (
                                    <div key={pay.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                        <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{new Date(pay.date).toLocaleDateString()}</div>
                                                <div className="text-xs text-slate-500">
                                                    {pay.invoice ? `Inv: ${pay.invoice.invoiceNumber}` : 'No Invoice'}
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="text-slate-600">{pay.method || 'Unknown Method'}</div>
                                            <div className="font-mono font-bold text-slate-800">${Number(pay.amount).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function CreatePaymentForm({ token, invoices, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.amount = Number(data.amount);

        try {
            await api.post('/payments', data, token);
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                        <Input label="Payment Method" name="method" placeholder="Bank Transfer, Cash..." />
                    </div>
                    
                    <Input label="Amount Received" name="amount" type="number" step="0.01" min="0" required />
                </CardContent>
                <div className="p-6 pt-4 flex justify-end">
                    <Button type="submit" isLoading={loading}>Record Payment</Button>
                </div>
            </form>
        </Card>
    );
}
