import { Metadata } from 'next';
import { CaseStudiesPage } from './CaseStudiesPage';
import { PublicShell } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Case Studies | Elevate Agency',
  description: 'Explore our success stories and see how we\'ve helped brands achieve remarkable growth through strategic digital marketing.',
};

export default function Page() {
  return <PublicShell><CaseStudiesPage /></PublicShell>;
}
