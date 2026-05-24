'use client';

import React from 'react';
import { Waves, ChevronRight } from 'lucide-react';
import BookingFlow from '@/components/BookingFlow';

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  options: any;
  loading: boolean;
}

export default function ReservationDrawer({ isOpen, onClose, options, loading }: ReservationDrawerProps) {
  return (
    <div 
      className={`fixed inset-0 z-[100] transition-all duration-500 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
    >
        {/* Backdrop */}
        <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        />
        
        {/* Drawer Content */}
        <div 
        className={`absolute top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-neutral shadow-2xl transition-transform duration-700 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
        >
          <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <Waves className="w-8 h-8 text-primary" />
                    <h2 className="font-playfair text-3xl text-slate-900">Reserve Your Room</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-slate-600" />
                </button>
              </div>
              
              <div className="animate-in fade-in slide-in-from-right-10 duration-700 delay-300">
                <BookingFlow options={options} loading={loading} />
              </div>
          </div>
        </div>
    </div>
  );
}
