'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Phone, 
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8000/api/v1/admin/bookings', {
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

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.customer_phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-slate-900 mb-2">Bookings</h1>
          <p className="text-slate-500 font-light">Manage and track all guest reservations.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-coastal-seafoam transition-all w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-coastal-seafoam transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-slate-100">
                <th className="px-8 py-5">Guest Information</th>
                <th className="px-8 py-5">Stay Details</th>
                <th className="px-8 py-5">Total Price</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">Loading reservations...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">No reservations found matching your criteria.</td></tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-medium text-slate-900 mb-1">{booking.customer_name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone className="w-3 h-3" />
                      {booking.customer_phone}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-700 font-medium mb-1">{booking.room_type}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {booking.check_in} — {booking.check_out}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-medium text-slate-900">${booking.total_price.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{booking.meal_plan}</p>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-coastal-seafoam cursor-pointer
                        ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                          booking.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete Reservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">Showing {filteredBookings.length} of {bookings.length} reservations</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
