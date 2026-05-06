'use client';

import React from 'react';
import { Compass, Sunrise, Palmtree, Anchor, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const experiences = [
  {
    id: 'sunrise-yoga',
    title: 'Sunrise Shore Yoga',
    category: 'Wellness',
    description: 'Begin your day in harmony with the tides. Our guided yoga sessions take place on the private north beach as the sun breaks the horizon.',
    duration: '90 Minutes',
    price: '45',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
    icon: Sunrise
  },
  {
    id: 'beach-picnic',
    title: 'Minimalist Beach Picnic',
    category: 'Dining',
    description: 'A curated basket of local, organic delicacies served on linen blankets. Includes chilled sparkling water and a selection of coastal fruits.',
    duration: 'Flexible',
    price: '120',
    image: 'https://images.unsplash.com/photo-1590377033320-911075d97039?auto=format&fit=crop&q=80&w=1000',
    icon: Palmtree
  },
  {
    id: 'sunset-sail',
    title: 'Private Azure Sail',
    category: 'Adventure',
    description: 'A serene journey across the coastline on our custom-built wooden skiff. Witness the sky transform from seafoam to deep indigo.',
    duration: '3 Hours',
    price: '350',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000',
    icon: Anchor
  }
];

const ExperiencesPage = () => {
  return (
    <main className="pt-32 pb-20 bg-coastal-beige">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-coastal-seafoam font-semibold">Lifestyle</span>
          <h1 className="font-playfair text-5xl md:text-7xl text-slate-900 italic">Curated Moments</h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-light leading-relaxed">
            Beyond the sanctuary of your room, we invite you to immerse yourself in the rhythm of the shore through our bespoke experiences.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-32">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
            >
              {/* Image Container */}
              <div className="flex-1 w-full group">
                <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 transition-all duration-700 hover:shadow-coastal-seafoam/10">
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 transition-opacity group-hover:opacity-0" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-8 max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-coastal-seafoam">
                    <exp.icon className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-bold">{exp.category}</span>
                  </div>
                  <h2 className="font-playfair text-4xl md:text-5xl text-slate-900 leading-tight">
                    {exp.title}
                  </h2>
                  <p className="text-slate-600 font-light leading-relaxed text-lg">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center gap-12 py-6 border-y border-white/50">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Investment</span>
                    <p className="font-medium text-slate-800">${exp.price}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Duration</span>
                    <p className="font-medium text-slate-800">{exp.duration}</p>
                  </div>
                </div>

                <button className="group/btn inline-flex items-center gap-4 text-slate-900 font-medium">
                  Add to your stay
                  <span className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover/btn:bg-slate-900 group-hover/btn:text-white group-hover/btn:border-slate-900">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-40 bg-coastal-white p-16 rounded-[4rem] text-center shadow-sm border border-coastal-beige/50">
          <h2 className="font-playfair text-4xl text-slate-900 mb-6 italic">Tailor your retreat</h2>
          <p className="text-slate-500 mb-10 max-w-xl mx-auto font-light">
            Our concierge is available via WhatsApp to arrange private, custom itineraries based on your preferences.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-coastal-seafoam text-slate-800 px-10 py-5 rounded-2xl font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-coastal-seafoam/20"
          >
            Connect with Concierge
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ExperiencesPage;
