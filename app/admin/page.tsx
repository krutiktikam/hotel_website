'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const activeBookings = bookings.filter(b => ['confirmed', 'checked_in', 'pending'].includes(b.status));
  const revenueBookings = bookings.filter(b => ['confirmed', 'checked_in', 'completed'].includes(b.status));
  
  const stats = [
    { 
      name: 'Realized Revenue', 
      value: `$${revenueBookings.reduce((acc, b) => acc + b.total_price, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
    { 
      name: 'Active Bookings', 
      value: activeBookings.length.toString(), 
      icon: Calendar, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      name: 'Avg. Booking Value', 
      value: `$${bookings.length ? Math.round(bookings.reduce((acc, b) => acc + b.total_price, 0) / bookings.length).toLocaleString() : 0}`, 
      icon: TrendingUp, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      name: 'Total Reservations', 
      value: bookings.length.toString(), 
      icon: Users, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-playfair text-4xl text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500 font-light">Welcome back. Here is what is happening at Namita Beach House today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">{stat.name}</p>
            <p className="text-3xl font-playfair text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-playfair text-2xl text-slate-900">Recent Reservations</h2>
          <Link 
            href="/admin/bookings" 
            className="text-xs uppercase tracking-widest text-coastal-seafoam font-bold hover:text-slate-900 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                <th className="px-8 py-4">Guest</th>
                <th className="px-8 py-4">Stay</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">No bookings found.</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-medium text-slate-900">{booking.customer_name}</p>
                    <p className="text-xs text-slate-400">{booking.customer_phone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-600">{booking.room_type}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{booking.check_in} — {booking.check_out}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-medium text-slate-900">
                    ${booking.total_price.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
