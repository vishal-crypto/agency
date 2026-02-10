import { create } from 'zustand';
import type { Booking, TimeSlot } from '@/types';

interface BookingState {
  // Selected values
  selectedDate: Date | null;
  selectedTime: string | null;
  
  // Available slots
  availableSlots: TimeSlot[];
  
  // Form data
  guestName: string;
  guestEmail: string;
  
  // UI state
  isSubmitting: boolean;
  bookingComplete: boolean;
  confirmedBooking: Booking | null;
  
  // Actions
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setAvailableSlots: (slots: TimeSlot[]) => void;
  setGuestName: (name: string) => void;
  setGuestEmail: (email: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setBookingComplete: (complete: boolean, booking?: Booking) => void;
  resetBooking: () => void;
}

const initialState = {
  selectedDate: null,
  selectedTime: null,
  availableSlots: [],
  guestName: '',
  guestEmail: '',
  isSubmitting: false,
  bookingComplete: false,
  confirmedBooking: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  
  setSelectedDate: (date) => set({ selectedDate: date, selectedTime: null }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setGuestName: (name) => set({ guestName: name }),
  setGuestEmail: (email) => set({ guestEmail: email }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setBookingComplete: (complete, booking) =>
    set({ bookingComplete: complete, confirmedBooking: booking || null }),
  resetBooking: () => set(initialState),
}));
