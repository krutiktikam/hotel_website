'use client';

import React from 'react';
import { Waves } from 'lucide-react';

interface AvailabilityBarProps {
  isScrolled: boolean;
  onReserveClick: () => void;
}

export default function AvailabilityBar({ isScrolled, onReserveClick }: AvailabilityBarProps) {
  return (
    <div className={`fixed top-0 left-0 w-full z-[80] transition-all duration-700 transform ${
      isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-primary" />
                <span className="font-playfair text-xl text-slate-900">Namita Beach House</span>
            </div>
            <button 
              onClick={onReserveClick}
              className="px-8 py-3 bg-primary text-slate-900 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-primary/20"
            >
              Reserve Sanctuary
            </button>
          </div>
      </div>
    </div>
  );
}
