'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ModulesPage() {
    // Mock state - real app would fetch from backend
    const [modules, setModules] = useState([
        { id: 'accounting', name: 'Accounting', description: 'Core financial management', enabled: true, locked: true },
        { id: 'inventory', name: 'Inventory Management', description: 'Track stock and orders', enabled: false, locked: false },
        { id: 'hr', name: 'Human Resources', description: 'Employee management', enabled: false, locked: false },
        { id: 'crm', name: 'CRM', description: 'Customer relationship management', enabled: false, locked: false },
    ]);

    const toggleModule = (id) => {
        setModules(modules.map(m => {
            if (m.id === id && !m.locked) {
                return { ...m, enabled: !m.enabled };
            }
            return m;
        }));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Module Management</h1>
            <p className="text-slate-500">Enable or disable system modules for your organization.</p>

            <div className="grid gap-6 md:grid-cols-2">
                {modules.map(module => (
                    <Card key={module.id} className={module.enabled ? 'border-slate-400 ring-1 ring-slate-400' : ''}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{module.name}</CardTitle>
                                {module.enabled && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">ACTIVE</span>}
                            </div>
                            <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                variant={module.enabled ? 'outline' : 'primary'}
                                disabled={module.locked}
                                onClick={() => toggleModule(module.id)}
                                className="w-full"
                            >
                                {module.locked ? 'Core Module' : module.enabled ? 'Disable Module' : 'Enable Module'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
