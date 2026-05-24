'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchOptions } from '@/lib/api';

// Modular Components
import HeroSection from '@/components/home/HeroSection';
import PhilosophySection from '@/components/home/PhilosophySection';
import AvailabilityBar from '@/components/home/AvailabilityBar';
import ReservationDrawer from '@/components/home/ReservationDrawer';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [philosophyRevealed, setPhilosophyRevealed] = useState(false);
  const [options, setOptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await fetchOptions();
        setOptions(data);
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setIsBookingOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhilosophyRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const target = document.getElementById('philosophy-image');
    if (target) observer.observe(target);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => {
    setIsBookingOpen(false);
    // Clear the query param if it exists so clicking 'Book Now' works again
    if (searchParams.get('book') === 'true') {
      router.replace('/', { scroll: false });
    }
  };
  const scrollToPhilosophy = () => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="bg-surface font-sans overflow-x-hidden relative">
      
      <AvailabilityBar 
        isScrolled={isScrolled} 
        onReserveClick={openBooking} 
      />

      <HeroSection 
        onReserveClick={openBooking} 
        onPhilosophyClick={scrollToPhilosophy} 
      />

      <PhilosophySection 
        revealed={philosophyRevealed} 
      />

      <ReservationDrawer 
        isOpen={isBookingOpen} 
        onClose={closeBooking} 
        options={options} 
        loading={loading} 
      />

      {/* Footer Teaser */}
      <section className="py-20 text-center bg-surface border-t border-neutral/50">
          <p className="text-slate-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-8 italic">Stay in the rhythm of the tides</p>
          <button 
            onClick={openBooking}
            className="text-slate-900 font-playfair text-4xl hover:text-primary transition-colors underline underline-offset-8"
          >
            Begin Your Journey
          </button>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
