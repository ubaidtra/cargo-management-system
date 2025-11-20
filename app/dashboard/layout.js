'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div>
      <Sidebar role={role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

