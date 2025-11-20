'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Operator created successfully!');
        setForm({ username: '', password: '' });
        fetchUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (e) {
      setMessage('Failed to create user');
    }
  };

  return (
    <div className="container">
      <h1>Operator Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Create Form */}
        <Card>
          <h3>Create New Operator</h3>
          <form onSubmit={handleCreate}>
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
            <Button type="submit">Create Operator</Button>
            {message && <p style={{ marginTop: '1rem', color: message.includes('Error') ? 'red' : 'lightgreen' }}>{message}</p>}
          </form>
        </Card>

        {/* List */}
        <Card>
          <h3>Existing Operators</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
            {users.length === 0 && <li className="text-sm">No operators found.</li>}
            {users.map(user => (
              <li key={user.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <strong>{user.username}</strong> <span className="text-sm">({user.role})</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

