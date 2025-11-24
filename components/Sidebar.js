'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Sidebar({ role, isOpen = true, onClose }) {
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add('open');
      } else {
        sidebar.classList.remove('open');
      }
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>CargoSys</h2>
        <p className="text-sm">{role} Panel</p>
      </div>
      
      <nav>
        {role === 'ADMIN' && (
          <>
            <Link href="/dashboard/admin" className="sidebar-link" onClick={handleLinkClick}>
              Dashboard
            </Link>
            <Link href="/dashboard/admin/settings" className="sidebar-link" onClick={handleLinkClick}>
              Settings
            </Link>
            <Link href="/dashboard/admin/users" className="sidebar-link" onClick={handleLinkClick}>
              Users
            </Link>
            <Link href="/dashboard/admin/logs" className="sidebar-link" onClick={handleLinkClick}>
              Activity Logs
            </Link>
          </>
        )}
        
        {role === 'OPERATOR' && (
          <>
            <Link href="/dashboard/operator/sending" className="sidebar-link" onClick={handleLinkClick}>
              Sending
            </Link>
            <Link href="/dashboard/operator/receiving" className="sidebar-link" onClick={handleLinkClick}>
              Receiving
            </Link>
          </>
        )}
        
        <Link href="/dashboard/profile" className="sidebar-link" onClick={handleLinkClick}>
          Profile
        </Link>
        
        <Link href="/" className="sidebar-link" style={{ marginTop: 'auto', color: '#ff6b6b' }} onClick={handleLinkClick}>
          Logout
        </Link>
      </nav>
    </aside>
  );
}

