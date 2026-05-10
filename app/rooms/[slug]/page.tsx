import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { 
  Wifi, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  Maximize, 
  Users,
  Calendar,
  Waves,
  Home,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

import { API_BASE_URL, getImageUrl } from '@/lib/api';

async function getRoom(slug: string) {
  const response = await fetch(`${API_BASE_URL}/rooms/${slug}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  
  if (!room) return { title: 'Room Not Found' };

  const finalImageUrl = getImageUrl(room.image_url);

  return {
    title: `${room.name} | Namita Beach House`,
    description: room.description,
    openGraph: {
      title: room.name,
      description: room.description,
      images: [{ url: finalImageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: room.name,
      description: room.description,
      images: [finalImageUrl],
    },
  };
}

export default async function RoomDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoom(slug);

  if (!room) {
    return <div className="pt-40 text-center">Room not found.</div>;
  }

  // Icons mapping for amenities (can be expanded)
  const amenityIcons: Record<string, any> = {
    'Sea View': Waves,
    'Private Balcony': Maximize,
    'King Bed': Home,
    'Garden View': Maximize,
    'Outdoor Shower': Waves,
    'Queen Bed': Home,
    'Dune View': Maximize,
    'Work Space': Users,
  };

  const allImages = [room.image_url, ...(room.gallery_images || [])].filter(Boolean);

  return (
    <main className="pt-24 pb-20 bg-coastal-white">
      {/* Gallery Section */}
      <section className="px-6 max-w-[1400px] mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          {allImages.length > 0 ? (
            <>
              <div className="relative md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden bg-slate-100">
                <Image 
                  src={getImageUrl(allImages[0])} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover" 
                  alt={`${room.name} View 1`} 
                  priority 
                />
              </div>
              {allImages.slice(1, 3).map((img, idx) => (
                <div key={idx} className="relative md:col-span-2 rounded-[2rem] overflow-hidden bg-slate-100">
                  <Image 
                    src={getImageUrl(img)} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    className="object-cover" 
                    alt={`${room.name} View ${idx + 2}`} 
                  />
                </div>
              ))}
              {allImages.length < 3 && (
                <div className="md:col-span-2 rounded-[2rem] bg-coastal-beige/20 border border-dashed border-coastal-beige flex items-center justify-center text-slate-300 italic">
                  More views coming soon
                </div>
              )}
            </>
          ) : (
            <div className="md:col-span-4 md:row-span-2 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 font-playfair text-2xl italic">
              Sanctuary View
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-600 mb-6">
                <Link href="/rooms" className="hover:text-slate-600 transition-colors">Rooms</Link>
                <span>/</span>
                <span className="text-slate-600 font-semibold">{room.name}</span>
              </nav>
              <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">{room.name}</h1>
              
              <div className="flex flex-wrap gap-8 py-8 border-y border-coastal-beige/50">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-600 font-light">{room.guests}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-600 font-light">Coastal Inspired</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-playfair text-3xl text-slate-800">The Experience</h3>
              <p className="text-slate-600 font-light leading-relaxed text-lg italic">
                {room.description}
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="font-playfair text-3xl text-slate-800">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                {room.features.map((feature: string, idx: number) => {
                  const Icon = amenityIcons[feature] || CheckCircle2;
                  return (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 transition-colors group-hover:text-coastal-seafoam">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-slate-600 font-light">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Bar (Floating look) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-coastal-beige/30 p-10 rounded-[2.5rem] border border-coastal-beige/50 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-600 block mb-1">Price per night</span>
                  <span className="text-3xl font-playfair text-slate-900">₹{room.price}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Flexible</span>
                </div>
              </div>

              <Link 
                href={`/?room=${room.name.toUpperCase()}&book=true`}
                className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-coastal-seafoam hover:text-slate-900 transition-all shadow-xl shadow-slate-900/10 mb-4"
              >
                Reserve Your Stay
              </Link>
              
              <p className="text-[10px] text-center uppercase tracking-[0.2em] text-slate-600 font-light">
                Secure checkout with WhatsApp confirmation
              </p>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
