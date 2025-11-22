'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import PublicNavbar from '@/components/PublicNavbar';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('username', data.username);
        
        if (data.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/operator/sending');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <main className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '2rem' }}>
        <Card className="flex-col gap-md" style={{ width: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h2>
          
          <form onSubmit={handleSubmit}>
            <Input 
              label="Username" 
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              required
            />
            
            <Input 
              label="Password" 
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />

            {error && (
              <p style={{ color: '#e74c3c', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </p>
            )}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
