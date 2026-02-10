'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBookingStore } from '@/stores';
import { Spinner } from '@/components/ui';
import { formatTimeDisplay, generateTimeSlots } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { TimeSlot } from '@/types';

export function TimeSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedDate, selectedTime, setSelectedTime, setAvailableSlots } = useBookingStore();

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!selectedDate) return;
      
      setIsLoading(true);
      
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?date=${dateStr}`);
        
        if (response.ok) {
          const data = await response.json();
          setSlots(data.slots || []);
          setAvailableSlots(data.slots || []);
        } else {
          // Fallback to default slots if API fails
          const defaultSlots = generateTimeSlots(9, 17, 30).map((time) => ({
            time,
            available: true,
          }));
          setSlots(defaultSlots);
          setAvailableSlots(defaultSlots);
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        // Fallback to default slots
        const defaultSlots = generateTimeSlots(9, 17, 30).map((time) => ({
          time,
          available: true,
        }));
        setSlots(defaultSlots);
        setAvailableSlots(defaultSlots);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAvailableSlots();
  }, [selectedDate, setAvailableSlots]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  const availableSlots = slots.filter((slot) => slot.available);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No available slots for this date.</p>
        <p className="text-sm text-zinc-500 mt-2">Please select another date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot, index) => (
        <motion.button
          key={slot.time}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          onClick={() => slot.available && setSelectedTime(slot.time)}
          disabled={!slot.available}
          className={cn(
            'py-2 px-3 rounded-lg text-sm font-medium transition-all',
            !slot.available && 'opacity-30 cursor-not-allowed line-through',
            slot.available && selectedTime !== slot.time && 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
            selectedTime === slot.time && 'bg-violet-500 text-white'
          )}
        >
          {formatTimeDisplay(slot.time)}
        </motion.button>
      ))}
    </div>
  );
}
