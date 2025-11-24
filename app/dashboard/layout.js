'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const [role, setRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole);
    }
    
    // Check screen size and set initial sidebar state
    const checkScreenSize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div>
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="mobile-menu-overlay active" 
          onClick={closeSidebar}
        />
      )}
      <Sidebar role={role} isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

