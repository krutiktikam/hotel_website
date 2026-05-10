'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import Image from 'next/image';
import { Sunrise, Palmtree, Anchor, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, any> = {
  'Sunrise': Sunrise,
  'Palmtree': Palmtree,
  'Anchor': Anchor
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [expRes, spotRes] = await Promise.all([
          fetch(`${API_BASE_URL}/experiences`),
          fetch(`${API_BASE_URL}/local-spots`)
        ]);
        
        if (expRes.ok) setExperiences(await expRes.json());
        if (spotRes.ok) setSpots(await spotRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-coastal-beige">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-coastal-seafoam font-semibold">Lifestyle</span>
          <h1 className="font-playfair text-5xl md:text-7xl text-slate-900 italic">Curated Moments</h1>
          <p className="max-w-2xl mx-auto text-slate-700 font-light leading-relaxed">
            Beyond the sanctuary of your room, we invite you to immerse yourself in the rhythm of the shore through our bespoke experiences.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-32">
          {experiences.map((exp: any, index: number) => (
            <div 
              key={exp.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
            >
              {/* Image Container */}
              <div className="flex-1 w-full group">
                <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 transition-all duration-700 hover:shadow-coastal-seafoam/10">
                  {exp.image_url ? (
                    <Image 
                      src={exp.image_url.startsWith('http') ? exp.image_url : encodeURI(exp.image_url)} 
                      alt={exp.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-600">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/5 transition-opacity group-hover:opacity-0" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-8 max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-coastal-seafoam">
                    {(() => {
                      const Icon = iconMap[exp.icon_name] || Compass;
                      return <Icon className="w-5 h-5" />;
                    })()}
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
                    <span className="text-[10px] uppercase tracking-widest text-slate-600">Investment</span>
                    <p className="font-medium text-slate-800">₹{exp.price}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600">Duration</span>
                    <p className="font-medium text-slate-800">{exp.duration}</p>
                  </div>
                </div>

                <Link 
                  href="/contact"
                  className="group/btn inline-flex items-center gap-4 text-slate-900 font-medium"
                >
                  Add to your stay
                  <span className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover/btn:bg-slate-900 group-hover/btn:text-white group-hover/btn:border-slate-900">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Local Geography Map */}
        <div className="mt-40 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-coastal-seafoam font-bold tracking-[0.3em] uppercase text-[10px]">Geography</span>
            <h2 className="font-playfair text-5xl text-slate-900 italic">Between Shore & Sky</h2>
            <p className="max-w-xl mx-auto text-slate-700 font-light">
              Explore the curated locale surrounding our sanctuary. All points are easily accessible by foot or via our house bicycle rituals.
            </p>
          </div>

          <div className="relative aspect-[21/9] rounded-[4rem] bg-coastal-white overflow-hidden border border-coastal-beige/50 group shadow-xl">
            {/* Minimalist SVG Map */}
            <svg viewBox="0 0 1200 500" className="w-full h-full opacity-80">
              <path d="M0,420 Q300,380 600,450 T1200,410 L1200,500 L0,500 Z" fill="#9FE2BF" opacity="0.1" />
              <circle cx="600" cy="250" r="150" fill="none" stroke="#9FE2BF" strokeWidth="0.5" strokeDasharray="10 10" className="animate-spin-slow" />
              
              {/* Hotel Hub */}
              <circle cx="600" cy="250" r="4" fill="#0f172a" />
              <text x="615" y="255" className="text-[12px] font-bold uppercase tracking-widest fill-slate-900">Namita Beach House</text>
              
              {/* Activity Points */}
              {spots.map((point: any, i: number) => (
                <a 
                  key={point.id} 
                  href={point.google_maps_url || '#'} 
                  target={point.google_maps_url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group/point cursor-pointer"
                >
                  <circle cx={point.x_pos} cy={point.y_pos} r="3" fill="#9FE2BF" className="transition-all group-hover/point:r-5" />
                  <text x={point.x_pos + 10} y={point.y_pos + 5} className="text-[10px] uppercase tracking-widest fill-slate-400 group-hover/point:fill-slate-900 transition-colors">
                    {point.name} <tspan className="fill-coastal-seafoam font-bold ml-2">({point.distance})</tspan>
                  </text>
                  <line x1="600" y1="250" x2={point.x_pos} y2={point.y_pos} stroke="#9FE2BF" strokeWidth="0.5" strokeDasharray="5 5" className="opacity-0 group-hover/point:opacity-40 transition-opacity" />
                  {point.google_maps_url && (
                    <g className="opacity-0 group-hover/point:opacity-100 transition-opacity">
                       <rect x={point.x_pos + 10} y={point.y_pos + 10} width="90" height="20" rx="10" fill="white" filter="drop-shadow(0 2px 4px rgb(0 0 0 / 0.1))" />
                       <text x={point.x_pos + 18} y={point.y_pos + 23} className="text-[8px] fill-coastal-seafoam font-bold">VIEW ON GOOGLE MAPS</text>
                    </g>
                  )}
                </a>
              ))}
            </svg>

            {/* Floating Distance Legend */}
            <div className="absolute top-8 right-8 bg-white/60 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/40">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 mb-3">House Rituals</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-coastal-seafoam" />
                  <span className="text-[10px] text-slate-600 tracking-wider">Walking Distance (&lt;1km)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="text-[10px] text-slate-600 tracking-wider">Bicycle Journey (&gt;1km)</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-slate-900/5 backdrop-blur-sm p-6 flex justify-center gap-12 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-coastal-seafoam" />
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Coordinates: 16.0352° N, 73.4682° E</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-40 bg-coastal-white p-16 rounded-[4rem] text-center shadow-sm border border-coastal-beige/50">
          <h2 className="font-playfair text-4xl text-slate-900 mb-6 italic">Tailor your retreat</h2>
          <p className="text-slate-700 mb-10 max-w-xl mx-auto font-light">
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
}
