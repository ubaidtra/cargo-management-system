'use client';
import PublicNavbar from '@/components/PublicNavbar';
import Card from '@/components/Card';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <main className="container" style={{ marginTop: '40px' }}>
        <Card>
          <h1>About CargoSys</h1>
          <p style={{ lineHeight: '1.6', marginBottom: '20px', color: '#e0e0e0' }}>
            CargoSys is a state-of-the-art Cargo Management System designed to streamline the logistics of sending and receiving shipments globally. 
            Built with modern web technologies, we prioritize speed, security, and user experience.
          </p>
          
          <h2>Our Mission</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '20px', color: '#e0e0e0' }}>
            To connect people through reliable cargo services, ensuring that every package reaches its destination safely and on time.
          </p>

          <h2>Features</h2>
          <ul style={{ marginLeft: '20px', color: '#e0e0e0', lineHeight: '1.8' }}>
            <li>Real-time Cargo Tracking</li>
            <li>Secure Admin & Operator Dashboards</li>
            <li>Global Destination Support (including The Gambia)</li>
            <li>Instant Cost Calculation</li>
            <li>Digital Receipt Generation</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}

