'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';

export default function ReceivingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cargo, setCargo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/cargo/receive?trackingNumber=${trackingNumber}`);
      const data = await res.json();
      if (res.ok) {
        setCargo(data);
      } else {
        alert(data.error || 'Cargo not found');
        setCargo(null);
      }
    } catch (err) {
      alert('Error searching cargo');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!cargo) return;
    try {
      const res = await fetch('/api/cargo/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: cargo.trackingNumber, action })
      });
      const data = await res.json();
      if (res.ok) {
        setCargo(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error processing action');
    }
  };

  return (
    <div className="container">
      <h1>Receive Cargo</h1>
      
      <Card className="flex-col gap-md" style={{ marginBottom: '32px' }}>
        <form onSubmit={handleSearch} className="flex-center gap-md" style={{ justifyContent: 'flex-start' }}>
          <div style={{ flex: 1, marginBottom: 0 }}>
            <Input 
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button type="submit" disabled={loading}>Search</Button>
        </form>
      </Card>

      {cargo && (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div className="flex-col gap-md">
              <h3>Cargo Details</h3>
              <div><p className="text-sm">Sender</p><p>{cargo.senderName}</p></div>
              <div><p className="text-sm">Receiver</p><p>{cargo.receiverName}</p></div>
              <div><p className="text-sm">Destination</p><p>{cargo.destination}</p></div>
              <div><p className="text-sm">Weight</p><p>{cargo.weight} kg</p></div>
            </div>
            
            <div className="flex-col gap-md">
              <h3>Status & Payment</h3>
              <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                <span>Status:</span>
                <StatusBadge status={cargo.status} />
              </div>
              <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                <span>Payment:</span>
                <StatusBadge status={cargo.paymentStatus} />
              </div>
              <div className="flex-center" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Cost:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${cargo.cost}</span>
              </div>

              <div className="flex-col gap-md" style={{ marginTop: '24px' }}>
                {cargo.paymentStatus === 'UNPAID' && (
                  <Button 
                    onClick={() => handleAction('PAY')}
                    style={{ background: '#f1c40f', color: '#000' }}
                  >
                    Mark as Paid
                  </Button>
                )}
                
                {cargo.status === 'SENT' && (
                  <Button 
                    onClick={() => handleAction('RECEIVE')}
                    style={{ background: '#2ecc71' }}
                  >
                    Receive Cargo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

