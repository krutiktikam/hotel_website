'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Waves, Menu, X, ShoppingBag } from 'lucide-react';
import CoastalPulse from './CoastalPulse';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-coastal-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Utility Bar - Hidden on scroll */}
        <div className={`transition-all duration-500 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 mb-0' : 'max-h-10 opacity-100 mt-6 mb-6'}`}>
          <div className="flex justify-between items-center">
            <CoastalPulse />
          </div>
        </div>
<div className="flex items-center justify-between gap-8">
  {/* Logo - Purely text-based for absolute minimalism */}
  <Link href="/" className="group shrink-0">
    <span className="font-playfair text-2xl tracking-[0.05em] text-slate-900 border-b-2 border-transparent group-hover:border-coastal-seafoam transition-all duration-300">
      NAMITA <span className="font-light italic text-slate-500">BEACH HOUSE</span>
    </span>
  </Link>

  {/* Desktop Navigation */}

          {/* Desktop Navigation - Hidden on smaller screens, using gap-6 for medium, gap-10 for large */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            <Link href="/rooms" className="text-sm uppercase tracking-widest text-slate-600 hover:text-coastal-seafoam transition-colors whitespace-nowrap">Rooms</Link>
            <Link href="/experiences" className="text-sm uppercase tracking-widest text-slate-600 hover:text-coastal-seafoam transition-colors whitespace-nowrap">Experiences</Link>
            <Link href="/about" className="text-sm uppercase tracking-widest text-slate-600 hover:text-coastal-seafoam transition-colors whitespace-nowrap">About</Link>
            <Link href="/gallery" className="text-sm uppercase tracking-widest text-slate-600 hover:text-coastal-seafoam transition-colors whitespace-nowrap">Gallery</Link>
            <Link href="/contact" className="text-sm uppercase tracking-widest text-slate-600 hover:text-coastal-seafoam transition-colors whitespace-nowrap">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <Link 
              href="/?book=true"
              className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 whitespace-nowrap"
            >
              Book Now
            </Link>
            
            <button 
              className="md:hidden text-slate-800 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-coastal-white border-t border-coastal-beige/50 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-xl">
          <Link href="/rooms" className="block text-lg font-playfair text-slate-800" onClick={() => setMobileMenuOpen(false)}>Rooms</Link>
          <Link href="/experiences" className="block text-lg font-playfair text-slate-800" onClick={() => setMobileMenuOpen(false)}>Experiences</Link>
          <Link href="/about" className="block text-lg font-playfair text-slate-800" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/gallery" className="block text-lg font-playfair text-slate-800" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/contact" className="block text-lg font-playfair text-slate-800" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link 
            href="/?book=true"
            className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-medium mt-4 text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
