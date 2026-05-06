'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Wind, Droplets } from 'lucide-react';

const rooms = [
  {
    id: 'ocean-suite',
    name: 'Ocean Front Suite',
    description: 'Panoramic views of the Atlantic with a private terrace.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    features: ['Sea View', 'Private Balcony', 'King Bed']
  },
  {
    id: 'garden-villa',
    name: 'Coastal Garden Villa',
    description: 'Secluded villa surrounded by native flora and salt air.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    features: ['Garden View', 'Outdoor Shower', 'Queen Bed']
  },
  {
    id: 'dune-studio',
    name: 'Sand Dune Studio',
    description: 'Minimalist studio perfect for solo retreats or couples.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    features: ['Dune View', 'Work Space', 'Queen Bed']
  }
];

const RoomsPage = () => {
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
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-coastal-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-slate-800">
                  From ${room.price}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="font-playfair text-2xl text-slate-900 mb-3">{room.name}</h2>
                <p className="text-slate-500 font-light text-sm mb-6 flex-1">{room.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {room.features.map(f => (
                    <span key={f} className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{f}</span>
                  ))}
                </div>

                <Link 
                  href={`/rooms/${room.id}`}
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
};

export default RoomsPage;
