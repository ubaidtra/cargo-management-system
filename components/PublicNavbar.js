import Link from 'next/link';

export default function PublicNavbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 40px',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
        CargoSys
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/" style={{ color: '#e0e0e0' }}>Home</Link>
        <Link href="/about" style={{ color: '#e0e0e0' }}>About</Link>
        <Link href="/login" style={{ 
          padding: '8px 20px', 
          background: 'white', 
          color: '#4e54c8', 
          borderRadius: '20px',
          fontWeight: 'bold' 
        }}>
          Login
        </Link>
      </div>
    </nav>
  );
}

