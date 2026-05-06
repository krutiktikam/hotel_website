'use client';

import React, { useState } from 'react';
import { Waves, CheckCircle2, Send } from 'lucide-react';

interface BookingSummaryProps {
  hotelName?: string;
  guestName: string;
  phoneNumber: string;
  checkInDate: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  hotelName = "Azure Sands Retreat",
  guestName,
  phoneNumber,
  checkInDate
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:8000/api/v1/booking/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_name: guestName,
          phone_number: phoneNumber,
          check_in_date: checkInDate,
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-coastal-white rounded-3xl shadow-sm border border-coastal-beige/50 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-md">
      <div className="p-8">
        <h2 className="font-playfair text-3xl text-slate-800 mb-6 tracking-tight">
          {hotelName}
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">Guest</span>
            <p className="text-lg text-slate-700 font-light">{guestName}</p>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">Check-in</span>
            <p className="text-lg text-slate-700 font-light">{checkInDate}</p>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">Contact</span>
            <p className="text-lg text-slate-700 font-light">{phoneNumber}</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-coastal-seafoam/20 p-4 rounded-full mb-3">
              <Waves className="w-8 h-8 text-coastal-seafoam animate-pulse" />
            </div>
            <p className="text-coastal-seafoam font-medium flex items-center gap-2">
              Booking Confirmed! <CheckCircle2 className="w-4 h-4" />
            </p>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={status === 'loading'}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-medium tracking-wide
              ${status === 'loading' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-coastal-seafoam text-slate-800 hover:bg-opacity-90 hover:scale-[1.02]'
              } shadow-lg shadow-coastal-seafoam/20`}
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                Sending... <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
              </span>
            ) : (
              <>
                Confirm via WhatsApp <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        
        {status === 'error' && (
          <p className="text-red-400 text-xs text-center mt-3 animate-bounce">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
