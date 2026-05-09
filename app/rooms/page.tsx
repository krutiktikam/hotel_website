import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Our Sanctuaries | Namita Beach House',
  description: 'Explore our minimalist, coastal-inspired suites and villas in Tarkarli. Each room is a canvas of calm designed for the minimalist soul.',
  openGraph: {
    title: 'Our Sanctuaries | Namita Beach House',
    description: 'Minimalist luxury rooms in Tarkarli.',
    images: ['/images/resort/Hotel/WhatsApp Image 2026-05-08 at 8.43.20 PM.jpeg'],
  }
};

async function getRooms() {
  const response = await fetch(`${API_BASE_URL}/rooms`, { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}

export default async function RoomsPage() {
  const rooms = await getRooms();

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
          {rooms.map((room: any) => (
            <div key={room.id} className="group flex flex-col bg-coastal-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-coastal-beige/30">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={room.image_url} 
                  alt={room.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
