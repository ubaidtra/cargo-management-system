'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", 
  "Brazil", "Canada", "China", "Colombia", "Denmark", "Egypt", "Ethiopia", "Finland", "France", 
  "The Gambia", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", 
  "Kenya", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", 
  "Pakistan", "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", 
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", 
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    role: '',
    country: '',
    branch: '',
    email: '',
    address: '',
    contact: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole || '');
    
    // Check if admin is editing another user's profile via URL param
    let editUserId = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      editUserId = urlParams.get('userId');
    }
    
    if (editUserId && storedRole === 'ADMIN') {
      // Admin editing another user's profile
      setUserId(editUserId);
      fetchUserProfile(editUserId);
      fetchAllUsers(); // Fetch users for dropdown
    } else if (storedUserId && storedUserId !== '0') {
      // User viewing/editing their own profile
      setUserId(storedUserId);
      fetchUserProfile(storedUserId);
    } else {
      // For super admin or if no userId, set basic info
      setProfile({
        username: storedUsername || '',
        role: storedRole || '',
        country: '',
        branch: '',
        email: '',
        address: '',
        contact: ''
      });
      setLoading(false);
    }
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const users = await res.json();
        setAllUsers(users.filter(u => u.role === 'OPERATOR'));
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  const fetchUserProfile = async (id) => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const users = await res.json();
        const user = users.find(u => u.id === id);
        if (user) {
          setProfile({
            username: user.username || '',
            role: user.role || '',
            country: user.country || '',
            branch: user.branch || '',
            email: user.email || '',
            address: user.address || '',
            contact: user.contact || ''
          });
          setSelectedUserId(id);
        }
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      setSelectedUserId(selectedId);
      fetchUserProfile(selectedId);
      setUserId(selectedId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || userId === '0') {
      setMessage('Cannot update profile: User ID not found');
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      const currentUserId = localStorage.getItem('userId');
      const currentUsername = localStorage.getItem('username');
      
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'updateProfile',
          profileData: {
            country: profile.country,
            branch: profile.branch,
            email: profile.email,
            address: profile.address,
            contact: profile.contact
          },
          currentUserId,
          currentUsername
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Profile updated successfully!');
        fetchUserProfile(userId);
      } else {
        setMessage(`Error: ${data.error || 'Failed to update profile'}`);
      }
    } catch (e) {
      setMessage('Failed to update profile');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{userRole === 'ADMIN' && userId !== localStorage.getItem('userId') ? 'Edit User Profile' : 'My Profile'}</h1>
      
      <Card style={{ maxWidth: '600px' }}>
        <h3>Profile Information</h3>
        
        {/* User Selector for Admins */}
        {userRole === 'ADMIN' && allUsers.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>
              Select User to Edit
            </label>
            <select
              value={selectedUserId}
              onChange={handleUserSelect}
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
              <option value="">Select an Operator</option>
              {allUsers.map(user => (
                <option key={user.id} value={user.id} style={{ color: '#000' }}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#60a5fa' }}>Username:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{profile.username || '-'}</span>
          </div>
          <div>
            <strong style={{ color: '#60a5fa' }}>Role:</strong>{' '}
            <span style={{ color: '#ffffff' }}>{profile.role || '-'}</span>
          </div>
        </div>

        {(profile.role === 'OPERATOR' || (userRole === 'ADMIN' && selectedUserId)) ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ffffff' }}>Country</label>
              <select
                value={profile.country}
                onChange={e => setProfile({...profile, country: e.target.value})}
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
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country} style={{ color: '#000' }}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Branch" 
              value={profile.branch} 
              onChange={e => setProfile({...profile, branch: e.target.value})} 
            />
            
            <Input 
              label="Email" 
              type="email"
              value={profile.email} 
              onChange={e => setProfile({...profile, email: e.target.value})} 
            />
            
            <Input 
              label="Address" 
              value={profile.address} 
              onChange={e => setProfile({...profile, address: e.target.value})} 
            />
            
            <Input 
              label="Contact" 
              value={profile.contact} 
              onChange={e => setProfile({...profile, contact: e.target.value})} 
              placeholder="Phone number"
            />
            
            <Button type="submit" disabled={saving || !userId || userId === '0' || (userRole === 'ADMIN' && !selectedUserId)}>
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>

            {message && (
              <p style={{ 
                marginTop: '1rem', 
                color: message.includes('Error') || message.includes('Failed') ? '#f87171' : '#4ade80' 
              }}>
                {message}
              </p>
            )}
          </form>
        ) : userRole === 'ADMIN' ? (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Please select an operator from the dropdown above to edit their profile.
            </p>
          </div>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Profile editing is available for Operators only.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

