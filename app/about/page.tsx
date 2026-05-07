'use client';

import React from 'react';
import { Waves, Heart, Shield, Anchor } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-32 pb-20 bg-coastal-white">
      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <Waves className="w-12 h-12 text-coastal-seafoam mx-auto mb-6" />
        <h1 className="font-playfair text-5xl md:text-7xl text-slate-900 mb-6">Our Story</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed text-lg">
          Born from the rhythm of the tides and the silence of the dunes, Azure Sands is more than a hotel—it is a sanctuary for the minimalist soul.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200" 
            alt="Hotel Architecture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-8">
          <h2 className="font-playfair text-4xl text-slate-800">The Coastal Philosophy</h2>
          <p className="text-slate-600 font-light leading-relaxed text-lg">
            We believe that luxury shouldn't be loud. It should be found in the texture of raw linen, the sound of the morning surf, and the absence of digital noise. 
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-coastal-beige flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Mindful Service</h4>
                <p className="text-sm text-slate-500 font-light mt-1">We anticipate your needs before they become requests, ensuring a seamless flow to your day.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-coastal-beige flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Sustainable Luxury</h4>
                <p className="text-sm text-slate-500 font-light mt-1">From solar-powered cooling to organic local sourcing, we protect the shore we call home.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-coastal-beige/30 py-24 px-6 border-y border-coastal-beige/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Anchor className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="font-playfair text-4xl text-slate-800 italic">"Simplicity is the ultimate sophistication."</h2>
          <p className="text-slate-500 font-light leading-relaxed max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
            Join us where the horizon meets the shore.
          </p>
        </div>
      </section>
    </main>
  );
}
