'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfDay } from 'date-fns';
import { AdminLayout } from '@/components/admin';
import { Card, Button, Spinner, Input, Modal } from '@/components/ui';
import { useAdminStore } from '@/stores';
import { cn } from '@/lib/utils';
import { CalendarOff, Plus, Trash2, Calendar } from 'lucide-react';
import type { BlockedDate } from '@/types';

export default function BlockedDatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { blockedDates, setBlockedDates, addBlockedDate, removeBlockedDate } = useAdminStore();

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/blocked-dates');
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newDate) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, reason: newReason }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addBlockedDate(data);
        setIsModalOpen(false);
        setNewDate('');
        setNewReason('');
      }
    } catch (error) {
      console.error('Failed to add blocked date:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveBlockedDate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blocked-dates/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        removeBlockedDate(id);
      }
    } catch (error) {
      console.error('Failed to remove blocked date:', error);
    }
  };

  const today = new Date();
  const minDate = format(addDays(today, 1), 'yyyy-MM-dd');

  const upcomingBlockedDates = blockedDates.filter(
    (bd) => new Date(bd.date) >= startOfDay(today)
  );
  const pastBlockedDates = blockedDates.filter(
    (bd) => new Date(bd.date) < startOfDay(today)
  );

  return (
    <AdminLayout
      title="Blocked Dates"
      description="Block specific dates from being booked"
    >
      <div className="flex justify-end mb-6">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Block a Date
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Blocked Dates */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Upcoming Blocked Dates ({upcomingBlockedDates.length})
            </h2>
            {upcomingBlockedDates.length === 0 ? (
              <Card className="text-center py-8">
                <CalendarOff className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No blocked dates</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Click &quot;Block a Date&quot; to prevent bookings on specific days.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingBlockedDates.map((blockedDate, index) => (
                  <motion.div
                    key={blockedDate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                          <CalendarOff className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {format(new Date(blockedDate.date), 'EEEE, MMMM d, yyyy')}
                          </h3>
                          {blockedDate.reason && (
                            <p className="text-sm text-zinc-400">{blockedDate.reason}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBlockedDate(blockedDate.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Past Blocked Dates */}
          {pastBlockedDates.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Past Blocked Dates ({pastBlockedDates.length})
              </h2>
              <div className="grid gap-4">
                {pastBlockedDates.map((blockedDate, index) => (
                  <motion.div
                    key={blockedDate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex items-center gap-4 opacity-50">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                        <CalendarOff className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {format(new Date(blockedDate.date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        {blockedDate.reason && (
                          <p className="text-sm text-zinc-400">{blockedDate.reason}</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Blocked Date Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Block a Date"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Date
            </label>
            <input
              type="date"
              min={minDate}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <Input
            label="Reason (Optional)"
            placeholder="e.g., Holiday, Team retreat"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddBlockedDate}
              isLoading={isAdding}
              disabled={!newDate}
            >
              Block Date
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
