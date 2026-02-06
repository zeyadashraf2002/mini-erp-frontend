'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

export default function JournalEntriesPage() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
    fetchAccounts();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/accounting/journal-entries`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/accounting/accounts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setAccounts(data.data);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Journal Entries</h1>
        <div className="flex space-x-2">
            <Button 
                variant={activeTab === 'list' ? 'primary' : 'outline'} 
                onClick={() => setActiveTab('list')}
            >
                View Entries
            </Button>
            <Button 
                variant={activeTab === 'create' ? 'primary' : 'outline'} 
                onClick={() => setActiveTab('create')}
            >
                New Journal Entry
            </Button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <EntriesList entries={entries} loading={loading} />
      ) : (
        <CreateEntryForm accounts={accounts} onSuccess={() => {
            setActiveTab('list');
            fetchEntries();
        }} />
      )}
    </div>
  );
}

function EntriesList({ entries, loading }) {
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : entries.length === 0 ? (
                             <TableRow><TableCell colSpan={5} className="text-center py-8">No entries found.</TableCell></TableRow>
                        ) : (
                            entries.map(entry => {
                                const total = entry.lines.reduce((sum, line) => sum + Number(line.debit), 0);
                                return (
                                    <TableRow key={entry.id}>
                                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{entry.description}</TableCell>
                                        <TableCell>{entry.reference || '-'}</TableCell>
                                        <TableCell className="text-right font-mono">{total.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function CreateEntryForm({ accounts, onSuccess }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [reference, setReference] = useState('');
    const [lines, setLines] = useState([
        { accountId: '', debit: '', credit: '', description: '' },
        { accountId: '', debit: '', credit: '', description: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLineChange = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        
        // Auto-clear opposite field if user types in dr/cr
        if (field === 'debit' && value) newLines[index]['credit'] = 0;
        if (field === 'credit' && value) newLines[index]['debit'] = 0;

        setLines(newLines);
    };

    const addLine = () => {
        setLines([...lines, { accountId: '', debit: '', credit: '', description: '' }]);
    };

    const removeLine = (index) => {
        if (lines.length > 1) { // Changed to allow leaving 1 line
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const getTotal = (field) => {
        return lines.reduce((sum, line) => sum + Number(line[field] || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const totalDebit = getTotal('debit');
        const totalCredit = getTotal('credit');
        
        // Commenting out strict balancing check as per user request to allow single line/unbalanced
        /*
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            setError(`Entry is not balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}`);
            return;
        }
        */

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/accounting/journal-entries`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date,
                    description,
                    reference,
                    lines: lines.map(line => ({
                        accountId: line.accountId,
                        debit: Number(line.debit || 0),
                        credit: Number(line.credit || 0),
                        description: line.description
                    }))
                })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create entry');
            
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                            label="Date" type="date" value={date} 
                            onChange={e => setDate(e.target.value)} required 
                        />
                        <Input 
                            label="Description" value={description} 
                            onChange={e => setDescription(e.target.value)} required 
                        />
                        <Input 
                            label="Reference" value={reference} 
                            onChange={e => setReference(e.target.value)} 
                        />
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-medium border-b">
                                <tr>
                                    <th className="p-3 w-1/3">Account</th>
                                    <th className="p-3 w-1/4">Description</th>
                                    <th className="p-3 text-right">Debit</th>
                                    <th className="p-3 text-right">Credit</th>
                                    <th className="p-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {lines.map((line, index) => (
                                    <tr key={index}>
                                        <td className="p-2">
                                            <select 
                                                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                                                value={line.accountId}
                                                onChange={e => handleLineChange(index, 'accountId', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Account</option>
                                                {accounts.map(acc => (
                                                    <option key={acc.id} value={acc.id}>
                                                        {acc.code} - {acc.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <Input 
                                                className="h-9" 
                                                value={line.description}
                                                onChange={e => handleLineChange(index, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input 
                                                type="number" step="0.01" className="h-9 text-right"
                                                value={line.debit}
                                                onChange={e => handleLineChange(index, 'debit', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input 
                                                 type="number" step="0.01" className="h-9 text-right"
                                                 value={line.credit}
                                                 onChange={e => handleLineChange(index, 'credit', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            {lines.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => removeLine(index)}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 font-semibold text-slate-700">
                                <tr>
                                    <td colSpan={2} className="p-3 text-right">Total</td>
                                    <td className="p-3 text-right">{getTotal('debit').toFixed(2)}</td>
                                    <td className="p-3 text-right">{getTotal('credit').toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <Button type="button" variant="outline" size="sm" onClick={addLine}>
                        + Add Line
                    </Button>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                    <Button type="submit" isLoading={loading}>
                        Post Journal Entry
                    </Button>
                </div>
            </form>
        </Card>
    );
}
