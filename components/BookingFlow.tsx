'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
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
import BookingSummary from '@/components/BookingSummary';
import DateRangePicker from '@/components/DateRangePicker';
import { getImageUrl } from '@/lib/api';

interface BookingFlowProps {
  options: any;
  loading: boolean;
}

export default function BookingFlow({ options, loading: optionsLoading }: BookingFlowProps) {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room');

  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
  const [availability, setAvailability] = useState<Record<string, {is_available: boolean, remaining: number}>>({});
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
      setFormData(prev => ({ ...prev, roomType: roomParam.toUpperCase() }));
    }
  }, [roomParam]);

  useEffect(() => {
    async function updateAvailability() {
      if (formData.checkIn && formData.checkOut) {
        setCheckingAvailability(true);
        try {
          const { checkAvailability } = await import('@/lib/api');
          const results: Record<string, {is_available: boolean, remaining: number}> = {};
          
          if (options?.room_types) {
            await Promise.all(options.room_types.map(async (room: any) => {
              const res = await checkAvailability({
                room_type: room.name,
                check_in: formData.checkIn,
                check_out: formData.checkOut
              });
              results[room.name] = {
                is_available: res.is_available,
                remaining: res.remaining_inventory
              };
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-white' 
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
      <div className="bg-surface p-8 md:p-12 rounded-majestic shadow-xl shadow-slate-200/50 border border-neutral/30 min-h-[500px] flex flex-col">
          
        <div className="flex-grow">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="space-y-2">
                <h3 className="font-playfair text-3xl">When will you join us?</h3>
                <p className="text-slate-700 font-light">Select your preferred dates for a coastal retreat.</p>
              </div>
              
              <button 
                onClick={() => setShowDatePicker(true)}
                className="w-full group bg-slate-50/50 border border-neutral/30 rounded-majestic p-8 text-left transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Arrival
                    </label>
                    <p className={`text-xl font-medium ${formData.checkIn ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                      {formData.checkIn || 'Select check-in date'}
                    </p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-neutral/50" />
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Departure
                    </label>
                    <p className={`text-xl font-medium ${formData.checkOut ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                      {formData.checkOut || 'Select check-out date'}
                    </p>
                  </div>
                  <div className="bg-primary/10 group-hover:bg-primary p-4 rounded-full text-primary group-hover:text-slate-900 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              </button>

              <div className="flex justify-center items-center px-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Last booking 2 hours ago
                </div>
              </div>

              <div className="bg-neutral/20 p-6 rounded-elegant border border-neutral/50">
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
                    {checkingAvailability && <span className="ml-2 animate-pulse text-primary normal-case tracking-normal font-light">Verifying availability...</span>}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {options?.room_types.map((room: any) => {
                      const availInfo = availability[room.name];
                      const isAvailable = availInfo ? availInfo.is_available : true;
                      const remaining = availInfo ? availInfo.remaining : 5;
                      const isLowStock = remaining > 0 && remaining <= 2;

                      return (
                        <button
                          key={room.name}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setFormData({...formData, roomType: room.name})}
                          className={`p-4 rounded-elegant border text-left transition-all relative overflow-hidden flex flex-col gap-4 ${
                            !isAvailable 
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : formData.roomType === room.name 
                                ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-md shadow-primary/5' 
                                : 'border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-white'
                          }`}
                        >
                          {room.image_url && (
                            <div className="relative aspect-video rounded-modern overflow-hidden bg-slate-100">
                              <Image 
                                src={getImageUrl(room.image_url)} 
                                alt={room.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 20vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="px-2 pb-2">
                            {!isAvailable && (
                              <span className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-elegant z-10">
                                <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Sold Out</span>
                              </span>
                            )}
                            {isLowStock && isAvailable && (
                              <span className="absolute top-2 right-2 bg-red-50 text-red-500 text-[8px] uppercase tracking-widest px-2 py-1 rounded-full font-bold border border-red-100 animate-pulse z-10">
                                Only {remaining} Left
                              </span>
                            )}
                            <p className="font-medium text-slate-900">{room.name}</p>
                            <p className="text-xs text-slate-600 mt-1">From ₹{room.price}/night</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.roomType === 'DELUXE' && (
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-elegant flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-all"
                    onClick={() => setFormData({...formData, roomType: 'SUITE'})}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Upgrade to Garden Villa?</p>
                        <p className="text-xs text-slate-700">Add an outdoor shower and private garden for just ₹5000 extra.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary" />
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
                      className="w-full bg-slate-50/50 border-0 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 font-medium appearance-none"
                    >

                      {options?.meal_plans.map((meal: any) => (
                        <option key={meal.name} value={meal.name}>{meal.name} (+₹{meal.price})</option>
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
                      className="w-full bg-slate-50/50 border-0 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 font-medium appearance-none"
                    >

                      {options?.packages.map((pkg: any) => (
                        <option key={pkg.name} value={pkg.name}>{pkg.name} (+₹{pkg.price})</option>
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
                    className="w-full bg-slate-50/50 border-0 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500"
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
                    className="w-full bg-slate-50/50 border-0 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500"
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
                      className={`flex items-center gap-2 px-5 py-3 rounded-modern border transition-all text-sm ${
                        formData.selectedAddons.includes(addon.name)
                          ? 'bg-primary/10 border-primary text-slate-800 shadow-sm'
                          : 'bg-transparent border-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <Plus className={`w-3 h-3 transition-transform ${formData.selectedAddons.includes(addon.name) ? 'rotate-45' : ''}`} />
                      {addon.name} (+₹{addon.price})
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
                  className="w-full bg-slate-50/50 border-0 rounded-elegant py-4 px-6 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-slate-900 font-medium placeholder:text-slate-500 min-h-[80px]"
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
                  <div className="w-full bg-red-50 text-red-500 p-4 rounded-elegant text-xs font-medium border border-red-100">
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
                  className="w-full bg-slate-900 text-white px-12 py-5 rounded-elegant font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-slate-900 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
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
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-playfair text-4xl text-slate-900 mb-4">Sanctuary Reserved</h3>
              <p className="text-slate-700 font-light max-w-sm mx-auto leading-relaxed mb-8">
                Check your WhatsApp for confirmation details. We've sent the check-in rituals and deposit information to <span className="font-medium text-slate-900">{formData.customerPhone}</span>.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-primary font-bold tracking-widest uppercase text-[10px] hover:underline"
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
              <div className="bg-red-50 text-red-500 p-4 rounded-elegant text-xs font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
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
                className={`flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-elegant text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-100 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed`}
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

      {showDatePicker && (
        <DateRangePicker 
          startDate={formData.checkIn}
          endDate={formData.checkOut}
          onChange={(start, end) => setFormData({ ...formData, checkIn: start, checkOut: end })}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
