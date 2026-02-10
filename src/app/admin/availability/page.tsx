'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin';
import { Card, Button, Spinner } from '@/components/ui';
import { WORKING_HOURS_DEFAULT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Clock, Save } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface WorkingHours {
  day: number;
  enabled: boolean;
  startHour: number;
  endHour: number;
}

export default function AvailabilityPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    DAYS.map((_, index) => ({
      day: index,
      enabled: WORKING_HOURS_DEFAULT.workDays.includes(index),
      startHour: WORKING_HOURS_DEFAULT.start,
      endHour: WORKING_HOURS_DEFAULT.end,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day === dayIndex ? { ...wh, enabled: !wh.enabled } : wh
      )
    );
  };

  const handleChangeHours = (
    dayIndex: number,
    field: 'startHour' | 'endHour',
    value: number
  ) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day === dayIndex ? { ...wh, [field]: value } : wh
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/admin/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workingHours }),
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save working hours:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <AdminLayout
      title="Availability"
      description="Set your working hours and availability"
    >
      <Card>
        <div className="space-y-6">
          {workingHours.map((wh, index) => (
            <motion.div
              key={wh.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-6 p-4 rounded-xl transition-colors',
                wh.enabled ? 'bg-zinc-800/50' : 'bg-zinc-900/50'
              )}
            >
              {/* Day Toggle */}
              <button
                onClick={() => handleToggleDay(wh.day)}
                className={cn(
                  'w-32 flex items-center gap-3 font-medium transition-colors',
                  wh.enabled ? 'text-white' : 'text-zinc-500'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 transition-colors',
                    wh.enabled
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-zinc-600'
                  )}
                >
                  {wh.enabled && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
                {DAYS[wh.day]}
              </button>

              {/* Time Range */}
              {wh.enabled && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <select
                      value={wh.startHour}
                      onChange={(e) =>
                        handleChangeHours(wh.day, 'startHour', Number(e.target.value))
                      }
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {HOURS.filter((h) => h < wh.endHour).map((hour) => (
                        <option key={hour} value={hour}>
                          {formatHour(hour)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <span className="text-zinc-500">to</span>
                  
                  <select
                    value={wh.endHour}
                    onChange={(e) =>
                      handleChangeHours(wh.day, 'endHour', Number(e.target.value))
                    }
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {HOURS.filter((h) => h > wh.startHour).map((hour) => (
                      <option key={hour} value={hour}>
                        {formatHour(hour)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!wh.enabled && (
                <span className="text-zinc-500 text-sm">Unavailable</span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Changes will apply to future bookings only.
          </p>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            className={cn(saveSuccess && 'bg-emerald-500')}
          >
            {saveSuccess ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
