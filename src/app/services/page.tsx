import { Metadata } from 'next';
import { ServicesPage } from './ServicesPage';
import { PublicShell } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Our Services | Elevate Agency',
  description: 'Comprehensive digital marketing services including strategy, SEO, performance marketing, brand development, and more.',
};

export default function Page() {
  return <PublicShell><ServicesPage /></PublicShell>;
}
