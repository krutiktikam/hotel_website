'use client';

import React from 'react';
import Image from 'next/image';

interface PhilosophySectionProps {
  revealed: boolean;
}

export default function PhilosophySection({ revealed }: PhilosophySectionProps) {
  return (
    <section id="philosophy" className="py-32 px-6 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] block">The Essence</span>
            <h2 className="font-playfair text-5xl md:text-6xl text-slate-900 leading-tight">
              A sanctuary built on <br /> the beauty of less.
            </h2>
            <p className="text-slate-700 font-light leading-relaxed text-lg max-w-lg">
              At Namita Beach House, we believe that true luxury isn't found in excess, but in the clarity of space and the rhythm of nature. Our architecture breathes with the ocean, our interiors mirror the dunes.
            </p>
            <div className="grid grid-cols-2 gap-10 pt-8">
                <div className="space-y-4">
                  <h4 className="font-playfair text-3xl text-slate-900">98%</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Natural Materials</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-playfair text-3xl text-slate-900">Zero</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Digital Noise</p>
                </div>
            </div>
          </div>
          <div 
          id="philosophy-image"
          className={`relative aspect-[4/5] rounded-majestic overflow-hidden shadow-2xl transition-all duration-1000 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
          >
            <Image 
              src="/images/resort/Hotel/IMG_20260327_172419.jpg" 
              alt="Coastal Essence" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover ${
                revealed ? 'animate-reveal-majestic' : ''
              }`}
            />
            <div className="absolute inset-0 bg-slate-900/10" />
          </div>
      </div>
    </section>
  );
}
