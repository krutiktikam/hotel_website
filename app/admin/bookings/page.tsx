'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
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
  ChevronRight,
  Download,
  UserCheck,
  Flag,
  Calendar
} from 'lucide-react';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockData, setBlockData] = useState({
    customer_name: 'MAINTENANCE',
    customer_phone: 'N/A',
    room_type: 'Luxury',
    check_in: '',
    check_out: '',
    selected_addons: []
  });

  const fetchBookings = async () => {
    setLoading(true);
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

  const createBlockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/bookings?status=maintenance`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blockData)
      });
      if (response.ok) {
        setShowBlockModal(false);
        fetchBookings();
      } else {
        const err = await response.json();
        alert(err.detail || 'Failed to block dates');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
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

  const exportToCSV = () => {
    const headers = ['ID', 'Guest Name', 'Phone', 'Room', 'Check In', 'Check Out', 'Total Price', 'Status', 'Date Booked'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.customer_name,
      b.customer_phone,
      b.room_type,
      b.check_in,
      b.check_out,
      b.total_price,
      b.status,
      new Date(b.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-slate-900 mb-2">Bookings</h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">Manage and track all guest reservations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowBlockModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              <Calendar className="w-4 h-4 text-coastal-seafoam" /> Block
            </button>
            <button 
              onClick={exportToCSV}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition-all text-slate-600"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-coastal-seafoam transition-all w-full sm:w-64 text-slate-900"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-coastal-seafoam transition-all appearance-none cursor-pointer text-slate-900"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-slate-100">
                <th className="px-6 sm:px-8 py-5">Guest Information</th>
                <th className="px-6 sm:px-8 py-5">Stay Details</th>
                <th className="px-6 sm:px-8 py-5">Total Price</th>
                <th className="px-6 sm:px-8 py-5">Status</th>
                <th className="px-6 sm:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">Loading reservations...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400">No reservations found matching your criteria.</td></tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 sm:px-8 py-6">
                    <p className="font-medium text-slate-900 mb-1">{booking.customer_name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone className="w-3 h-3" />
                      {booking.customer_phone}
                    </div>
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <p className="text-sm text-slate-700 font-medium mb-1">{booking.room_type}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {booking.check_in} — {booking.check_out}
                    </p>
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <p className="font-medium text-slate-900">₹{booking.total_price.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{booking.meal_plan}</p>
                  </td>
                  <td className="px-6 sm:px-8 py-6">
                    <div className="flex items-center gap-3">
                      <select 
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-coastal-seafoam cursor-pointer
                          ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                            booking.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                            booking.status === 'checked_in' ? 'bg-blue-50 text-blue-600' :
                            booking.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                            'bg-red-50 text-red-600'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      <div className="flex gap-1 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'checked_in')}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Quick Check-In"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {booking.status === 'checked_in' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'completed')}
                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                            title="Quick Complete"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 sm:px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 xl:opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
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

      {/* Block Dates Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300 my-8 text-slate-900">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-playfair text-2xl text-slate-900">Block Room Dates</h2>
              <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={createBlockOut} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Room Type</label>
                <select 
                  value={blockData.room_type}
                  onChange={(e) => setBlockData({...blockData, room_type: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 sm:py-4 sm:px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none appearance-none text-slate-900 font-medium"
                >
                  <option value="Luxury">Ocean Front Luxury</option>
                  <option value="Suite">Coastal Garden Villa</option>
                  <option value="Deluxe">Sand Dune Studio</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">From</label>
                  <input 
                    type="date" 
                    required
                    value={blockData.check_in}
                    onChange={(e) => setBlockData({...blockData, check_in: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 sm:py-4 sm:px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">To</label>
                  <input 
                    type="date" 
                    required
                    value={blockData.check_out}
                    onChange={(e) => setBlockData({...blockData, check_out: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 sm:py-4 sm:px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Reason (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Maintenance, Personal Use, etc."
                  value={blockData.customer_name === 'MAINTENANCE' ? '' : blockData.customer_name}
                  onChange={(e) => setBlockData({...blockData, customer_name: e.target.value || 'MAINTENANCE'})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 sm:py-4 sm:px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-4 text-slate-500 font-medium hover:text-slate-900 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 order-1 sm:order-2"
                >
                  Confirm Block-Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
