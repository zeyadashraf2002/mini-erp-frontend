'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/api';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) {
            setToken(t);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchInvoices();
        }
    }, [token]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/invoices', token);
            setInvoices(res.data);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    };

    // Memoize the invoice list to prevent unnecessary re-renders when other state changes
    const memoizedInvoices = useMemo(() => invoices, [invoices]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoices</h1>
                <Button onClick={() => setShowCreate(!showCreate)} className="w-full sm:w-auto">
                    {showCreate ? 'View Invoices' : 'Create Invoice'}
                </Button>
            </div>

            {showCreate ? (
                <CreateInvoiceForm token={token} onSuccess={() => {
                    setShowCreate(false);
                    fetchInvoices();
                }} />
            ) : (
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-transparent md:bg-white">
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <TableRow key={i}>
                                                <TableCell><div className="h-4 w-24 bg-slate-200 animate-pulse rounded" /></TableCell>
                                                <TableCell><div className="h-4 w-32 bg-slate-200 animate-pulse rounded" /></TableCell>
                                                <TableCell><div className="h-4 w-20 bg-slate-200 animate-pulse rounded" /></TableCell>
                                                <TableCell className="text-right"><div className="h-4 w-16 bg-slate-200 animate-pulse rounded ml-auto" /></TableCell>
                                                <TableCell className="text-center"><div className="h-4 w-12 bg-slate-200 animate-pulse rounded mx-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : invoices.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-8">No invoices found.</TableCell></TableRow>
                                    ) : (
                                        memoizedInvoices.map(inv => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                                                <TableCell>{inv.customerName}</TableCell>
                                                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">{inv.amount}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                                        ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                                                          inv.status === 'UNPAID' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>
                                                        {inv.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 animate-pulse">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-slate-100 rounded" />
                                                    <div className="h-3 w-32 bg-slate-50 rounded" />
                                                </div>
                                                <div className="h-5 w-12 bg-slate-100 rounded-full" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="h-3 w-16 bg-slate-50 rounded" />
                                                <div className="h-4 w-20 bg-slate-100 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : invoices.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">No invoices found.</div>
                            ) : (
                                memoizedInvoices.map(inv => (
                                    <div key={inv.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                        <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                                            <div>
                                                <div className="font-bold text-slate-900">{inv.invoiceNumber}</div>
                                                <div className="text-sm text-slate-500">{inv.customerName}</div>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                                ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                                                  inv.status === 'UNPAID' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="text-slate-500">{new Date(inv.date).toLocaleDateString()}</div>
                                            <div className="font-mono font-bold text-slate-800">${Number(inv.amount).toFixed(2)}</div>
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

function CreateInvoiceForm({ token, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        // Convert amount to number
        data.amount = Number(data.amount);

        try {
            await api.post('/invoices', data, token);
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Invoice Number" name="invoiceNumber" placeholder="INV-001" required />
                        <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Input label="Customer ID" name="customerId" placeholder="CUST-123" required />
                       <Input label="Customer Name" name="customerName" placeholder="Acme Inc" required />
                    </div>
                    <Input label="Amount" name="amount" type="number" step="0.01" min="0" required />
                    <Input label="Due Date" name="dueDate" type="date" />
                </CardContent>
                <div className="p-6 pt-4 flex justify-end">
                    <Button type="submit" isLoading={loading}>Generate Invoice</Button>
                </div>
            </form>
        </Card>
    );
}
