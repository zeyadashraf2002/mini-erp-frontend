'use client';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

function AccountingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to journals if no tab specified
  const initialTab = searchParams.get('tab') || 'journals';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [accounts, setAccounts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [trialBalance, setTrialBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync state with URL when URL changes
  useEffect(() => {
      const tab = searchParams.get('tab');
      if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Sync URL when state changes (only if initiated by user click on internal tabs)
  const handleTabChange = (tab) => {
      setActiveTab(tab);
      router.push(`?tab=${tab}`, { scroll: false });
  }

  // Derived State (Search/Filter) - Memoized for performance
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter(acc => 
        acc.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        acc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [accounts, searchTerm]);

  const filteredTrialBalance = useMemo(() => {
    return trialBalance
      .filter(row => 
         row.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
         row.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [trialBalance, searchTerm]);

  // Forms
  const [journalForm, setJournalForm] = useState({  
    description: '', 
    date: new Date().toISOString().split('T')[0], 
    lines: [
      { accountId: '', type: 'DEBIT', amount: 0 },
      { accountId: '', type: 'CREDIT', amount: 0 }
    ] 
  });
  const [accountForm, setAccountForm] = useState({ code: '', name: '', type: 'ASSET' });

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
        fetchAccounts();
        if (activeTab === 'reports') fetchTrialBalance();
    }
  }, [activeTab, token]);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounting/accounts', token);
      setAccounts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTrialBalance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounting/reports/trial-balance', token);
      setTrialBalance(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounting/accounts', accountForm, token);
      setAccountForm({ code: '', name: '', type: 'ASSET' });
      fetchAccounts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddLine = () => {
      setJournalForm(prev => ({ ...prev, lines: [...prev.lines, { accountId: '', type: 'DEBIT', amount: 0 }]}));
  }

  const handleLineChange = (index, field, value) => {
      const newLines = [...journalForm.lines];
      newLines[index][field] = value;
      setJournalForm(prev => ({ ...prev, lines: newLines }));
  }

  const handlePostJournal = async (e) => {
      e.preventDefault();
      // Strict Validation
      if (journalForm.lines.length < 2) {
        toast.error("A Journal Entry must have at least 2 lines.");
        return;
      }
      
      const debitTotal = journalForm.lines
        .filter(l => l.type === 'DEBIT')
        .reduce((s, l) => s + Number(l.amount || 0), 0);
        
      const creditTotal = journalForm.lines
        .filter(l => l.type === 'CREDIT')
        .reduce((s, l) => s + Number(l.amount || 0), 0);

      if (Math.abs(debitTotal - creditTotal) > 0.01) {
          toast.error(`Journal Entry is unbalanced!\nDebit: ${debitTotal.toFixed(2)}\nCredit: ${creditTotal.toFixed(2)}`);
          return;
      }

      // Check for duplicate accounts
      const accountIds = journalForm.lines.map(l => l.accountId).filter(Boolean);
      const uniqueAccountIds = new Set(accountIds);
      if (accountIds.length !== uniqueAccountIds.size) {
        toast.error("Duplicate account found! Each account can only appear once per entry.");
        return;
      }

      try {
          const payload = {
            ...journalForm,
            lines: journalForm.lines.map(line => ({
              accountId: line.accountId,
              // Map to backend structure
              debit: line.type === 'DEBIT' ? Number(line.amount) : 0,
              credit: line.type === 'CREDIT' ? Number(line.amount) : 0,
              description: '' // Optional description
            }))
          };
          await api.post('/accounting/journals', payload, token);
          toast.success('Journal Posted Successfully!');
          setJournalForm({ 
            description: '', 
            date: new Date().toISOString().split('T')[0], 
            lines: [
              { accountId: '', type: 'DEBIT', amount: 0 },
              { accountId: '', type: 'CREDIT', amount: 0 }
            ] 
          });
      } catch (err) {
          console.error(err);
          toast.error('Failed to post journal: ' + err.message);
      }
  }

  const debitTotal = journalForm.lines
    .filter(l => l.type === 'DEBIT')
    .reduce((s, l) => s + Number(l.amount || 0), 0);
  const creditTotal = journalForm.lines
    .filter(l => l.type === 'CREDIT')
    .reduce((s, l) => s + Number(l.amount || 0), 0);
  const isBalanced = Math.abs(debitTotal - creditTotal) <= 0.01;

  return (
    <div className="w-full">
      {/* Header removed as per user request */}
      {/* <div className="flex items-center justify-between mb-8 print:hidden">
         <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Accounting</h1>
         <div className="text-sm text-slate-500">Manage your company financials</div>
      </div> */}
      
      {/* Tabs removed as per user request */}
      {/* <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-xl w-fit print:hidden">
        {['journals', 'coa', 'reports'].map(tab => (
          <button 
            key={tab}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 capitalize flex items-center gap-2 ${
                activeTab === tab 
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'journals' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            {tab === 'coa' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" /></svg>}
            {tab === 'reports' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m-8 13h11a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            {tab === 'coa' ? 'Chart of Accounts' : tab === 'journals' ? 'Journal Entries' : 'Reports'}
          </button>
        ))}
      </div> */}


      <div className="bg-transparent overflow-hidden min-h-[500px] print:shadow-none print:border-0">
        {loading && (
             <div className="p-6 md:p-12">
                 <div className="space-y-4 max-w-4xl mx-auto">
                     <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-8"></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                         <div className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                     </div>
                     <div className="space-y-3">
                         {[1, 2, 3, 4, 5].map(i => (
                             <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl border border-slate-100"></div>
                         ))}
                     </div>
                 </div>
             </div>
        )}
        
        {/* Chart of Accounts Tab */}
        {!loading && activeTab === 'coa' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Chart of Accounts</h2>
            
            {/* Create Account Form */}
            <form onSubmit={handleCreateAccount} className="flex flex-col md:flex-row gap-4 mb-8 p-5 bg-slate-50 rounded-xl border border-slate-100 md:items-end">
              <div className="w-full md:w-32">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Code</label>
                  <input value={accountForm.code} onChange={e => setAccountForm({...accountForm, code: e.target.value})} placeholder="101" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white" required />
              </div>
              <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Account Name</label>
                  <input value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} placeholder="e.g. Cash in Bank" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white" required />
              </div>
              <div className="w-full md:w-48">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
                  <select value={accountForm.type} onChange={e => setAccountForm({...accountForm, type: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-slate-900">
                    {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
              </div>
              <button className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">
                  Add Account
              </button>
            </form>

            {/* Search Bar */}
            <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="🔍 Search Accounts..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full md:w-1/3 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white"
                />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left bg-white min-w-[600px]">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-mono text-slate-600 text-sm">{acc.code}</td>
                        <td className="px-6 py-3 text-slate-800 font-medium">{acc.name}</td>
                        <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${acc.type === 'ASSET' ? 'bg-green-100 text-green-800' : 
                                  acc.type === 'LIABILITY' ? 'bg-red-100 text-red-800' :
                                  acc.type === 'EQUITY' ? 'bg-blue-100 text-blue-800' :
                                  acc.type === 'REVENUE' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                {acc.type}
                            </span>
                        </td>
                    </tr>
                    ))}
                    {filteredAccounts.length === 0 && (
                        <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic">No accounts found.</td></tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {filteredAccounts.map(acc => (
                    <div key={acc.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mr-2">{acc.code}</span>
                                <span className="font-bold text-slate-800">{acc.name}</span>
                            </div>
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${acc.type === 'ASSET' ? 'bg-green-100 text-green-800' : 
                                  acc.type === 'LIABILITY' ? 'bg-red-100 text-red-800' :
                                  acc.type === 'EQUITY' ? 'bg-blue-100 text-blue-800' :
                                  acc.type === 'REVENUE' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                {acc.type}
                            </span>
                        </div>
                    </div>
                ))}
                {filteredAccounts.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        No accounts found.
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Journal Entries Tab */}
        {!loading && activeTab === 'journals' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">New General Journal</h2>
             <form onSubmit={handlePostJournal} className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input type="date" value={journalForm.date} onChange={e => setJournalForm({...journalForm, date: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input type="text" value={journalForm.description} onChange={e => setJournalForm({...journalForm, description: e.target.value})} placeholder="e.g. Opening Balance" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400 bg-white" required />
                    </div>
                </div>
                
                <div className="mb-8 p-4 md:p-6 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="font-bold text-slate-700 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>Transaction Lines</span>
                            <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{journalForm.lines.length} items</span>
                        </div>
                    </h3>
                    
                    <div className="space-y-6">
                        {journalForm.lines.map((line, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row gap-4 items-start bg-white p-4 md:p-0 rounded-xl border md:border-0 border-slate-200 shadow-sm md:shadow-none transition-all hover:border-slate-300">
                                {/* Desktop/Mobile Unified Row with Labels */}
                                <div className="flex-1 w-full space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Account</label>
                                    <select 
                                        value={line.accountId} 
                                        onChange={e => handleLineChange(idx, 'accountId', e.target.value)} 
                                        className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 outline-none text-slate-900 text-sm transition-all" 
                                        required
                                    >
                                        <option value="">Select Account...</option>
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.code} - {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <div className="flex-1 md:w-32 space-y-1">
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Type</label>
                                         <select
                                            value={line.type}
                                            onChange={e => handleLineChange(idx, 'type', e.target.value)}
                                            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 outline-none text-slate-900 text-sm font-medium transition-all"
                                         >
                                            <option value="DEBIT">Debit</option>
                                            <option value="CREDIT">Credit</option>
                                         </select>
                                    </div>
                                    <div className="flex-1 md:w-44 space-y-1 relative">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                            <input 
                                                type="number" 
                                                placeholder="0.00" 
                                                value={line.amount === 0 ? '' : line.amount} 
                                                onFocus={(e) => e.target.select()}
                                                onChange={e => handleLineChange(idx, 'amount', e.target.value)} 
                                                className="w-full pl-8 p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 outline-none text-right font-mono text-sm text-slate-900 placeholder:text-slate-300 transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const ks = [...journalForm.lines];
                                        ks.splice(idx, 1);
                                        setJournalForm({...journalForm, lines: ks});
                                    }} 
                                    className="absolute -top-2 -right-2 md:static md:mt-8 p-1.5 bg-red-50 md:bg-transparent text-red-400 hover:text-red-600 hover:bg-red-100 md:hover:bg-slate-100 rounded-full transition-all border border-red-100 md:border-0"
                                    title="Remove line"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={handleAddLine} className="mt-8 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl flex items-center gap-2 transition-all w-full md:w-auto justify-center border border-indigo-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Line Item
                    </button>
                </div>

                <div className="flex flex-col items-end border-t border-slate-100 pt-6">
                     <div className="w-80 space-y-2 mb-6 text-sm">
                        <div className="flex justify-between items-center text-slate-600">
                             <span>Total Debit:</span>
                             <span className="font-mono font-medium text-slate-900">{debitTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                             <span>Total Credit:</span>
                             <span className="font-mono font-medium text-slate-900">{creditTotal.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between items-center pt-2 border-t border-slate-200 font-bold ${isBalanced ? 'text-green-600' : 'text-red-500'}`}>
                             <span>Difference:</span>
                             <span className="font-mono">{(debitTotal - creditTotal).toFixed(2)}</span>
                        </div>
                        {!isBalanced && (
                          <div className="text-red-500 text-xs text-right mt-1 bg-red-50 px-2 py-1 rounded">
                             ⚠️ Debit must equal Credit
                          </div>
                        )}
                     </div>

                    <button 
                         type="submit" 
                         disabled={!isBalanced || journalForm.lines.length < 2 || loading}
                         className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                    >
                         {loading ? 'Posting...' : 'Post Journal Entry'}
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
             </form>
          </div>
        )}

        {/* Trial Balance Tab */}
        {!loading && activeTab === 'reports' && (
             <div className="p-6">
                 <div className="flex justify-between items-center mb-6 print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">Trial Balance</h2>
                    <div className="flex gap-4">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="p-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                        <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700" onClick={() => window.print()}>Print Report</button>
                    </div>
                 </div>
                 
                 <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-lg print:border-0 print:overflow-visible">
                    <table className="w-full text-left min-w-[600px] print:min-w-0">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-black">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 print:text-black uppercase tracking-wider">Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 print:text-black uppercase tracking-wider">Account Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 print:text-black uppercase tracking-wider text-right">Debit</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 print:text-black uppercase tracking-wider text-right">Credit</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 print:text-black uppercase tracking-wider text-right">Net Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white print:divide-slate-300">
                        {filteredTrialBalance.map(row => (
                        <tr key={row.accountId} className="hover:bg-slate-50 print:hover:bg-white transition-colors">
                            <td className="px-6 py-3 font-mono text-slate-600 print:text-black text-sm">
                                {row.code}
                            </td>
                            <td className="px-6 py-3 text-slate-800 print:text-black font-medium">
                                {row.name}
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-slate-600 print:text-black">{Number(row.debit).toFixed(2)}</td>
                            <td className="px-6 py-3 text-right font-mono text-slate-600 print:text-black">{Number(row.credit).toFixed(2)}</td>
                            <td className={`px-6 py-3 text-right font-mono font-bold ${Number(row.net) < 0 ? 'text-red-500' : 'text-slate-800 print:text-black'}`}>
                                {Number(row.net).toFixed(2)}
                            </td>
                        </tr>
                        ))}
                        <tr className="bg-slate-50 print:bg-white font-bold text-slate-800 print:text-black border-t-2 border-slate-200 print:border-black">
                            <td className="px-6 py-4" colSpan="2">TOTAL</td>
                            <td className="px-6 py-4 text-right font-mono">{filteredTrialBalance.reduce((s, r) => s + Number(r.debit), 0).toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-mono">{filteredTrialBalance.reduce((s, r) => s + Number(r.credit), 0).toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-mono">0.00</td>
                        </tr>
                    </tbody>
                    </table>
                 </div>

                 {/* Mobile Cards for Trial Balance */}
                 <div className="md:hidden space-y-4 print:hidden">
                    {filteredTrialBalance.map(row => (
                        <div key={row.accountId} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-50">
                                <div>
                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mr-2">{row.code}</span>
                                    <span className="font-bold text-slate-800">{row.name}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Debit</div>
                                    <div className="font-mono text-slate-700">{Number(row.debit).toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Credit</div>
                                    <div className="font-mono text-slate-700">{Number(row.credit).toFixed(2)}</div>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                                    <div className="text-xs text-slate-500 uppercase font-bold">Net Balance</div>
                                    <div className={`font-mono font-bold ${Number(row.net) < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                                        {Number(row.net).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
        )}

      </div>
    </div>
  );
}

export default function AccountingPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-slate-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        Loading accounting module...
      </div>
    }>
      <AccountingContent />
    </Suspense>
  );
}
