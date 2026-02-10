'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Button, Input, Card, Spinner } from '@/components/ui';
import { useBookingStore } from '@/stores';
import { BookingCalendar, TimeSlots, BookingConfirmation } from '@/components/booking';
import { formatDateDisplay, formatTimeDisplay, isValidEmail, getUserTimezone } from '@/lib/utils';
import { Calendar, Clock, User, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

type Step = 'date' | 'time' | 'details' | 'confirm';

export function BookingPage() {
  const [step, setStep] = useState<Step>('date');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [timezone] = useState(getUserTimezone());
  
  const {
    selectedDate,
    selectedTime,
    guestName,
    guestEmail,
    isSubmitting,
    bookingComplete,
    confirmedBooking,
    setGuestName,
    setGuestEmail,
    setSubmitting,
    setBookingComplete,
    resetBooking,
  } = useBookingStore();

  // Reset booking when component mounts
  useEffect(() => {
    resetBooking();
  }, [resetBooking]);

  const validateDetails = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!guestName.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!guestEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(guestEmail)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateDetails()) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          email: guestEmail,
          service: 'Strategy Session',
          date: selectedDate?.toISOString().split('T')[0],
          time: selectedTime,
          timezone,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Booking failed');
      }
      
      const booking = await response.json();
      setBookingComplete(true, booking);
    } catch (error) {
      console.error('Booking error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to create booking. Please try again.';
      setErrors({ email: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'time') setStep('date');
    if (step === 'details') setStep('time');
    if (step === 'confirm') setStep('details');
  };

  const canProceedToTime = selectedDate !== null;
  const canProceedToDetails = selectedTime !== null;

  // Show confirmation if booking is complete
  if (bookingComplete && confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} onNewBooking={resetBooking} />;
  }

  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-8 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Container size="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-violet-400 uppercase bg-violet-500/10 rounded-full border border-violet-500/20">
            Book a Call
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Schedule Your Strategy Session
          </h1>
          <p className="mt-4 text-zinc-400 max-w-md mx-auto">
            Book a free 30-minute call with our team. No commitment required.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Timezone: {timezone}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[
              { key: 'date', icon: Calendar, label: 'Date' },
              { key: 'time', icon: Clock, label: 'Time' },
              { key: 'details', icon: User, label: 'Details' },
              { key: 'confirm', icon: CheckCircle2, label: 'Confirm' },
            ].map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step === s.key
                      ? 'bg-violet-500 text-white'
                      : ['date', 'time', 'details', 'confirm'].indexOf(step) >
                        ['date', 'time', 'details', 'confirm'].indexOf(s.key)
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <s.icon size={18} />
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-0.5 transition-colors ${
                      ['date', 'time', 'details', 'confirm'].indexOf(step) > index
                        ? 'bg-violet-500'
                        : 'bg-zinc-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Date */}
            {step === 'date' && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Select a Date
                </h2>
                <BookingCalendar />
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setStep('time')}
                    disabled={!canProceedToTime}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Time */}
            {step === 'time' && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Select a Time
                </h2>
                {selectedDate && (
                  <p className="text-zinc-400 mb-6">
                    {formatDateDisplay(selectedDate)}
                  </p>
                )}
                <TimeSlots />
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setStep('details')}
                    disabled={!canProceedToDetails}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Enter Details */}
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Your Details
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    error={errors.name}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    error={errors.email}
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (validateDetails()) {
                        setStep('confirm');
                      }
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Confirm Your Booking
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm text-zinc-400">Date</p>
                      <p className="text-white font-medium">
                        {selectedDate && formatDateDisplay(selectedDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                    <Clock className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm text-zinc-400">Time</p>
                      <p className="text-white font-medium">
                        {selectedTime && formatTimeDisplay(selectedTime)} ({timezone})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                    <User className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm text-zinc-400">Name</p>
                      <p className="text-white font-medium">{guestName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                    <Mail className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm text-zinc-400">Email</p>
                      <p className="text-white font-medium">{guestEmail}</p>
                    </div>
                  </div>
                </div>

                {errors.email && (
                  <p className="text-red-400 text-sm mb-4">{errors.email}</p>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Confirm Booking
                </Button>
                
                <p className="mt-4 text-center text-sm text-zinc-500">
                  A confirmation email will be sent to your inbox.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Container>
    </section>
  );
}
