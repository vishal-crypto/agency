export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'guest';
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string; // UTC date string
  time: string; // Time slot (e.g., "09:00")
  status: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed';
  created_at: string;
  timezone?: string;
  notes?: string;
}

export interface Availability {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
}

export interface WorkingHours {
  id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  image?: string;
  metrics: {
    label: string;
    value: string;
  }[];
}
