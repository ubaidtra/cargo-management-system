'use client';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          background: '-webkit-linear-gradient(#fff, #a5b4fc)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px' 
        }}>
          Future of Logistics
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', color: '#e0e0e0', marginBottom: '40px' }}>
          Manage your cargo operations with style and efficiency. From sending to receiving, we've got you covered.
        </p>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/login" style={{ 
            padding: '15px 40px', 
            background: 'white', 
            color: '#4e54c8', 
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            Get Started
          </Link>
          <Link href="/about" style={{ 
            padding: '15px 40px', 
            background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', 
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
}
