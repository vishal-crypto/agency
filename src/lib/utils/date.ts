import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { addDays, startOfDay, isBefore, isAfter, isSameDay, parseISO, format } from 'date-fns';

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format a UTC date string to user's local timezone
 */
export function formatToLocalTime(
  utcDate: string,
  formatStr: string = 'PPP',
  timezone?: string
): string {
  const tz = timezone || getUserTimezone();
  const date = parseISO(utcDate);
  return formatInTimeZone(date, tz, formatStr);
}

/**
 * Convert local date/time to UTC for storage
 */
export function localToUTC(date: Date, time: string, timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const [hours, minutes] = time.split(':').map(Number);
  
  const localDate = new Date(date);
  localDate.setHours(hours, minutes, 0, 0);
  
  return localDate.toISOString();
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 17,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  
  return slots;
}

/**
 * Format time for display (e.g., "09:00" -> "9:00 AM")
 */
export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get array of dates for next N days
 */
export function getNextNDays(n: number, startDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const start = startOfDay(startDate);
  
  for (let i = 0; i < n; i++) {
    dates.push(addDays(start, i));
  }
  
  return dates;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format date for display
 */
export function formatDateDisplay(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Format date for API
 */
export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
