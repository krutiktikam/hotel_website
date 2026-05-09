'use client';

import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 bg-coastal-white">
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <MessageCircle className="w-10 h-10 text-coastal-seafoam mx-auto mb-6" />
        <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">Get in Touch</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
          Whether you have a specific request or simply wish to learn more about our sanctuaries, we are here to assist.
        </p>
      </section>

      <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 p-8 bg-coastal-beige/20 rounded-[2rem] border border-coastal-beige/50">
              <Mail className="w-6 h-6 text-slate-600" />
              <h3 className="font-playfair text-xl text-slate-900">Reservations</h3>
              <p className="text-sm text-slate-900 font-medium tracking-wide">stay@namitabeachhouse.com</p>
            </div>
            <div className="space-y-4 p-8 bg-coastal-beige/20 rounded-[2rem] border border-coastal-beige/50">
              <Phone className="w-6 h-6 text-slate-600" />
              <h3 className="font-playfair text-xl text-slate-900">Concierge</h3>
              <p className="text-sm text-slate-900 font-medium tracking-wide">+91 8766449594</p>
            </div>
            <div className="space-y-4 p-8 bg-coastal-beige/20 rounded-[2rem] border border-coastal-beige/50">
              <MapPin className="w-6 h-6 text-slate-600" />
              <h3 className="font-playfair text-xl text-slate-900">Location</h3>
              <p className="text-sm text-slate-900 font-medium tracking-wide">Tarkarli Beach, Maharashtra, India</p>
            </div>
            <div className="space-y-4 p-8 bg-coastal-beige/20 rounded-[2rem] border border-coastal-beige/50">
              <Clock className="w-6 h-6 text-slate-600" />
              <h3 className="font-playfair text-xl text-slate-900">Check-in</h3>
              <p className="text-sm text-slate-900 font-medium tracking-wide">3:00 PM / 11:00 AM</p>
            </div>          </div>

          <a 
            href="https://maps.app.goo.gl/gY61z6TKHnWAvJN88" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block aspect-video w-full rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative group cursor-pointer"
          >
             <img 
               src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover opacity-60 grayscale transition-transform duration-700 group-hover:scale-105" 
               alt="Map Placeholder"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-lg flex items-center gap-3 group-hover:bg-white transition-colors">
                  <MapPin className="w-5 h-5 text-coastal-seafoam" />
                  <span className="text-sm font-medium text-slate-800">Explore on Google Maps</span>
                </div>
             </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-coastal-beige/30">
          <h2 className="font-playfair text-3xl mb-8">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">First Name</label>
                <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Last Name</label>
                <input type="text" className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Inquiry Type</label>
              <select className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-500 appearance-none">
                <option>General Inquiry</option>
                <option>Group Bookings</option>
                <option>Event Hosting</option>
                <option>Press & Media</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Message</label>
              <textarea rows={5} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all min-h-[150px]"></textarea>
            </div>
            <button className="w-full bg-slate-900 text-white font-medium py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
