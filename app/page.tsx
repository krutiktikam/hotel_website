'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingSummary from '@/components/BookingSummary';
import { 
  Waves, 
  Calendar, 
  User, 
  Phone, 
  Home as HomeIcon, 
  Utensils, 
  Gift, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { fetchOptions } from '@/lib/api';

function BookingFlow() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room');

  const [options, setOptions] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    checkIn: '',
    checkOut: '',
    roomType: 'DELUXE',
    mealPlan: 'Standard',
    packageType: 'Standard',
    selectedAddons: [] as string[],
    specialRequests: ''
  });
  const [loading, setLoading] = useState(true);
  const [viewers, setViewers] = useState(3);

  useEffect(() => {
    // Simulate changing viewers
    const interval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await fetchOptions();
        setOptions(data);
        if (roomParam) {
          setFormData(prev => ({ ...prev, roomType: roomParam }));
          // If a room is pre-selected, maybe skip to step 2? 
          // Let's keep it at step 1 for dates.
        }
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, [roomParam]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleAddon = (addon: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addon)
        ? prev.selectedAddons.filter(a => a !== addon)
        : [...prev.selectedAddons, addon]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Dates', icon: Calendar },
    { id: 2, title: 'Selection', icon: HomeIcon },
    { id: 3, title: 'Personalize', icon: User },
    { id: 4, title: 'Summary', icon: CheckCircle2 },
  ];

  return (
    <main className="min-h-screen bg-coastal-beige text-slate-800 font-sans pb-20">
      {/* Hero Section */}
      <div className="bg-coastal-white pt-32 pb-16 px-6 shadow-sm border-b border-coastal-beige">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Waves className="w-12 h-12 text-coastal-seafoam mb-4" />
          <h1 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-2">Secure Your Sanctuary</h1>
          <p className="text-slate-500 font-light tracking-[0.2em] uppercase text-sm">Your journey to calm begins here</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        {/* Progress Stepper */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-coastal-seafoam -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  currentStep >= step.id 
                    ? 'bg-coastal-seafoam border-coastal-seafoam text-white' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] uppercase tracking-widest mt-2 font-bold ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-coastal-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-coastal-beige/30 min-h-[500px] flex flex-col">
          
          <div className="flex-grow">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-playfair text-3xl">When will you join us?</h3>
                  <p className="text-slate-500 font-light">Select your preferred dates for a coastal retreat.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Check-in
                    </label>
                    <input 
                      required
                      type="date" 
                      value={formData.checkIn}
                      onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Check-out
                    </label>
                    <input 
                      required
                      type="date" 
                      value={formData.checkOut}
                      onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-600"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <button type="button" className="text-[10px] uppercase tracking-widest text-coastal-seafoam font-bold hover:underline">
                    View Flexible Pricing Calendar
                  </button>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Last booking 2 hours ago
                  </div>
                </div>

                <div className="bg-coastal-beige/20 p-6 rounded-3xl border border-coastal-beige/50">
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    <span className="font-semibold text-slate-900">Pro tip:</span> Most guests stay for at least 3 nights to fully experience the rhythm of the tides.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-playfair text-3xl">Choose your sanctuary</h3>
                  <p className="text-slate-500 font-light">Tailor your stay with our curated options.</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                      <HomeIcon className="w-3 h-3" /> Room Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {options?.room_types.map((room: any) => {
                        const isLowStock = room.name === 'LUXURY' || room.name === 'SUITE';
                        return (
                          <button
                            key={room.name}
                            type="button"
                            onClick={() => setFormData({...formData, roomType: room.name})}
                            className={`p-6 rounded-2xl border text-left transition-all relative ${
                              formData.roomType === room.name 
                                ? 'border-coastal-seafoam bg-coastal-seafoam/5 ring-1 ring-coastal-seafoam' 
                                : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                            }`}
                          >
                            {isLowStock && (
                              <span className="absolute -top-2 -right-2 bg-red-50 text-red-500 text-[8px] uppercase tracking-widest px-2 py-1 rounded-full font-bold border border-red-100 animate-pulse">
                                Only 2 Left
                              </span>
                            )}
                            <p className="font-medium text-slate-900">{room.name}</p>
                            <p className="text-xs text-slate-400 mt-1">From ${room.price}/night</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {formData.roomType === 'DELUXE' && (
                    <div className="bg-coastal-seafoam/5 border border-coastal-seafoam/20 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-coastal-seafoam/10 transition-all"
                      onClick={() => setFormData({...formData, roomType: 'SUITE'})}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-coastal-seafoam shadow-sm group-hover:scale-110 transition-transform">
                          <Gift className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Upgrade to Garden Villa?</p>
                          <p className="text-xs text-slate-500">Add an outdoor shower and private garden for just $50 extra.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-coastal-seafoam" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-medium bg-slate-50/50 w-fit px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {viewers} people are viewing this room right now
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                        <Utensils className="w-3 h-3" /> Meal Plan
                      </label>
                      <select 
                        value={formData.mealPlan}
                        onChange={(e) => setFormData({...formData, mealPlan: e.target.value})}
                        className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-600 appearance-none"
                      >
                        {options?.meal_plans.map((meal: any) => (
                          <option key={meal.name} value={meal.name}>{meal.name} (+${meal.price})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                        <Gift className="w-3 h-3" /> Package
                      </label>
                      <select 
                        value={formData.packageType}
                        onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                        className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-600 appearance-none"
                      >
                        {options?.packages.map((pkg: any) => (
                          <option key={pkg.name} value={pkg.name}>{pkg.name} (+${pkg.price})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-playfair text-3xl">Personal Details</h3>
                  <p className="text-slate-500 font-light">Tell us a bit about yourself and any special requests.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Cooper"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> WhatsApp Number
                    </label>
                    <input 
                      required
                      type="tel" 
                      placeholder="+15550000000"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Optional Enhancements</label>
                  <div className="flex flex-wrap gap-3">
                    {options?.addons.map((addon: any) => (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => toggleAddon(addon.name)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm ${
                          formData.selectedAddons.includes(addon.name)
                            ? 'bg-coastal-seafoam/10 border-coastal-seafoam text-slate-800 shadow-sm'
                            : 'bg-transparent border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <Plus className={`w-3 h-3 transition-transform ${formData.selectedAddons.includes(addon.name) ? 'rotate-45' : ''}`} />
                        {addon.name} (+${addon.price})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold ml-1">Special Requests</label>
                  <textarea 
                    placeholder="Any specific preferences or requirements..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all placeholder:text-slate-300 min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <BookingSummary bookingData={formData} />
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && (!formData.checkIn || !formData.checkOut)}
                className={`flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed`}
              >
                {currentStep === 3 ? 'Review Summary' : 'Next Step'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {currentStep === 4 && (
            <button 
              onClick={() => setCurrentStep(3)}
              className="mt-8 text-slate-400 text-sm hover:text-slate-600 transition-colors mx-auto"
            >
              ← Back to personal details
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    }>
      <BookingFlow />
    </Suspense>
  );
}
