'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", 
  "Brazil", "Canada", "China", "Colombia", "Denmark", "Egypt", "Ethiopia", "Finland", "France", 
  "The Gambia", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", 
  "Kenya", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", 
  "Pakistan", "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", 
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", 
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
];

export default function SendingPage() {
  const [form, setForm] = useState({
    senderName: '',
    senderContact: '',
    receiverName: '',
    receiverContact: '',
    destination: '',
    weight: '',
    numberOfItems: '1',
    description: '',
    sendingDate: new Date().toISOString().split('T')[0], // Default to today
    paymentStatus: 'UNPAID'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState({ baseCost: 10, costPerKg: 5 });
  const [calculatedCost, setCalculatedCost] = useState(null);

  // Fetch pricing configuration
  useEffect(() => {
    fetch('/api/admin/pricing')
      .then(res => res.json())
      .then(data => {
        if (data.baseCost !== undefined && data.costPerKg !== undefined) {
          setPricing({ baseCost: data.baseCost, costPerKg: data.costPerKg });
        }
      })
      .catch(err => {
        console.error('Error fetching pricing:', err);
      });
  }, []);

  // Calculate cost when weight changes
  useEffect(() => {
    if (form.weight && parseFloat(form.weight) > 0) {
      const weight = parseFloat(form.weight);
      const cost = pricing.baseCost + (weight * pricing.costPerKg);
      setCalculatedCost(cost.toFixed(2));
    } else {
      setCalculatedCost(null);
    }
  }, [form.weight, pricing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get operator info from localStorage
      const operatorId = localStorage.getItem('userId');
      const operatorUsername = localStorage.getItem('username');
      
      const res = await fetch('/api/cargo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          operatorId,
          operatorUsername
        })
      });
      const data = await res.json();
      setResult(data);
      if (res.ok) {
        // Reset form but keep date as today
        setForm({ 
          senderName: '',
          senderContact: '', 
          receiverName: '',
          receiverContact: '', 
          destination: '', 
          weight: '',
          numberOfItems: '1',
          description: '',
          sendingDate: new Date().toISOString().split('T')[0],
          paymentStatus: 'UNPAID'
        });
      }
    } catch (err) {
      alert('Error creating cargo');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      <h1 className="no-print">Register Cargo</h1>
      
      {/* Printable Receipt Section (Hidden by default, shown in print) */}
      {result && (
        <div className="print-only" style={{ display: 'none', padding: '40px' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '10px' }}>Cargo Receipt</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Date:</strong> <span>{new Date(result.sendingDate).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Tracking Number:</strong> <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{result.trackingNumber}</span>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>Sender:</strong> 
                  <span>{result.senderName}</span>
                  <span style={{ fontSize: '0.9em' }}>{result.senderContact}</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                  <strong>Receiver:</strong> 
                  <span>{result.receiverName}</span>
                  <span style={{ fontSize: '0.9em' }}>{result.receiverContact}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <strong>Destination:</strong> <span>{result.destination}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Items:</strong> <span>{result.numberOfItems} ({result.description || 'No description'})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Weight:</strong> <span>{result.weight} kg</span>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
              <strong>Total Cost:</strong> <span>${result.cost}</span>
            </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Payment Status:</strong> <span>{result.paymentStatus}</span>
            </div>
            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.8em' }}>
              <p>Thank you for choosing CargoSys!</p>
            </div>
          </div>
        </div>
      )}

      <div className="no-print responsive-grid">
        <Card>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input 
                label="Sender Name" 
                value={form.senderName}
                onChange={e => setForm({...form, senderName: e.target.value})}
                required
              />
              <Input 
                label="Sender Contact" 
                value={form.senderContact}
                onChange={e => setForm({...form, senderContact: e.target.value})}
                placeholder="Phone / Email"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input 
                label="Receiver Name" 
                value={form.receiverName}
                onChange={e => setForm({...form, receiverName: e.target.value})}
                required
              />
              <Input 
                label="Receiver Contact" 
                value={form.receiverContact}
                onChange={e => setForm({...form, receiverContact: e.target.value})}
                placeholder="Phone / Email"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Destination Country</label>
              <select 
                className="input-field" 
                value={form.destination}
                onChange={e => setForm({...form, destination: e.target.value})}
                required
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="" style={{ color: '#000' }}>Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country} style={{ color: '#000' }}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <Input 
                label="No. of Items" 
                type="number"
                min="1"
                value={form.numberOfItems}
                onChange={e => setForm({...form, numberOfItems: e.target.value})}
                required
              />
              <Input 
                label="Description" 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="e.g., Electronics, Clothes"
              />
            </div>

            <Input 
              label="Weight (kg)" 
              type="number"
              step="0.1"
              value={form.weight}
              onChange={e => setForm({...form, weight: e.target.value})}
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input 
                label="Sending Date" 
                type="date"
                value={form.sendingDate}
                onChange={e => setForm({...form, sendingDate: e.target.value})}
                required
              />
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Payment Status</label>
                <select 
                  className="input-field" 
                  value={form.paymentStatus}
                  onChange={e => setForm({...form, paymentStatus: e.target.value})}
                  required
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="UNPAID" style={{ color: '#000' }}>Unpaid</option>
                  <option value="PAID" style={{ color: '#000' }}>Paid</option>
                </select>
              </div>
            </div>

            {/* Display Calculated Cost */}
            {calculatedCost && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Calculated Cost:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    ${calculatedCost}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                  Base: ${pricing.baseCost} + Weight ({form.weight} kg × ${pricing.costPerKg}/kg)
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Register Cargo'}
            </Button>
          </form>
        </Card>

        {result && (
          <Card>
            <h3 style={{ color: '#2ecc71', marginBottom: '16px' }}>Cargo Registered!</h3>
            <div className="flex-col gap-md">
              <div>
                <p className="text-sm">Tracking Number</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{result.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm">Cost</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${result.cost}</p>
              </div>
              <div>
                <p className="text-sm">Destination</p>
                <p style={{ fontSize: '1rem', color: '#fff' }}>{result.destination}</p>
              </div>
              <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                <div>
                  <p className="text-sm">Sending Date</p>
                  <p style={{ fontSize: '1rem', color: '#fff' }}>
                    {new Date(result.sendingDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Status</p>
                  <StatusBadge status={result.paymentStatus} />
                </div>
              </div>
              
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                 <Button onClick={handlePrint} variant="secondary" style={{ width: '100%' }}>
                    🖨️ Print Receipt
                 </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
