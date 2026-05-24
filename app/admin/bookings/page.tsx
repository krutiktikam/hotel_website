'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import AdminCalendar from '@/components/AdminCalendar';
import { 
  Search, 
  XCircle, 
  Phone, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  UserCheck,
  Flag,
  Calendar,
  List,
  Plus,
  Filter
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

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
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

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

  const updateBooking = async (id: number, updates: Partial<any>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

      if (response.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, ...updates } : b));
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await updateBooking(id, { status: newStatus });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesFilter = filter === 'all' || b.status === filter;
      const matchesSearch = (b.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                            (b.customer_phone?.includes(searchTerm) || false);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const exportToCSV = () => {
    const headers = ['ID', 'Guest Name', 'Phone', 'Room', 'Check In', 'Check Out', 'Total Price', 'Status', 'Date Booked'];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.customer_name}"`,
      `"${b.customer_phone}"`,
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
    link.setAttribute('download', `namita_bookings_${new Date().toISOString().split('T')[0]}.csv`);
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

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-8">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-slate-900 mb-2">Bookings Management</h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">Track, filter, and manage all guest reservations and block-outs.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex bg-white rounded-elegant border border-neutral/50 p-1 shadow-sm">
            <button 
              onClick={() => setView('list')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-modern text-[10px] font-bold uppercase tracking-widest transition-all ${
                view === 'list' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-accent'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-modern text-[10px] font-bold uppercase tracking-widest transition-all ${
                view === 'calendar' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-accent'
              }`}
            >
              <Calendar className="w-4 h-4" /> Calendar
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowBlockModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white rounded-elegant text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-accent/10"
            >
              <Plus className="w-4 h-4 text-primary" /> Block Dates
            </button>
            <button 
              onClick={exportToCSV}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-neutral/50 rounded-elegant text-xs font-bold uppercase tracking-widest hover:bg-neutral/10 transition-all text-slate-600 shadow-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface p-6 rounded-elegant border border-neutral/30 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-neutral/5 border border-neutral/20 rounded-modern text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-900"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-neutral/5 border border-neutral/20 rounded-modern text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer text-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="checked_in">Checked In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex items-center justify-end px-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            {filteredBookings.length} results found
          </div>
      </div>

      {view === 'list' ? (
        <div className="bg-surface rounded-majestic border border-neutral/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-neutral/10 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-neutral/20">
                  <th className="px-8 py-5">Guest</th>
                  <th className="px-8 py-5">Stay Details</th>
                  <th className="px-8 py-5">Price & Plan</th>
                  <th className="px-8 py-5">Status Management</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral/10">
                {loading ? (
                  <tr><td colSpan={5} className="p-24 text-center text-slate-400 italic">Consulting the tides...</td></tr>
                ) : paginatedBookings.length === 0 ? (
                  <tr><td colSpan={5} className="p-24 text-center text-slate-400">No reservations found matching your criteria.</td></tr>
                ) : paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral/5 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-medium text-slate-900 mb-1">{booking.customer_name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="w-3 h-3 text-primary" />
                        {booking.customer_phone}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-700 font-medium mb-1">{booking.room_type}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {booking.check_in} — {booking.check_out}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-medium text-slate-900">₹{booking.total_price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{booking.meal_plan}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <select 
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-primary cursor-pointer transition-all
                            ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                              booking.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                              booking.status === 'checked_in' ? 'bg-blue-50 text-blue-600' :
                              booking.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                              booking.status === 'maintenance' ? 'bg-slate-900 text-white' :
                              'bg-red-50 text-red-600'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => updateStatus(booking.id, 'checked_in')}
                              className="p-2 bg-blue-50 text-blue-600 rounded-modern hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Check-In"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status === 'checked_in' && (
                            <button 
                              onClick={() => updateStatus(booking.id, 'completed')}
                              className="p-2 bg-slate-100 text-slate-600 rounded-modern hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              title="Mark Complete"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-modern transition-all"
                          title="Delete"
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
          
          {/* Pagination */}
          <div className="p-6 md:p-8 bg-neutral/5 border-t border-neutral/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-medium italic">
              Showing page {currentPage} of {totalPages || 1} • {filteredBookings.length} total reservations
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2.5 border border-neutral/30 rounded-modern text-slate-400 hover:bg-white hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-modern text-xs font-bold transition-all ${
                      currentPage === page ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-accent'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2.5 border border-neutral/30 rounded-modern text-slate-400 hover:bg-white hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AdminCalendar 
          bookings={bookings} 
          onUpdateBooking={updateBooking} 
          onDeleteBooking={deleteBooking}
        />
      )}

      {/* Block Dates Modal (Themed) */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-surface w-full max-w-lg rounded-majestic p-8 sm:p-12 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className="font-playfair text-3xl text-slate-900">Block Room Dates</h2>
              </div>
              <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-neutral/10 rounded-full transition-colors">
                <XCircle className="w-8 h-8 text-slate-300 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={createBlockOut} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Room Category</label>
                <select 
                  value={blockData.room_type}
                  onChange={(e) => setBlockData(prev => ({ ...prev, room_type: e.target.value }))}
                  className="w-full bg-neutral/5 border border-neutral/20 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none appearance-none text-slate-900 font-medium"
                >
                  <option value="Luxury">Ocean Front Luxury</option>
                  <option value="Suite">Coastal Garden Villa</option>
                  <option value="Deluxe">Sand Dune Studio</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Arrival Date</label>
                  <input 
                    type="date" 
                    required
                    value={blockData.check_in}
                    onChange={(e) => setBlockData(prev => ({ ...prev, check_in: e.target.value }))}
                    className="w-full bg-neutral/5 border border-neutral/20 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Departure Date</label>
                  <input 
                    type="date" 
                    required
                    value={blockData.check_out}
                    onChange={(e) => setBlockData(prev => ({ ...prev, check_out: e.target.value }))}
                    className="w-full bg-neutral/5 border border-neutral/20 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Blocking Reason</label>
                <input 
                  type="text" 
                  placeholder="e.g. Annual Maintenance, Personal Use..."
                  value={blockData.customer_name === 'MAINTENANCE' ? '' : blockData.customer_name}
                  onChange={(e) => setBlockData(prev => ({ ...prev, customer_name: e.target.value || 'MAINTENANCE' }))}
                  className="w-full bg-neutral/5 border border-neutral/20 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-5 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-colors order-2 sm:order-1"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-accent text-white px-10 py-5 rounded-elegant font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-accent/20 order-1 sm:order-2"
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
