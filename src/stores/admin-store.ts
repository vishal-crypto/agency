import { create } from 'zustand';
import type { Booking, WorkingHours, BlockedDate } from '@/types';

interface AdminState {
  // Data
  bookings: Booking[];
  workingHours: WorkingHours[];
  blockedDates: BlockedDate[];
  
  // UI state
  selectedBooking: Booking | null;
  isLoading: boolean;
  
  // Filter state
  dateFilter: Date | null;
  statusFilter: string | null;
  
  // Actions
  setBookings: (bookings: Booking[]) => void;
  setWorkingHours: (hours: WorkingHours[]) => void;
  setBlockedDates: (dates: BlockedDate[]) => void;
  selectBooking: (booking: Booking | null) => void;
  setLoading: (loading: boolean) => void;
  setDateFilter: (date: Date | null) => void;
  setStatusFilter: (status: string | null) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addBlockedDate: (date: BlockedDate) => void;
  removeBlockedDate: (id: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  bookings: [],
  workingHours: [],
  blockedDates: [],
  selectedBooking: null,
  isLoading: false,
  dateFilter: null,
  statusFilter: null,
  
  setBookings: (bookings) => set({ bookings }),
  setWorkingHours: (hours) => set({ workingHours: hours }),
  setBlockedDates: (dates) => set({ blockedDates: dates }),
  selectBooking: (booking) => set({ selectedBooking: booking }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDateFilter: (date) => set({ dateFilter: date }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  updateBookingStatus: (id, status) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    })),
  addBlockedDate: (date) =>
    set((state) => ({
      blockedDates: [...state.blockedDates, date],
    })),
  removeBlockedDate: (id) =>
    set((state) => ({
      blockedDates: state.blockedDates.filter((d) => d.id !== id),
    })),
}));
