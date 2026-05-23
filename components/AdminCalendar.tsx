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
  addWeeks,
  subWeeks,
  isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, User, Calendar as CalendarIcon, Clock } from 'lucide-react';

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
}

const ROOM_TYPES = ['Luxury', 'Suite', 'Deluxe'];

const AdminCalendar: React.FC<AdminCalendarProps> = ({ bookings, onUpdateBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingBooking, setDraggingBooking] = useState<Booking | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = useMemo(() => {
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6)
    });
  }, [weekStart]);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Handle Drag and Drop
  const handleDragStart = (e: React.DragEvent, booking: Booking) => {
    setDraggingBooking(booking);
    e.dataTransfer.setData('bookingId', booking.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image if needed, or just let default happen
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
      if (b.room_type !== room) return false;
      const start = parseISO(b.check_in);
      return isSameDay(start, day);
    });
  };

  // Helper to check if a day is part of a booking's stay (but not the start)
  const isOccupied = (room: string, day: Date) => {
    return bookings.some(b => {
      if (b.room_type !== room) return false;
      const start = parseISO(b.check_in);
      const end = parseISO(b.check_out);
      // isWithinInterval is inclusive, but usually check_out is the day they leave
      return isWithinInterval(day, { start, end }) && !isSameDay(start, day);
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Calendar Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
        <div>
          <h2 className="font-playfair text-2xl text-slate-900 capitalize">
            {format(weekStart, 'MMMM yyyy')}
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">Weekly Schedule</p>
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
      <div className="flex-grow overflow-auto">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-[150px_repeat(7,1fr)] border-b border-slate-100 bg-white sticky top-0 z-20">
            <div className="p-6 border-r border-slate-100 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-slate-300" />
            </div>
            {weekDays.map(day => (
              <div 
                key={day.toString()} 
                className={`p-6 text-center border-r border-slate-100 last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-coastal-seafoam/5' : ''}`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
                  {format(day, 'EEEE')}
                </p>
                <p className={`text-2xl font-playfair ${isSameDay(day, new Date()) ? 'text-coastal-seafoam' : 'text-slate-900'}`}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          <div className="flex-grow divide-y divide-slate-100">
            {ROOM_TYPES.map(room => (
              <div key={room} className="grid grid-cols-[150px_repeat(7,1fr)] min-h-[120px]">
                {/* Room Label */}
                <div className="p-6 border-r border-slate-100 bg-slate-50/20 flex flex-col justify-center">
                  <p className="text-sm font-medium text-slate-900">{room}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Sanctuary</p>
                </div>

                {/* Day Cells */}
                {weekDays.map(day => {
                  const booking = getBookingForCell(room, day);
                  const occupied = isOccupied(room, day);
                  
                  return (
                    <div 
                      key={day.toString()}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, room)}
                      className={`relative border-r border-slate-100 last:border-r-0 p-2 transition-colors ${
                        isSameDay(day, new Date()) ? 'bg-coastal-seafoam/[0.02]' : ''
                      } ${draggingBooking ? 'hover:bg-slate-50' : ''}`}
                    >
                      {booking && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, booking)}
                          className={`absolute inset-y-2 left-2 right-[-8px] z-10 p-3 rounded-2xl shadow-lg cursor-move transition-all hover:scale-[1.02] hover:shadow-xl group
                            ${booking.status === 'confirmed' ? 'bg-emerald-50 border border-emerald-100 text-emerald-900' : 
                              booking.status === 'pending' ? 'bg-orange-50 border border-orange-100 text-orange-900' :
                              'bg-slate-50 border border-slate-200 text-slate-900'}`}
                          style={{
                            width: `calc(${differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in)) * 100}% + ${differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in)) * 1}px - 16px)`,
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-bold uppercase tracking-wider truncate">
                              {booking.customer_name}
                            </p>
                            <span className="text-[8px] uppercase font-black bg-white/50 px-1.5 py-0.5 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] opacity-70">
                            <Clock className="w-3 h-3" />
                            <span>{differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in))} Nights</span>
                          </div>

                          <div className="mt-2 flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-white/80 border border-current/10 flex items-center justify-center">
                              <User className="w-3 h-3" />
                            </div>
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
