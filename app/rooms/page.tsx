'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Wind, Droplets } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/rooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        }
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">Our Sanctuaries</h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Each room is a canvas of calm, designed with natural textures and a palette that echoes the shore.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room) => (
            <div key={room.id} className="group flex flex-col bg-coastal-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-coastal-beige/30">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={room.image_url} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-coastal-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-slate-800">
                  From ${room.price}
                </div>
                {/* Randomly simulate scarcity if not in DB yet */}
                <div className="absolute bottom-6 left-6 bg-red-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white animate-pulse">
                  {room.id === 1 ? 'Only 1 Sanctuary Left' : 'High Demand'}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-coastal-seafoam animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{10 + room.id} people viewing now</span>
                </div>
                <h2 className="font-playfair text-2xl text-slate-900 mb-3">{room.name}</h2>
                <p className="text-slate-500 font-light text-sm mb-6 flex-1">{room.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {room.features.map((f: string) => (
                    <span key={f} className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{f}</span>
                  ))}
                </div>

                <Link 
                  href={`/rooms/${room.slug}`}
                  className="inline-flex items-center justify-between w-full text-slate-800 font-medium group/btn"
                >
                  Explore Details 
                  <span className="w-10 h-10 rounded-full bg-coastal-beige flex items-center justify-center transition-all group-hover/btn:bg-coastal-seafoam">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
