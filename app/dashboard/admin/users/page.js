'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    role: 'OPERATOR',
    country: '',
    branch: '',
    email: '',
    address: '',
    contact: ''
  });
  const [message, setMessage] = useState('');
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: null, username: '', isSuperAdmin: false });
  
  useEffect(() => {
    // Get current user info from localStorage
    const userId = localStorage.getItem('userId') || '0';
    const username = localStorage.getItem('username') || '';
    const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true' || username === 'ubaidtra';
    setCurrentUser({ id: userId, username, isSuperAdmin });
    
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
        setMessage(`${form.role} created successfully!`);
        setForm({ 
          username: '', 
          password: '', 
          role: 'OPERATOR',
          country: '',
          branch: '',
          email: '',
          address: '',
          contact: ''
        });
        fetchUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (e) {
      setMessage('Failed to create user');
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete "${username}"?`)) {
      return;
    }

    setMessage('');
    try {
      // Pass current user info to verify super admin permissions
      const url = `/api/admin/users?id=${userId}&currentUserId=${currentUser.id}&currentUsername=${encodeURIComponent(currentUser.username)}`;
      const res = await fetch(url, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('User deleted successfully!');
        fetchUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (e) {
      setMessage('Failed to delete user');
    }
  };

  const handleActivateDeactivate = async (userId, username, isActive) => {
    const action = isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} "${username}"?`)) {
      return;
    }

    setMessage('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          action,
          currentUserId: currentUser.id,
          currentUsername: currentUser.username
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`User ${action}d successfully!`);
        fetchUsers();
      } else {
        // Show detailed error message
        const errorMsg = data.error || `Failed to ${action} user`;
        const details = data.details ? ` (${JSON.stringify(data.details)})` : '';
        setMessage(`Error: ${errorMsg}${details}`);
        console.error('Update user error:', data);
      }
    } catch (e) {
      console.error('Network error:', e);
      setMessage(`Failed to ${action} user: ${e.message}`);
    }
  };

  const handleResetPassword = async (userId, username) => {
    if (!newPassword || newPassword.length < 3) {
      setMessage('Error: Password must be at least 3 characters');
      return;
    }

    setMessage('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          action: 'resetPassword', 
          newPassword,
          currentUserId: currentUser.id,
          currentUsername: currentUser.username
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Password reset successfully for ${username}!`);
        setResetPasswordUser(null);
        setNewPassword('');
        fetchUsers();
      } else {
        // Show detailed error message
        const errorMsg = data.error || 'Failed to reset password';
        const details = data.details ? ` (${JSON.stringify(data.details)})` : '';
        setMessage(`Error: ${errorMsg}${details}`);
        console.error('Reset password error:', data);
      }
    } catch (e) {
      console.error('Network error:', e);
      setMessage(`Failed to reset password: ${e.message}`);
    }
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      <div className="responsive-grid" style={{ marginBottom: '32px' }}>
        {/* Create Form */}
        <Card>
          <h3>Create New User</h3>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Role</label>
              <select
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              >
                <option value="OPERATOR">Operator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            {/* Operator Profile Fields */}
            {form.role === 'OPERATOR' && (
              <>
                <Input 
                  label="Country" 
                  value={form.country} 
                  onChange={e => setForm({...form, country: e.target.value})} 
                />
                <Input 
                  label="Branch" 
                  value={form.branch} 
                  onChange={e => setForm({...form, branch: e.target.value})} 
                />
                <Input 
                  label="Email" 
                  type="email"
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                />
                <Input 
                  label="Address" 
                  value={form.address} 
                  onChange={e => setForm({...form, address: e.target.value})} 
                />
                <Input 
                  label="Contact" 
                  value={form.contact} 
                  onChange={e => setForm({...form, contact: e.target.value})} 
                />
              </>
            )}
            
            <Button type="submit">Create User</Button>
            {message && <p style={{ marginTop: '1rem', color: message.includes('Error') ? 'red' : 'lightgreen' }}>{message}</p>}
          </form>
        </Card>

        {/* Reset Password Modal */}
        {resetPasswordUser && (
          <Card>
            <h3 style={{ color: '#ffffff' }}>Reset Password</h3>
            <p style={{ color: '#ffffff' }}>Reset password for: <strong style={{ color: '#ffffff' }}>{resetPasswordUser.username}</strong></p>
            <Input 
              label="New Password" 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <Button onClick={() => handleResetPassword(resetPasswordUser.id, resetPasswordUser.username)}>
                Reset Password
              </Button>
              <button
                onClick={() => {
                  setResetPasswordUser(null);
                  setNewPassword('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Users List */}
      <Card>
        <h3>All Users</h3>
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Role</th>
                  {users.some(u => u.role === 'OPERATOR' && (u.country || u.branch || u.email)) && (
                    <>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Country</th>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Branch</th>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Email</th>
                    </>
                  )}
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '8px', fontSize: '0.875rem', color: '#ffffff', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={users.some(u => u.role === 'OPERATOR' && (u.country || u.branch || u.email)) ? "7" : "4"} style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    No users found.
                  </td>
                </tr>
              )}
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <strong style={{ color: '#ffffff' }}>{user.username}</strong>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="text-sm" style={{ color: '#ffffff' }}>{user.role}</span>
                  </td>
                  {users.some(u => u.role === 'OPERATOR' && (u.country || u.branch || u.email)) && (
                    <>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="text-sm" style={{ color: '#ffffff' }}>{user.country || '-'}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="text-sm" style={{ color: '#ffffff' }}>{user.branch || '-'}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="text-sm" style={{ color: '#ffffff' }}>{user.email || '-'}</span>
                      </td>
                    </>
                  )}
                  <td style={{ padding: '12px 8px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: user.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: user.isActive ? '#4ade80' : '#f87171'
                      }}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {/* Edit Profile button for operators */}
                      {user.role === 'OPERATOR' && (
                        <button
                          onClick={() => {
                            window.location.href = `/dashboard/profile?userId=${user.id}`;
                          }}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                          Edit Profile
                        </button>
                      )}
                      {/* Hide activate/deactivate button for super admin */}
                      {user.username !== 'ubaidtra' && (
                        <button
                          onClick={() => handleActivateDeactivate(user.id, user.username, user.isActive)}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: user.isActive ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      <button
                        onClick={() => setResetPasswordUser(user)}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.8'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                      >
                        Reset Password
                      </button>
                      {/* Show delete button for operators, or for admins if current user is super admin */}
                      {(user.role === 'OPERATOR' || (user.role === 'ADMIN' && currentUser.isSuperAdmin && user.username !== 'ubaidtra')) && (
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

