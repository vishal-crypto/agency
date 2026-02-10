import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Elevate Agency',
  description: 'Manage bookings, availability, and settings.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
