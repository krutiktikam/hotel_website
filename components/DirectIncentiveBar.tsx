'use client';

import React from 'react';
import { ShieldCheck, Zap, Gift, X } from 'lucide-react';

const DirectIncentiveBar = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 text-white py-2.5 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[11px] uppercase tracking-[0.15em] font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-coastal-seafoam" />
          <span>Best Price Guaranteed</span>
        </div>
        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-coastal-seafoam" />
          <span>Priority Concierge Access</span>
        </div>
        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-coastal-seafoam" />
          <span>Complimentary Sunset Welcome Drink</span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DirectIncentiveBar;
