'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
      }
    };
    
    checkSession();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {session && (
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1">
              
                  {children}
                
            </main>
          </div>
        )}
      
      </body>
    </html>
  );
}