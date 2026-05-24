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
  CalendarCheck,
  Mail,
  MapPin,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token) {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    { name: 'Geography Map', path: '/admin/map', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-neutral/30 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden bg-surface border-b border-neutral/50 p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <Waves className="w-6 h-6 text-primary" />
          <span className="font-playfair text-lg tracking-tighter uppercase">Namita <span className="italic text-slate-400">Admin</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-neutral/10 rounded-elegant transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed lg:static inset-0 z-50 lg:z-auto
        w-64 bg-surface border-r border-neutral/50 flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 hidden lg:flex items-center gap-3 border-b border-neutral/20">
          <Waves className="w-8 h-8 text-primary" />
          <span className="font-playfair text-xl tracking-tighter uppercase">Namita <span className="italic text-slate-400">Admin</span></span>
        </div>
        
        <nav className="flex-grow p-6 space-y-2 overflow-y-auto mt-16 lg:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-elegant text-sm font-medium transition-all ${
                  pathname === item.path 
                    ? 'bg-accent text-white shadow-lg shadow-accent/10' 
                    : 'text-slate-500 hover:bg-neutral/10 hover:text-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          <Link 
            href="/admin/subscribers"
            className={`flex items-center gap-3 px-4 py-3 rounded-elegant text-sm font-medium transition-all ${
              pathname === '/admin/subscribers' 
                ? 'bg-accent text-white shadow-lg shadow-accent/10' 
                : 'text-slate-500 hover:bg-neutral/10 hover:text-accent'
            }`}
          >
            <Mail className="w-4 h-4" />
            Shore Club
          </Link>
        </nav>

        <div className="p-6 border-t border-neutral/20">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-elegant text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Content */}
      <main className="flex-grow p-6 sm:p-8 lg:p-12 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
