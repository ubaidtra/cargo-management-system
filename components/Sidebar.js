import Link from 'next/link';

export default function Sidebar({ role }) {
  return (
    <aside className="sidebar glass-panel">
      <div style={{ marginBottom: '2rem' }}>
        <h2>CargoSys</h2>
        <p className="text-sm">{role} Panel</p>
      </div>
      
      <nav>
        {role === 'ADMIN' && (
          <>
            <Link href="/dashboard/admin" className="sidebar-link">
              Dashboard
            </Link>
            <Link href="/dashboard/admin/settings" className="sidebar-link">
              Settings
            </Link>
            <Link href="/dashboard/admin/users" className="sidebar-link">
              Operators
            </Link>
          </>
        )}
        
        {role === 'OPERATOR' && (
          <>
            <Link href="/dashboard/operator/sending" className="sidebar-link">
              Sending
            </Link>
            <Link href="/dashboard/operator/receiving" className="sidebar-link">
              Receiving
            </Link>
          </>
        )}
        
        <Link href="/" className="sidebar-link" style={{ marginTop: 'auto', color: '#ff6b6b' }}>
          Logout
        </Link>
      </nav>
    </aside>
  );
}

