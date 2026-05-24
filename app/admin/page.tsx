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
  XCircle,
  Filter,
  MoreVertical,
  Check,
  X,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
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
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (timeFilter === 'all') return true;
    const date = new Date(b.created_at);
    const now = new Date();
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    }
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return date >= monthAgo;
    }
    return true;
  });

  const activeBookings = filteredBookings.filter(b => ['confirmed', 'checked_in', 'pending'].includes(b.status));
  const revenueBookings = filteredBookings.filter(b => ['confirmed', 'checked_in', 'completed'].includes(b.status));
  
  const stats = [
    { 
      name: 'Realized Revenue', 
      value: `₹${revenueBookings.reduce((acc, b) => acc + b.total_price, 0).toLocaleString()}`, 
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
      value: `₹${filteredBookings.length ? Math.round(filteredBookings.reduce((acc, b) => acc + b.total_price, 0) / filteredBookings.length).toLocaleString() : 0}`, 
      icon: TrendingUp, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      name: 'Total Reservations', 
      value: filteredBookings.length.toString(), 
      icon: Users, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">Welcome back. Here is what is happening at Namita Beach House today.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-elegant border border-neutral/50 shadow-sm">
          {(['all', 'month', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-4 py-2 rounded-modern text-[10px] font-bold uppercase tracking-widest transition-all ${
                timeFilter === t 
                  ? 'bg-accent text-white shadow-md shadow-accent/10' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-neutral/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface p-6 sm:p-8 rounded-elegant border border-neutral/30 shadow-sm transition-all hover:shadow-md">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-elegant flex items-center justify-center mb-4 sm:mb-6`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">{stat.name}</p>
            <p className="text-2xl sm:text-3xl font-playfair text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-surface rounded-majestic border border-neutral/30 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-neutral/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="font-playfair text-xl sm:text-2xl text-slate-900">Recent Reservations</h2>
            <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Live Feed
            </div>
          </div>
          <Link 
            href="/admin/bookings" 
            className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold hover:text-accent transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-neutral/10 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                <th className="px-6 sm:px-8 py-4">Guest</th>
                <th className="px-6 sm:px-8 py-4">Stay Details</th>
                <th className="px-6 sm:px-8 py-4">Status</th>
                <th className="px-6 sm:px-8 py-4">Total Amount</th>
                <th className="px-6 sm:px-8 py-4">Created At</th>
                <th className="px-6 sm:px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral/10">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-slate-400">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-slate-400">No bookings found for this period.</td></tr>
              ) : filteredBookings.slice(0, 8).map((booking) => (
                <tr key={booking.id} className="hover:bg-neutral/5 transition-colors group">
                  <td className="px-6 sm:px-8 py-6">
                    <p className="font-medium text-slate-900">{booking.customer_name}</p>
                    <p className="text-xs text-slate-400">{booking.customer_phone}</p>
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <p className="text-sm text-slate-600">{booking.room_type}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{booking.check_in} — {booking.check_out}</p>
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                      booking.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                      booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : 
                       booking.status === 'cancelled' ? <XCircle className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 sm:px-8 py-6 font-medium text-slate-900">
                    ₹{booking.total_price.toLocaleString()}
                  </td>
                  <td className="px-6 sm:px-8 py-6 text-xs text-slate-400">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          disabled={updatingId === booking.id}
                          className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Confirm Booking"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Cancel Booking"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
