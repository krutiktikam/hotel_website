'use client';

import React, { useState } from 'react';
import { Waves, CheckCircle2, CreditCard, Calendar, User, Home, Utensils, Gift, PlusCircle, Phone, ShieldCheck, Zap } from 'lucide-react';
import { createBooking, createCheckoutSession } from '@/lib/api';

interface BookingData {
  customerName: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  mealPlan: string;
  packageType: string;
  selectedAddons: string[];
  specialRequests: string;
}

interface BookingSummaryProps {
  bookingData: BookingData;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingResponse, setBookingResponse] = useState<any>(null);

  const handleConfirmAndPay = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      // 1. Create Booking in Python Backend
      const response = await createBooking(bookingData);
      setBookingResponse(response);
      
      // 2. Set Success State
      setStatus('success');
      
      // Optional: Redirect to a success page after a delay
      // setTimeout(() => {
      //   window.location.href = '/success';
      // }, 3000);
      
    } catch (error: any) {
      console.error('Booking failed:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full bg-coastal-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-coastal-beige/30 overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <h2 className="font-playfair text-4xl text-slate-900">Summary of your stay</h2>
          <div className="flex items-center gap-2 bg-coastal-seafoam/10 text-coastal-seafoam px-4 py-2 rounded-full border border-coastal-seafoam/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Best Price Guaranteed</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Guest Details */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-slate-100 pb-2">Guest Details</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-slate-800 font-light">{bookingData.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Check-in / Out</p>
                  <p className="text-slate-800 font-light">{bookingData.checkIn} — {bookingData.checkOut}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-slate-100 pb-2">Stay Details</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Room Type</p>
                  <p className="text-slate-800 font-light">{bookingData.roomType}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Meal Plan</p>
                  <p className="text-slate-800 font-light">{bookingData.mealPlan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extras & Requests */}
        {(bookingData.selectedAddons.length > 0 || bookingData.specialRequests) && (
          <div className="bg-slate-50/50 rounded-3xl p-8 mb-12 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bookingData.selectedAddons.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Enhancements</p>
                  <ul className="space-y-2">
                    {bookingData.selectedAddons.map(addon => (
                      <li key={addon} className="flex items-center gap-2 text-sm text-slate-600 font-light">
                        <PlusCircle className="w-3 h-3 text-coastal-seafoam" /> {addon}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bookingData.specialRequests && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Special Requests</p>
                  <p className="text-sm text-slate-500 font-light italic leading-relaxed">"{bookingData.specialRequests}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-500 text-center">
            <div className="bg-coastal-seafoam/20 p-6 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-coastal-seafoam" />
            </div>
            <h3 className="text-2xl font-playfair text-slate-900 mb-2">Booking Confirmed!</h3>
            <p className="text-slate-500 font-light mb-8">Your sanctuary is reserved. To finalize your stay details with our concierge, please click below.</p>
            
            <a
              href={`https://wa.me/918766449594?text=${encodeURIComponent(
                `🌊 *Namita Beach House | Sanctuary Confirmation*\n\n` +
                `Warm greetings ${bookingData.customerName},\n\n` +
                `Your retreat is officially reserved. We are preparing the ${bookingData.roomType} for your arrival.\n\n` +
                `📅 *Stay Details:*\n` +
                `• Check-in: ${bookingData.checkIn}\n` +
                `• Check-out: ${bookingData.checkOut}\n\n` +
                `💳 *Investment Summary:*\n` +
                `• Total Stay: $${(bookingResponse?.total_price || 0).toFixed(2)}\n` +
                `• Required 10% Deposit: $${((bookingResponse?.total_price || 0) * 0.10).toFixed(2)}\n\n` +
                `Next Steps: Please provide a screenshot of your deposit to this chat to finalize your check-in rituals.\n\n` +
                `See you where the horizon meets the shore.\n` +
                `---`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 rounded-2xl bg-[#25D366] text-white flex items-center justify-center gap-3 transition-all hover:bg-[#22c35e] shadow-xl shadow-green-500/20 font-medium"
            >
              <Phone className="w-5 h-5" /> Finalize on WhatsApp
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleConfirmAndPay}
              disabled={status === 'loading'}
              className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 font-medium text-lg
                ${status === 'loading' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.01] shadow-2xl shadow-slate-900/20'
                }`}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-3">
                  Processing stay... <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                </span>
              ) : (
                <>
                  Confirm & Pay <CreditCard className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="flex justify-center items-center gap-8 py-4 opacity-50">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                <ShieldCheck className="w-3 h-3" /> Secure SSL
              </div>
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                <Zap className="w-3 h-3" /> Instant Confirm
              </div>
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                <CreditCard className="w-3 h-3" /> No Hidden Fees
              </div>
            </div>
            <p className="text-[10px] text-center uppercase tracking-[0.2em] text-slate-400 font-light mt-4">
              Secure checkout • WhatsApp confirmation • Instant booking
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
            <p className="text-red-500 text-xs text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
