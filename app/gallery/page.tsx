'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera, Maximize2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch(`${API_BASE_URL}/gallery`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-coastal-white">
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <Camera className="w-10 h-10 text-coastal-seafoam mx-auto mb-6" />
        <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">Atmosphere</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-light tracking-widest uppercase text-xs">
          Visual glimpses of the Namita Beach House experience.
        </p>
      </section>

      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`group relative rounded-[2rem] overflow-hidden bg-slate-100 transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 ${img.span_class || ''}`}
            >
              <Image 
                src={img.url} 
                alt={img.category} 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white text-xs uppercase tracking-[0.3em] font-bold">{img.category}</span>
                </div>
              </div>
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-32 text-center py-20 bg-coastal-beige/20 border-t border-coastal-beige/50">
        <p className="text-slate-400 font-playfair italic text-lg mb-8">Follow our journey on social for daily tides.</p>
        <button className="px-10 py-4 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-all text-sm font-medium">
          @NAMITABEACHHOUSE
        </button>
      </section>
    </main>
  );
}
