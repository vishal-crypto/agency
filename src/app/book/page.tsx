import { Metadata } from 'next';
import { BookingPage } from './BookingPage';
import { PublicShell } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Book a Strategy Call | Elevate Agency',
  description: 'Schedule a free 30-minute strategy call with our team. No commitment required.',
};

export default function Page() {
  return <PublicShell><BookingPage /></PublicShell>;
}
