'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  Wifi, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  Maximize, 
  Users,
  Calendar,
  Waves
} from 'lucide-react';
import Link from 'next/link';

// Mock data for rooms
const roomsData: Record<string, any> = {
  'ocean-suite': {
    name: 'Ocean Front Suite',
    price: 450,
    size: '65m²',
    guests: '2 Adults',
    description: 'Our premier suite offers an unobstructed view of the horizon. Designed with floor-to-ceiling windows and a private teak-wood terrace, it invites the rhythm of the ocean into your living space.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: [
      { icon: Wifi, name: 'Complimentary High-speed WiFi' },
      { icon: Coffee, name: 'Premium Espresso Machine' },
      { icon: Wind, name: 'Climate Control' },
      { icon: Waves, name: 'Ocean View' },
      { icon: ShieldCheck, name: 'In-room Safe' }
    ]
  },
  'garden-villa': {
    name: 'Coastal Garden Villa',
    price: 380,
    size: '80m²',
    guests: '2-4 Adults',
    description: 'A sanctuary of privacy. This villa is nestled within our salt-resistant gardens, featuring an outdoor rain shower and a curated selection of organic bath rituals.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512918766674-ed62b9a19c65?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: [
      { icon: Wifi, name: 'Complimentary High-speed WiFi' },
      { icon: Coffee, name: 'Organic Tea Selection' },
      { icon: Wind, name: 'Natural Ventilation' },
      { icon: Maximize, name: 'Private Garden' },
      { icon: ShieldCheck, name: 'In-room Safe' }
    ]
  },
  'dune-studio': {
    name: 'Sand Dune Studio',
    price: 290,
    size: '45m²',
    guests: '2 Adults',
    description: 'Simplicity refined. The studio captures the essence of coastal minimalism with neutral tones, linen textiles, and a focused workspace looking out onto the dunes.',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: [
      { icon: Wifi, name: 'Complimentary High-speed WiFi' },
      { icon: Coffee, name: 'French Press' },
      { icon: Wind, name: 'Ocean Breeze' },
      { icon: Users, name: 'Work Desk' },
      { icon: ShieldCheck, name: 'In-room Safe' }
    ]
  }
};

const RoomDetails = () => {
  const params = useParams();
  const slug = params.slug as string;
  const room = roomsData[slug];

  if (!room) {
    return <div className="pt-40 text-center">Room not found.</div>;
  }

  return (
    <main className="pt-24 pb-20 bg-coastal-white">
      {/* Gallery Section */}
      <section className="px-6 max-w-[1400px] mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden">
            <img src={room.images[0]} className="w-full h-full object-cover" alt="Main View" />
          </div>
          <div className="md:col-span-2 rounded-[2rem] overflow-hidden">
            <img src={room.images[1]} className="w-full h-full object-cover" alt="Detail View" />
          </div>
          <div className="md:col-span-2 rounded-[2rem] overflow-hidden">
            <img src={room.images[2]} className="w-full h-full object-cover" alt="Bathroom View" />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 mb-6">
                <Link href="/rooms" className="hover:text-slate-600 transition-colors">Rooms</Link>
                <span>/</span>
                <span className="text-slate-600 font-semibold">{room.name}</span>
              </nav>
              <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">{room.name}</h1>
              
              <div className="flex flex-wrap gap-8 py-8 border-y border-coastal-beige/50">
                <div className="flex items-center gap-3">
                  <Maximize className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-600 font-light">{room.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-600 font-light">{room.guests}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-slate-400" />
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
                {room.amenities.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-colors group-hover:text-coastal-seafoam">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-600 font-light">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Bar (Floating look) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-coastal-beige/30 p-10 rounded-[2.5rem] border border-coastal-beige/50 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Price per night</span>
                  <span className="text-3xl font-playfair text-slate-900">${room.price}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Flexible</span>
                </div>
              </div>

              <Link 
                href="/"
                className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 mb-4"
              >
                Reserve Your Stay
              </Link>
              
              <p className="text-[10px] text-center uppercase tracking-[0.2em] text-slate-400 font-light">
                Secure checkout with WhatsApp confirmation
              </p>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
};

export default RoomDetails;
