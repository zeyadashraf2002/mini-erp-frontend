'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', companyName: '', name: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, formData);
      
      // Store token (simplistic approach for demo)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      router.push(`/dashboard/${res.data.user.company.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-md w-full items-center justify-between font-mono text-sm bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Mini ERP System</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input 
                type="text" placeholder="Company Name" 
                className="p-2 border rounded"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                required
              />
              <input 
                type="text" placeholder="Admin Name" 
                className="p-2 border rounded"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </>
          )}
          
          <input 
            type="email" placeholder="Email" 
            className="p-2 border rounded"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="p-2 border rounded"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register Company')}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 cursor-pointer hover:underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need a company? Register" : "Already have an account? Login"}
        </p>
      </div>
    </main>
  );
}
