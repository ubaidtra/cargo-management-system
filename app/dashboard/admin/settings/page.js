'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    baseCost: '',
    costPerKg: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/pricing')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setMessage('Settings updated successfully!');
      } else {
        setMessage('Failed to update settings.');
      }
    } catch (err) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Loading settings...</div>;

  return (
    <div className="container">
      <h1>Settings</h1>
      
      <Card style={{ maxWidth: '600px' }}>
        <h3>Global Pricing Rules</h3>
        <p className="text-sm" style={{ marginBottom: '24px' }}>
          Set the base cost and weight multiplier for all new cargo shipments.
        </p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Base Cost ($)" 
            type="number"
            step="0.01"
            value={config.baseCost}
            onChange={e => setConfig({...config, baseCost: e.target.value})}
            required
          />
          
          <Input 
            label="Cost per Kg ($)" 
            type="number"
            step="0.01"
            value={config.costPerKg}
            onChange={e => setConfig({...config, costPerKg: e.target.value})}
            required
          />
          
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          {message && (
            <p style={{ marginTop: '16px', color: message.includes('Failed') || message.includes('Error') ? '#e74c3c' : '#2ecc71' }}>
              {message}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}

