'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  parseISO, 
  differenceInDays,
  isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, User, Calendar as CalendarIcon, Clock, X, Trash2 } from 'lucide-react';

interface Booking {
  id: number;
  customer_name: string;
  customer_phone: string;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
}

interface AdminCalendarProps {
  bookings: Booking[];
  onUpdateBooking: (id: number, updates: Partial<Booking>) => Promise<void>;
  onDeleteBooking?: (id: number) => Promise<void>;
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ bookings, onUpdateBooking, onDeleteBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingBooking, setDraggingBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch rooms dynamically
  useEffect(() => {
    async function loadRooms() {
      try {
        const { fetchOptions } = await import('@/lib/api');
        const options = await fetchOptions();
        setRooms(options.room_types || []);
      } catch (err) {
        console.error('Failed to load rooms for calendar:', err);
      } finally {
        setLoadingRooms(false);
      }
    }
    loadRooms();
  }, []);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const viewDays = useMemo(() => {
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 29) // 30 days view
    });
  }, [weekStart]);

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const goToToday = () => setCurrentDate(new Date());

  // Handle Drag and Drop
  const handleDragStart = (e: React.DragEvent, booking: Booking) => {
    setDraggingBooking(booking);
    e.dataTransfer.setData('bookingId', booking.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date, targetRoom: string) => {
    e.preventDefault();
    if (!draggingBooking) return;

    const bookingId = parseInt(e.dataTransfer.getData('bookingId'));
    const duration = differenceInDays(
      parseISO(draggingBooking.check_out),
      parseISO(draggingBooking.check_in)
    );

    const newCheckIn = format(targetDate, 'yyyy-MM-dd');
    const newCheckOut = format(addDays(targetDate, duration), 'yyyy-MM-dd');

    try {
      await onUpdateBooking(bookingId, {
        check_in: newCheckIn,
        check_out: newCheckOut,
        room_type: targetRoom
      });
    } catch (err) {
      console.error('Failed to move booking:', err);
      alert('Could not move booking. Please check availability.');
    } finally {
      setDraggingBooking(null);
    }
  };

  // Helper to find bookings for a specific room and day
  const getBookingForCell = (room: string, day: Date) => {
    return bookings.find(b => {
      if (b.room_type.toUpperCase() !== room.toUpperCase()) return false;
      const start = parseISO(b.check_in);
      return isSameDay(start, day);
    });
  };

  // Helper to check if a day is part of a booking's stay (but not the start)
  const isOccupied = (room: string, day: Date) => {
    return bookings.some(b => {
      if (b.room_type.toUpperCase() !== room.toUpperCase()) return false;
      const start = parseISO(b.check_in);
      const end = parseISO(b.check_out);
      return isWithinInterval(day, { start, end }) && !isSameDay(start, day);
    });
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      await onUpdateBooking(editingBooking.id, editingBooking);
      setShowEditModal(false);
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Calendar Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
        <div>
          <h2 className="font-playfair text-2xl text-slate-900 capitalize">
            {format(weekStart, 'MMMM yyyy')}
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">30-Day Schedule</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={prevWeek}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToToday}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={nextWeek}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <div className="min-w-[3000px] h-full flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-[150px_repeat(30,1fr)] border-b border-slate-100 bg-white sticky top-0 z-20">
            <div className="p-6 border-r border-slate-100 flex items-center justify-center bg-white sticky left-0 z-30 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
              <CalendarIcon className="w-5 h-5 text-slate-300" />
            </div>
            {viewDays.map(day => (
              <div 
                key={day.toString()} 
                className={`p-6 text-center border-r border-slate-100 last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-coastal-seafoam/5' : ''}`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
                  {format(day, 'EEE')}
                </p>
                <p className={`text-2xl font-playfair ${isSameDay(day, new Date()) ? 'text-coastal-seafoam' : 'text-slate-900'}`}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          <div className="flex-grow divide-y divide-slate-100">
            {loadingRooms ? (
               <div className="p-20 text-center text-slate-400 italic">Synchronizing room units...</div>
            ) : rooms.map(room => (
              <div key={room.id || room.unit_name} className="grid grid-cols-[150px_repeat(30,1fr)] min-h-[120px]">
                {/* Room Label */}
                <div className="p-6 border-r border-slate-100 bg-slate-50 sticky left-0 z-10 flex flex-col justify-center shadow-[4px_0_10px_-2px_rgba(0,0,0,0.05)]">
                  <p className="text-sm font-bold text-slate-900 truncate" title={room.unit_name}>{room.unit_name || room.name}</p>
                  <p className="text-[10px] text-coastal-seafoam uppercase tracking-widest mt-1 font-black">{room.category || room.name}</p>
                </div>

                {/* Day Cells */}
                {viewDays.map(day => {
                  const roomKey = room.unit_name || room.name;
                  const booking = getBookingForCell(roomKey, day);
                  const occupied = isOccupied(roomKey, day);
                  
                  return (
                    <div 
                      key={day.toString()}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, roomKey)}
                      className={`relative border-r border-slate-100 last:border-r-0 p-2 transition-colors ${
                        isSameDay(day, new Date()) ? 'bg-coastal-seafoam/[0.02]' : ''
                      } ${draggingBooking ? 'hover:bg-slate-50' : ''}`}
                    >
                      {booking && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, booking)}
                          onClick={() => handleEditBooking(booking)}
                          className={`absolute inset-y-2 left-2 z-10 p-3 rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl group
                            ${booking.status === 'confirmed' ? 'bg-emerald-50 border border-emerald-100 text-emerald-900' : 
                              booking.status === 'pending' ? 'bg-orange-50 border border-orange-100 text-orange-900' :
                              'bg-slate-50 border border-slate-200 text-slate-900'}`}
                          style={{
                            width: `calc(${differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in)) * 100}% + ${differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in)) * 1}px - 16px)`,
                            minWidth: '100px'
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-bold uppercase tracking-wider truncate">
                              {booking.customer_name}
                            </p>
                            <span className="text-[8px] uppercase font-black bg-white/50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] opacity-70">
                            <Clock className="w-3 h-3" />
                            <span>{differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in))} Nights</span>
                          </div>
                        </div>
                      )}
                      
                      {occupied && !booking && (
                        <div className="absolute inset-y-4 left-0 right-0 bg-slate-50/30 border-y border-slate-100/50" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-slate-900">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-playfair text-2xl text-slate-900">Edit Reservation</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Guest Name
                </label>
                <input 
                  required
                  type="text" 
                  value={editingBooking.customer_name}
                  onChange={(e) => setEditingBooking({...editingBooking, customer_name: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">From</label>
                  <input 
                    type="date" 
                    required
                    value={editingBooking.check_in}
                    onChange={(e) => setEditingBooking({...editingBooking, check_in: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">To</label>
                  <input 
                    type="date" 
                    required
                    value={editingBooking.check_out}
                    onChange={(e) => setEditingBooking({...editingBooking, check_out: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Status</label>
                <select 
                  value={editingBooking.status}
                  onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none text-slate-900 font-medium appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={async () => {
                    if (onDeleteBooking && confirm('Are you sure?')) {
                      await onDeleteBooking(editingBooking.id);
                      setShowEditModal(false);
                    }
                  }}
                  className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <button 
                  type="submit"
                  className="flex-grow bg-slate-900 text-white px-10 py-4 rounded-2xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-50 border border-emerald-200" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-50 border border-orange-200" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
