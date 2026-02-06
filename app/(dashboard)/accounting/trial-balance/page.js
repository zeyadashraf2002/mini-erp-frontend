'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

export default function TrialBalancePage() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/accounting/trial-balance`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) setReport(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const totalDebit = report.reduce((sum, row) => sum + Number(row.debit), 0);
    const totalCredit = report.reduce((sum, row) => sum + Number(row.credit), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trial Balance</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>As of {new Date().toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Account Code</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
                            ) : (
                                report.map(row => (
                                    <TableRow key={row.accountId}>
                                        <TableCell className="font-medium">{row.code}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {Number(row.debit) ? Number(row.debit).toFixed(2) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {Number(row.credit) ? Number(row.credit).toFixed(2) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        {!loading && (
                            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                <TableRow>
                                    <TableCell colSpan={2} className="text-right">Total</TableCell>
                                    <TableCell className={`text-right font-mono ${!isBalanced ? 'text-red-600' : ''}`}>
                                        {totalDebit.toFixed(2)}
                                    </TableCell>
                                    <TableCell className={`text-right font-mono ${!isBalanced ? 'text-red-600' : ''}`}>
                                        {totalCredit.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </tfoot>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
