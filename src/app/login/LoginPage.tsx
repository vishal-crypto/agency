'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Button, Card, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, Shield, LogIn } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const res = await fetch('/api/auth/check-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          });
          const result = await res.json();
          if (result.role === 'admin') {
            router.push('/admin');
          }
        } catch {
          // Silently fail — user will need to log in again
        }
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'not_admin') {
      setError('Access denied. Your account does not have admin privileges.');
    } else if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Check admin role via API (uses service-role client, auto-creates missing users row)
        const res = await fetch('/api/auth/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id, email: data.user.email }),
        });
        const result = await res.json();

        if (result.role === 'admin') {
          router.push('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
          await supabase.auth.signOut();
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Container size="sm" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>

          <Card className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-4">
                <Shield className="w-7 h-7 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Admin Login
              </h1>
              <p className="text-zinc-400 text-sm">
                Sign in to access the {SITE_CONFIG.name} dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                Only authorized team members can access the admin dashboard.
              </p>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
