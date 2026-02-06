'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage({ params }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>
      {user && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
          <p className="text-gray-600 mb-4">You are managing: <span className="font-bold text-black">{user.company.name}</span></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-bold text-blue-800">Accounting Module</h3>
              <p className="text-sm text-blue-600 mt-1">Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
