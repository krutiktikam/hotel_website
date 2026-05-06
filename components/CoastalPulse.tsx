'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Waves, Wind, Thermometer } from 'lucide-react';

const CoastalPulse = () => {
  // In a real app, these would be fetched from a weather/tide API
  const [data, setData] = useState({
    temp: 24,
    tide: 'High',
    wind: 'Gentle',
    condition: 'Sunny'
  });

  return (
    <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
      <div className="flex items-center gap-2 group transition-colors hover:text-coastal-seafoam">
        <Sun className="w-3 h-3 text-amber-400/70" />
        <span>{data.temp}°C / {data.condition}</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 group transition-colors hover:text-coastal-seafoam">
        <Waves className="w-3 h-3 text-coastal-seafoam/70" />
        <span>{data.tide} Tide</span>
      </div>

      <div className="hidden md:flex items-center gap-2 group transition-colors hover:text-coastal-seafoam">
        <Wind className="w-3 h-3 text-slate-300" />
        <span>{data.wind} Breeze</span>
      </div>
      
      <div className="w-1 h-1 bg-coastal-seafoam rounded-full animate-pulse" title="Live Pulse" />
    </div>
  );
};

export default CoastalPulse;
