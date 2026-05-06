'use client';

import { useState } from 'react';
import BookingSummary from '@/components/BookingSummary';
import { Waves } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    guestName: '',
    phoneNumber: '',
    checkInDate: '',
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  return (
    <main className="min-h-screen bg-coastal-beige text-slate-800 font-sans">
      {/* Decorative Wave Header */}
      <div className="bg-coastal-white py-12 px-6 shadow-sm border-b border-coastal-beige">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Waves className="w-12 h-12 text-coastal-seafoam mb-4" />
          <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-2">Azure Sands</h1>
          <p className="text-slate-500 font-light tracking-[0.2em] uppercase text-sm">Coastal Minimalism</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Introduction */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h2 className="font-playfair text-4xl text-slate-800">Your retreat awaits.</h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              Experience the harmony of sea and shore. Our minimalist sanctuaries are designed 
              to bring you closer to nature, providing a peaceful escape from the everyday.
            </p>
          </div>
          
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <img 
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800" 
              alt="Beach House Interior" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Booking Interaction */}
        <div className="flex-1 w-full max-w-md">
          {!showSummary ? (
            <div className="bg-coastal-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-coastal-beige/30">
              <h3 className="font-playfair text-2xl mb-8">Plan your stay</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Cooper"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-1">WhatsApp Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-1">Check-in Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-600"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-medium py-5 rounded-2xl transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 mt-4"
                >
                  Continue to Summary
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <BookingSummary 
                hotelName="Azure Sands"
                guestName={formData.guestName}
                phoneNumber={formData.phoneNumber}
                checkInDate={formData.checkInDate}
              />
              <button 
                onClick={() => setShowSummary(false)}
                className="w-full text-slate-400 text-sm mt-6 hover:text-slate-600 transition-colors"
              >
                ← Back to edit details
              </button>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
