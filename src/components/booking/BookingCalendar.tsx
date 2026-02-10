'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns';
import { useBookingStore } from '@/stores';
import { cn } from '@/lib/utils';
import { BOOKING_SETTINGS } from '@/lib/constants';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const { selectedDate, setSelectedDate } = useBookingStore();

  // Fetch blocked dates
  useEffect(() => {
    async function fetchBlockedDates() {
      try {
        const response = await fetch('/api/availability/blocked-dates');
        if (response.ok) {
          const data = await response.json();
          setBlockedDates(data.dates || []);
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error);
      }
    }
    fetchBlockedDates();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const today = new Date();
  const minDate = addDays(today, 1); // At least 24 hours notice
  const maxDate = addDays(today, BOOKING_SETTINGS.maxDaysInAdvance);

  const isDateDisabled = (date: Date) => {
    // Past dates
    if (isBefore(date, minDate)) return true;
    
    // Too far in future
    if (isAfter(date, maxDate)) return true;
    
    // Weekend (Saturday = 6, Sunday = 0)
    const day = date.getDay();
    if (day === 0 || day === 6) return true;
    
    // Blocked dates
    const dateStr = format(date, 'yyyy-MM-dd');
    if (blockedDates.includes(dateStr)) return true;
    
    return false;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          disabled={isSameMonth(currentMonth, today)}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs font-medium text-zinc-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDisabled = isDateDisabled(day);
          const isToday = isSameDay(day, today);

          return (
            <motion.button
              key={index}
              whileHover={!isDisabled ? { scale: 1.05 } : undefined}
              whileTap={!isDisabled ? { scale: 0.95 } : undefined}
              onClick={() => !isDisabled && setSelectedDate(day)}
              disabled={isDisabled}
              className={cn(
                'h-10 rounded-lg text-sm font-medium transition-all',
                !isCurrentMonth && 'opacity-30',
                isDisabled && 'cursor-not-allowed opacity-30',
                !isDisabled && !isSelected && 'hover:bg-zinc-800 text-zinc-300',
                isSelected && 'bg-violet-500 text-white',
                isToday && !isSelected && 'ring-1 ring-violet-500/50'
              )}
            >
              {format(day, 'd')}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
