import { Metadata } from 'next';
import { AboutPage } from './AboutPage';
import { PublicShell } from '@/components/layout';

export const metadata: Metadata = {
  title: 'About Us | Elevate Agency',
  description: 'Learn about Elevate Agency - our mission, values, and the team behind your digital marketing success.',
};

export default function Page() {
  return <PublicShell><AboutPage /></PublicShell>;
}
