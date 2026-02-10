import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginPage } from './LoginPage';
import { PublicShell } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Admin Login | Elevate Agency',
  description: 'Login to access the admin dashboard.',
};

export default function Page() {
  return (
    <PublicShell>
      <Suspense>
        <LoginPage />
      </Suspense>
    </PublicShell>
  );
}
