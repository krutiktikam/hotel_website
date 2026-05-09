'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { fetchPricing } from '@/lib/api';

interface PricingCalendarProps {
  roomType: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

const PricingCalendar: React.FC<PricingCalendarProps> = ({ roomType, onClose, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    async function loadPricing() {
      setLoading(true);
      try {
        const data = await fetchPricing(roomType, month, year);
        setPricingData(data.daily_prices);
      } catch (err) {
        console.error('Failed to load pricing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, [roomType, month, year]);

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Calendar Grid Logic
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = pricingData.length;
  const blanks = Array(firstDayOfMonth).fill(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-coastal-beige/50">
        {/* Header */}
        <div className="p-8 border-b border-coastal-beige flex justify-between items-center bg-coastal-beige/10">
          <div>
            <h3 className="font-playfair text-3xl text-slate-900">Flexible Pricing</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Select your start date for {roomType}</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-900 shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-coastal-beige/30 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <h4 className="font-playfair text-2xl text-slate-800">{monthName} {year}</h4>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-coastal-beige/30 transition-colors">
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] uppercase tracking-widest text-slate-400 font-bold py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-coastal-seafoam" />
              <p className="text-xs uppercase tracking-widest">Consulting the tides...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square" />
              ))}
              {pricingData.map((day) => {
                const dayNum = new Date(day.date).getDate() + 1; // Correction for JS Date behavior if needed, but we'll use string slice
                const actualDay = day.date.split('-')[2];
                const isWeekend = new Date(day.date).getDay() === 5 || new Date(day.date).getDay() === 6;

                return (
                  <button
                    key={day.date}
                    disabled={!day.is_available}
                    onClick={() => onSelectDate(day.date)}
                    className={`group aspect-square rounded-2xl p-2 flex flex-col items-center justify-center transition-all border ${
                      day.is_available 
                        ? 'border-transparent hover:border-coastal-seafoam hover:bg-coastal-seafoam/5 cursor-pointer' 
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-sm font-medium mb-1">{actualDay}</span>
                    {day.is_available && (
                      <span className={`text-[9px] font-bold ${isWeekend ? 'text-coastal-seafoam' : 'text-slate-400'}`}>
                        ${day.price}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="px-8 pb-8 flex items-center gap-6 text-[10px] uppercase tracking-widest text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-coastal-seafoam" />
            <span>Weekend Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-100" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalendar;
