'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

const ShoreClub = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="bg-white border-t border-coastal-beige py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-coastal-beige/20 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-coastal-seafoam/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-coastal-seafoam font-semibold">Community</span>
              <h2 className="font-playfair text-5xl text-slate-900 leading-tight">
                Join the <br /> <span className="italic text-slate-800">Shore Club</span>
              </h2>
              <p className="text-slate-500 font-light text-lg max-w-md leading-relaxed">
                Be the first to receive invitations to our seasonal retreats, exclusive minimalist design insights, and early access to new sanctuaries.
              </p>
            </div>

            <div className="w-full max-w-md ml-auto">
              {status === 'success' ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-coastal-seafoam/20 animate-in zoom-in duration-500 text-center">
                  <div className="w-12 h-12 bg-coastal-seafoam/20 rounded-full flex items-center justify-center mx-auto mb-4 text-coastal-seafoam">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-playfair text-xl text-slate-900 mb-2">Welcome to the Club</h3>
                  <p className="text-sm text-slate-500 font-light">Your journey towards serenity has begun.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-coastal-seafoam transition-colors" />
                    <input 
                      required
                      type="email" 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-transparent rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-coastal-seafoam/50 focus:outline-none transition-all shadow-sm shadow-slate-200/50 placeholder:text-slate-300 placeholder:font-light"
                    />
                  </div>
                  <button 
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                  >
                    {status === 'loading' ? 'Joining...' : (
                      <>
                        Subscribe to Retreats <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 text-center mt-4">
                    Minimal communication. Maximum inspiration.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoreClub;
