'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCargo: 0,
    totalRevenue: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container">Loading stats...</div>;

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card>
          <p className="text-sm">Total Cargo</p>
          <h2 style={{ fontSize: '2rem', color: '#4e54c8' }}>{stats.totalCargo}</h2>
        </Card>
        <Card>
          <p className="text-sm">Total Revenue</p>
          <h2 style={{ fontSize: '2rem', color: '#2ecc71' }}>${stats.totalRevenue.toFixed(2)}</h2>
        </Card>
      </div>

      <h2>Recent Transactions</h2>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px' }}>Tracking #</th>
                <th style={{ padding: '12px' }}>Sender</th>
                <th style={{ padding: '12px' }}>Destination</th>
                <th style={{ padding: '12px' }}>Cost</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map(cargo => (
                <tr key={cargo.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{cargo.trackingNumber}</td>
                  <td style={{ padding: '12px' }}>{cargo.senderName}</td>
                  <td style={{ padding: '12px' }}>{cargo.destination}</td>
                  <td style={{ padding: '12px' }}>${cargo.cost}</td>
                  <td style={{ padding: '12px' }}><StatusBadge status={cargo.status} /></td>
                  <td style={{ padding: '12px' }}><StatusBadge status={cargo.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

