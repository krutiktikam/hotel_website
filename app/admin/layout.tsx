'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Home, 
  Image as ImageIcon, 
  Compass, 
  LogOut, 
  Waves,
  CalendarCheck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token) {
      setAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authorized) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Rooms', path: '/admin/rooms', icon: Home },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Experiences', path: '/admin/experiences', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-8 flex items-center gap-3 border-b border-slate-50">
          <Waves className="w-8 h-8 text-coastal-seafoam" />
          <span className="font-playfair text-xl tracking-tighter">AZURE <span className="italic text-slate-400">ADMIN</span></span>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.path 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow ml-64 p-12">
        {children}
      </main>
    </div>
  );
}
