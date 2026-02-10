'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container, Button, Card } from '@/components/ui';
import { formatTimeDisplay, getUserTimezone } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, Calendar, Clock, User, Mail, ArrowRight } from 'lucide-react';
import type { Booking } from '@/types';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
}

export function BookingConfirmation({ booking, onNewBooking }: BookingConfirmationProps) {
  const timezone = getUserTimezone();
  
  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-8 pb-20 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Container size="sm" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-zinc-400 mb-8">
              We&apos;ve sent a confirmation email to your inbox.
            </p>

            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-400">Date</p>
                  <p className="text-white font-medium">
                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-400">Time</p>
                  <p className="text-white font-medium">
                    {formatTimeDisplay(booking.time)} ({timezone})
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <User className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-400">Name</p>
                  <p className="text-white font-medium">{booking.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <Mail className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="text-white font-medium">{booking.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg mb-8">
              <p className="text-sm text-zinc-300">
                <span className="font-medium text-violet-400">Booking ID:</span>{' '}
                {booking.id}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="primary"
                onClick={onNewBooking}
                className="flex-1 group"
              >
                Book Another Call
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
