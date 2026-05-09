'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
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
import PricingCalendar from '@/components/PricingCalendar';
import { fetchOptions } from '@/lib/api';

function BookingFlow({ options, loading: optionsLoading }: { options: any, loading: boolean }) {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room');

  const [currentStep, setCurrentStep] = useState(1);
  const [showPricingCalendar, setShowPricingCalendar] = useState(false);
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
  const [viewers, setViewers] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate changing viewers
    const interval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roomParam) {
      setFormData(prev => ({ ...prev, roomType: roomParam }));
    }
  }, [roomParam]);

  useEffect(() => {
    async function updateAvailability() {
      if (formData.checkIn && formData.checkOut) {
        setCheckingAvailability(true);
        try {
          const { checkAvailability } = await import('@/lib/api');
          const results: Record<string, boolean> = {};
          
          if (options?.room_types) {
            await Promise.all(options.room_types.map(async (room: any) => {
              const res = await checkAvailability({
                room_type: room.name,
                check_in: formData.checkIn,
                check_out: formData.checkOut
              });
              results[room.name] = res.is_available;
            }));
            setAvailability(results);
          }
        } catch (err) {
          console.error('Failed to check availability:', err);
        } finally {
          setCheckingAvailability(false);
        }
      }
    }
    updateAvailability();
  }, [formData.checkIn, formData.checkOut, options]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const validateStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.checkIn || !formData.checkOut) {
        setError('Please select both check-in and check-out dates.');
        return false;
      }
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (checkOutDate <= checkInDate) {
        setError('Check-out date must be after check-in date.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.customerName.trim()) {
        setError('Please provide your name.');
        return false;
      }
      const phoneDigits = formData.customerPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setError('Please provide a valid 10-digit phone number.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleAddon = (addon: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addon)
        ? prev.selectedAddons.filter(a => a !== addon)
        : [...prev.selectedAddons, addon]
    }));
  };

  if (optionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <div className="min-h-[500px] flex flex-col">
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
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] uppercase tracking-widest mt-2 font-bold ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-600'}`}>
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
                <p className="text-slate-700 font-light">Select your preferred dates for a coastal retreat.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Check-in
                  </label>
                  <input 
                    required
                    type="date" 
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium"
                  />

                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Check-out
                  </label>
                  <input 
                    required
                    type="date" 
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium"
                  />

                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <button 
                  type="button" 
                  onClick={() => setShowPricingCalendar(true)}
                  className="text-[10px] uppercase tracking-widest text-coastal-seafoam font-bold hover:underline"
                >
                  View Flexible Pricing Calendar
                </button>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Last booking 2 hours ago
                </div>
              </div>

              <div className="bg-coastal-beige/20 p-6 rounded-3xl border border-coastal-beige/50">
                <p className="text-sm text-slate-700 font-light leading-relaxed">
                  <span className="font-semibold text-slate-900">Pro tip:</span> Most guests stay for at least 3 nights to fully experience the rhythm of the tides.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="space-y-2">
                <h3 className="font-playfair text-3xl">Choose your sanctuary</h3>
                <p className="text-slate-700 font-light">Tailor your stay with our curated options.</p>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                    <HomeIcon className="w-3 h-3" /> Room Type 
                    {checkingAvailability && <span className="ml-2 animate-pulse text-coastal-seafoam normal-case tracking-normal font-light">Verifying availability...</span>}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {options?.room_types.map((room: any) => {
                      const isLowStock = room.name === 'LUXURY' || room.name === 'SUITE';
                      const isAvailable = availability[room.name] !== false;
                      return (
                        <button
                          key={room.name}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setFormData({...formData, roomType: room.name})}
                          className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col gap-4 ${
                            !isAvailable 
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : formData.roomType === room.name 
                                ? 'border-coastal-seafoam bg-coastal-seafoam/5 ring-1 ring-coastal-seafoam shadow-md shadow-coastal-seafoam/5' 
                                : 'border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-white'
                          }`}
                        >
                          {room.image_url && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                              <Image 
                                src={room.image_url.startsWith('http') ? room.image_url : encodeURI(room.image_url)} 
                                alt={room.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 20vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="px-2 pb-2">
                            {!isAvailable && (
                              <span className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl z-10">
                                <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Sold Out</span>
                              </span>
                            )}
                            {isLowStock && isAvailable && (
                              <span className="absolute top-2 right-2 bg-red-50 text-red-500 text-[8px] uppercase tracking-widest px-2 py-1 rounded-full font-bold border border-red-100 animate-pulse z-10">
                                Only 2 Left
                              </span>
                            )}
                            <p className="font-medium text-slate-900">{room.name}</p>
                            <p className="text-xs text-slate-600 mt-1">From ${room.price}/night</p>
                          </div>
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
                        <p className="text-xs text-slate-700">Add an outdoor shower and private garden for just $50 extra.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-coastal-seafoam" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-600 font-medium bg-slate-50/50 w-fit px-4 py-2 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {viewers} people are viewing this room right now
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                      <Utensils className="w-3 h-3" /> Meal Plan
                    </label>
                    <select 
                      value={formData.mealPlan}
                      onChange={(e) => setFormData({...formData, mealPlan: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium appearance-none"
                    >

                      {options?.meal_plans.map((meal: any) => (
                        <option key={meal.name} value={meal.name}>{meal.name} (+${meal.price})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                      <Gift className="w-3 h-3" /> Package
                    </label>
                    <select 
                      value={formData.packageType}
                      onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                      className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium appearance-none"
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
                <p className="text-slate-700 font-light">Tell us a bit about yourself and any special requests.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Cooper"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1 flex items-center gap-2">
                    <Phone className="w-3 h-3" /> WhatsApp Number
                  </label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+15550000000"
                    value={formData.customerPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow only numbers and '+'
                      const cleaned = val.replace(/[^0-9+]/g, '');
                      setFormData({...formData, customerPhone: cleaned});
                    }}
                    className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1">Optional Enhancements</label>
                <div className="flex flex-wrap gap-3">
                  {options?.addons.map((addon: any) => (
                    <button
                      key={addon.name}
                      type="button"
                      onClick={() => toggleAddon(addon.name)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm ${
                        formData.selectedAddons.includes(addon.name)
                          ? 'bg-coastal-seafoam/10 border-coastal-seafoam text-slate-800 shadow-sm'
                          : 'bg-transparent border-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <Plus className={`w-3 h-3 transition-transform ${formData.selectedAddons.includes(addon.name) ? 'rotate-45' : ''}`} />
                      {addon.name} (+${addon.price})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold ml-1">Special Requests</label>
                <textarea 
                  placeholder="Any specific preferences or requirements..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  className="w-full bg-slate-50/50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500 min-h-[80px]"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <BookingSummary 
                bookingData={formData} 
                imageUrl={options?.room_types.find((r: any) => r.name === formData.roomType)?.image_url}
              />
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                {error && (
                  <div className="w-full bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-medium border border-red-100">
                    {error}
                  </div>
                )}
                <button
                  onClick={async () => {
                    setSubmitting(true);
                    setError(null);
                    try {
                      const { createBooking } = await import('@/lib/api');
                      await createBooking(formData);
                      // Show success state
                      setCurrentStep(5); 
                    } catch (err: any) {
                      setError(err.message || 'Failed to create booking. Please try again.');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="w-full bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-coastal-seafoam hover:text-slate-900 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
                >
                  {submitting ? 'Confirming Sanctuary...' : 'Confirm Reservation'}
                </button>

                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium">
                  By confirming, you agree to our coastal residency terms
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in zoom-in duration-700 flex flex-col items-center text-center py-12">
              <div className="w-20 h-20 bg-coastal-seafoam/10 rounded-full flex items-center justify-center text-coastal-seafoam mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-playfair text-4xl text-slate-900 mb-4">Sanctuary Reserved</h3>
              <p className="text-slate-700 font-light max-w-sm mx-auto leading-relaxed mb-8">
                Check your WhatsApp for confirmation details. We've sent the check-in rituals and deposit information to <span className="font-medium text-slate-900">{formData.customerPhone}</span>.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-coastal-seafoam font-bold tracking-widest uppercase text-[10px] hover:underline"
              >
                Return to the Shore
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="mt-12 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-100 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed`}
              >
                {currentStep === 3 ? 'Review Summary' : 'Next Step'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <button 
            onClick={() => setCurrentStep(3)}
            className="mt-8 text-slate-600 text-sm hover:text-slate-600 transition-colors mx-auto"
          >
            ← Back to personal details
          </button>
        )}
      </div>

      {showPricingCalendar && (
        <PricingCalendar 
          roomType={formData.roomType} 
          onClose={() => setShowPricingCalendar(false)} 
          onSelectDate={(date) => {
            setFormData({ ...formData, checkIn: date });
            setShowPricingCalendar(false);
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
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
      observer.disconnect();
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-coastal-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coastal-seafoam"></div>
      </div>
    }>
      <main className="bg-coastal-white font-sans overflow-x-hidden relative">
        
        {/* Sticky Availability Bar */}
        <div className={`fixed top-0 left-0 w-full z-[80] transition-all duration-700 transform ${
          isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-md border-b border-coastal-beige/50 px-6 py-4">
             <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Waves className="w-6 h-6 text-coastal-seafoam" />
                   <span className="font-playfair text-xl text-slate-900">Namita Beach House</span>
                </div>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 py-3 bg-coastal-seafoam text-slate-900 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-coastal-seafoam/20"
                >
                  Reserve Sanctuary
                </button>
             </div>
          </div>
        </div>

        {/* Cinematic Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/resort/Hotel/IMG20241204150237.jpg" 
              alt="Panoramic Coastal View"
              fill
              priority
              sizes="100vw"
              className="object-cover animate-slow-pan"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-coastal-white" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <Waves className="w-16 h-16 text-white/80 mx-auto mb-8 animate-pulse" />
            <h1 className="font-playfair text-6xl md:text-8xl text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
              Where Silence <br className="hidden md:block" /> Meets the Sea
            </h1>
            <p className="text-white/90 font-light tracking-[0.3em] uppercase text-sm mb-12 max-w-2xl mx-auto leading-loose">
              Experience the art of coastal minimalism. <br /> A sanctuary for the soul, a rhythm for the heart.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="px-12 py-5 bg-coastal-seafoam text-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all shadow-2xl tracking-widest uppercase text-xs"
              >
                Reserve Your Stay
              </button>
              <button 
                onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all backdrop-blur-md tracking-widest uppercase text-xs"
              >
                Our Philosophy
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
             <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold rotate-90 mb-8">Scroll</span>
             <div className="w-[1px] h-20 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="py-32 px-6 bg-coastal-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-10">
                <span className="text-coastal-seafoam font-bold tracking-[0.3em] uppercase text-[10px] block">The Essence</span>
                <h2 className="font-playfair text-5xl md:text-6xl text-slate-900 leading-tight">
                  A sanctuary built on <br /> the beauty of less.
                </h2>
                <p className="text-slate-700 font-light leading-relaxed text-lg max-w-lg">
                  At Namita Beach House, we believe that true luxury isn't found in excess, but in the clarity of space and the rhythm of nature. Our architecture breathes with the ocean, our interiors mirror the dunes.
                </p>
                <div className="grid grid-cols-2 gap-10 pt-8">
                   <div className="space-y-4">
                      <h4 className="font-playfair text-3xl text-slate-900">98%</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Natural Materials</p>
                   </div>
                   <div className="space-y-4">
                      <h4 className="font-playfair text-3xl text-slate-900">Zero</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Digital Noise</p>
                   </div>
                </div>
             </div>
             <div 
              id="philosophy-image"
              className={`relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-1000 ${
                philosophyRevealed ? 'opacity-100' : 'opacity-0'
              }`}
             >
                <Image 
                  src="/images/resort/Hotel/IMG_20260327_172419.jpg" 
                  alt="Coastal Essence" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover ${
                    philosophyRevealed ? 'animate-reveal-majestic' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-slate-900/10" />
             </div>
          </div>
        </section>

        {/* Featured Sanctuaries */}
        <section className="py-32 px-6 bg-coastal-beige/30">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                 <div className="space-y-6">
                    <span className="text-coastal-seafoam font-bold tracking-[0.3em] uppercase text-[10px] block">Our Rooms</span>
                    <h2 className="font-playfair text-5xl text-slate-900">Featured Sanctuaries</h2>
                 </div>
                 <a href="/rooms" className="group flex items-center gap-4 text-slate-900 font-medium tracking-widest uppercase text-xs">
                    Explore All Rooms <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {options?.room_types.slice(0, 2).map((room: any) => (
                    <div 
                      key={room.name}
                      onClick={() => setIsBookingOpen(true)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-xl bg-slate-100">
                        {room.image_url ? (
                          <Image 
                            src={room.image_url.startsWith('http') ? room.image_url : encodeURI(room.image_url)} 
                            alt={room.name} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw" 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">No Image Available</div>
                        )}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-900 shadow-sm">
                            From ${room.price}
                        </div>
                      </div>
                      <h3 className="font-playfair text-3xl text-slate-900 mb-3">{room.name}</h3>
                      <p className="text-slate-700 font-light mb-6 line-clamp-2 italic">"{room.description}"</p>
                    </div>
                 ))}
                 {(!options || options.room_types.length === 0) && !loading && (
                   <p className="text-slate-600 font-light italic">No featured sanctuaries available.</p>
                 )}
                 {loading && (
                   <div className="col-span-2 py-20 flex justify-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coastal-seafoam"></div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Reservation Drawer Overlay */}
        <div 
          className={`fixed inset-0 z-[100] transition-all duration-500 ${
            isBookingOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          }`}
        >
           {/* Backdrop */}
           <div 
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
              isBookingOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsBookingOpen(false)}
           />
           
           {/* Drawer Content */}
           <div 
            className={`absolute top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-coastal-beige shadow-2xl transition-transform duration-700 ease-out transform ${
              isBookingOpen ? 'translate-x-0' : 'translate-x-full'
            } overflow-y-auto`}
           >
              <div className="p-8 md:p-12">
                 <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                       <Waves className="w-8 h-8 text-coastal-seafoam" />
                       <h2 className="font-playfair text-3xl text-slate-900">Reserve Your Sanctuary</h2>
                    </div>
                    <button 
                      onClick={() => setIsBookingOpen(false)}
                      className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
                    >
                       <ChevronRight className="w-6 h-6 text-slate-600" />
                    </button>
                 </div>
                 
                 <div className="animate-in fade-in slide-in-from-right-10 duration-700 delay-300">
                    <BookingFlow options={options} loading={loading} />
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Teaser */}
        <section className="py-20 text-center bg-white border-t border-coastal-beige">
           <p className="text-slate-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-8 italic">Stay in the rhythm of the tides</p>
           <button 
             onClick={() => setIsBookingOpen(true)}
             className="text-slate-900 font-playfair text-4xl hover:text-coastal-seafoam transition-colors underline underline-offset-8"
           >
              Begin Your Journey
           </button>
        </section>
      </main>
    </Suspense>
  );
}
