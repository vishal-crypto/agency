'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/admin';
import { Card, Badge, Button, Spinner, Modal, Input } from '@/components/ui';
import { useAdminStore } from '@/stores';
import { formatTimeDisplay, cn } from '@/lib/utils';
import type { Booking } from '@/types';
import {
  Calendar,
  Clock,
  Mail,
  User,
  MoreVertical,
  X,
  Check,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { bookings, setBookings, statusFilter, setStatusFilter } = useAdminStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Only show loading spinner on first load (no cached data)
    if (bookings.length === 0) setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        await fetchBookings();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<Booking['status'], 'success' | 'warning' | 'error' | 'info'> = {
      pending: 'warning',
      confirmed: 'success',
      rescheduled: 'warning',
      cancelled: 'error',
      completed: 'info',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredBookings = bookings
    .filter((booking) => {
      if (statusFilter && booking.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.name.toLowerCase().includes(query) ||
          booking.email.toLowerCase().includes(query)
        );
      }
      return true;
    });

  const upcomingBookings = filteredBookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = filteredBookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === 'cancelled'
  );

  return (
    <AdminLayout
      title="Bookings"
      description="View and manage all client bookings"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === 'all' ? null : status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                (status === 'all' && !statusFilter) || statusFilter === status
                  ? 'bg-violet-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Upcoming ({upcomingBookings.length})
            </h2>
            {upcomingBookings.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-zinc-400">No upcoming bookings</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white">
                              {booking.name}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {booking.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeDisplay(booking.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsModalOpen(true);
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Past & Cancelled ({pastBookings.length})
            </h2>
            {pastBookings.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-zinc-400">No past bookings</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-zinc-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white">
                              {booking.name}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeDisplay(booking.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Actions Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Booking Actions"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">{selectedBooking.name}</h3>
              <p className="text-sm text-zinc-400">{selectedBooking.email}</p>
              <p className="text-sm text-zinc-400">
                {format(new Date(selectedBooking.date), 'EEEE, MMMM d, yyyy')} at{' '}
                {formatTimeDisplay(selectedBooking.time)}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                isLoading={actionLoading}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-400 hover:text-red-300"
                onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                isLoading={actionLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
