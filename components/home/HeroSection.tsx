'use client';

import React from 'react';
import Image from 'next/image';
import { Waves } from 'lucide-react';

interface HeroSectionProps {
  onReserveClick: () => void;
  onPhilosophyClick: () => void;
}

export default function HeroSection({ onReserveClick, onPhilosophyClick }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/resort/Hotel/IMG20241204150237.jpg" 
          alt="Panoramic Coastal View"
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover animate-slow-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-neutral" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <Waves className="w-16 h-16 text-white/80 mx-auto mb-8 animate-pulse" />
        <h1 className="font-playfair text-6xl md:text-8xl text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
          Where Silence <br className="hidden md:block" /> Meets the Sea
        </h1>
        <p className="text-white/90 font-light tracking-[0.3em] uppercase text-sm mb-12 max-w-2xl mx-auto leading-loose">
          Experience the art of coastal minimalism. <br /> A sanctuary for the soul, a rhythm for the heart.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button 
            onClick={onReserveClick}
            className="px-12 py-5 bg-primary text-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all shadow-2xl tracking-widest uppercase text-xs"
          >
            Reserve Your Room
          </button>
          <button 
            onClick={onPhilosophyClick}
            className="px-12 py-5 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all backdrop-blur-md tracking-widest uppercase text-xs"
          >
            Our Philosophy
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold rotate-90 mb-8">Scroll</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
