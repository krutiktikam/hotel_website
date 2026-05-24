'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  onClose: () => void;
}

export default function DateRangePicker({ startDate, endDate, onChange, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const isDateInRange = (dateStr: string) => {
    if (!startDate || !endDate) return false;
    return dateStr > startDate && dateStr < endDate;
  };

  const isSelected = (dateStr: string) => {
    return dateStr === startDate || dateStr === endDate;
  };

  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      onChange(dateStr, '');
    } else if (dateStr < startDate) {
      onChange(dateStr, '');
    } else if (dateStr === startDate) {
      // Do nothing or clear
    } else {
      onChange(startDate, dateStr);
    }
  };

  const renderMonth = (date: Date) => {
    const { firstDay, days } = getDaysInMonth(date);
    const blanks = Array(firstDay).fill(null);
    const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);
    
    const year = date.getFullYear();
    const month = date.getMonth();

    return (
      <div className="flex-1 min-w-[300px]">
        <h4 className="font-playfair text-xl text-center mb-6 text-slate-800">{formatMonth(date)}</h4>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[10px] uppercase tracking-widest text-slate-400 font-bold py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}
          {dayNumbers.map(d => {
            const dObj = new Date(year, month, d);
            const dateStr = dObj.toISOString().split('T')[0];
            const isPast = dObj < today;
            const selected = isSelected(dateStr);
            const inRange = isDateInRange(dateStr);
            const isStart = dateStr === startDate;
            const isEnd = dateStr === endDate;

            return (
              <button
                key={dateStr}
                disabled={isPast}
                onClick={() => handleDateClick(dateStr)}
                className={`
                  aspect-square flex items-center justify-center text-sm transition-all relative
                  ${isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}
                  ${selected ? 'bg-primary text-slate-900 font-bold z-10' : ''}
                  ${inRange ? 'bg-primary/10' : ''}
                  ${isStart && endDate ? 'rounded-l-xl' : ''}
                  ${isEnd ? 'rounded-r-xl' : ''}
                  ${selected && !endDate ? 'rounded-xl' : ''}
                  ${!selected && !inRange ? 'rounded-xl' : ''}
                `}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const movePrev = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const moveNext = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-majestic shadow-2xl overflow-hidden border border-neutral/50">
        <div className="p-6 md:p-8 border-b border-neutral flex justify-between items-center bg-neutral/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-playfair text-2xl md:text-3xl text-slate-900">Select Dates</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                {startDate ? (endDate ? `${startDate} to ${endDate}` : `Selected: ${startDate} (Select end date)`) : 'Choose your arrival date'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-neutral">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-12 relative">
            {/* Desktop Navigation Buttons (Absolute) */}
            <button 
              onClick={movePrev} 
              className="absolute left-0 top-0 -translate-x-4 p-2 rounded-full hover:bg-neutral/30 transition-colors z-20 hidden md:block"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <button 
              onClick={moveNext} 
              className="absolute right-0 top-0 translate-x-4 p-2 rounded-full hover:bg-neutral/30 transition-colors z-20 hidden md:block"
            >
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </button>

            {/* Mobile Navigation (Flex between) */}
            <div className="flex justify-between items-center md:hidden mb-4">
               <button onClick={movePrev} className="p-2 rounded-full hover:bg-neutral/30 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-400" />
               </button>
               <button onClick={moveNext} className="p-2 rounded-full hover:bg-neutral/30 transition-colors">
                  <ChevronRight className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            {renderMonth(currentMonth)}
            <div className="hidden md:block w-px bg-neutral/50 mx-2" />
            <div className="hidden md:block flex-1">
              {renderMonth(nextMonth)}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-neutral bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-primary" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-primary/20" />
              <span>Stay Range</span>
            </div>
          </div>
          <button 
            disabled={!startDate || !endDate}
            onClick={onClose}
            className={`px-10 py-4 rounded-elegant font-bold uppercase tracking-widest text-xs transition-all shadow-lg
              ${!startDate || !endDate 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900 shadow-primary/20'}
            `}
          >
            Confirm Stay
          </button>
        </div>
      </div>
    </div>
  );
}
