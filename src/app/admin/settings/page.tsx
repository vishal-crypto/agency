'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin';
import { Card, Button, Input } from '@/components/ui';
import { Save, User, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    adminEmail: 'admin@elevateagency.com',
    notifyOnBooking: true,
    notifyOnCancellation: true,
    callDuration: 30,
    maxAdvanceBooking: 30,
    minNoticeHours: 24,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Settings"
      description="Configure your booking system preferences"
    >
      <div className="max-w-2xl space-y-6">
        {/* Notification Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Notifications</h2>
          
          <div className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              helperText="Notifications will be sent to this email"
            />
            
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">New Booking Notifications</p>
                <p className="text-sm text-zinc-400">
                  Receive an email when a new booking is made
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, notifyOnBooking: !settings.notifyOnBooking })
                }
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.notifyOnBooking ? 'bg-violet-500' : 'bg-zinc-700'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    settings.notifyOnBooking ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Cancellation Notifications</p>
                <p className="text-sm text-zinc-400">
                  Receive an email when a booking is cancelled
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifyOnCancellation: !settings.notifyOnCancellation,
                  })
                }
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.notifyOnCancellation ? 'bg-violet-500' : 'bg-zinc-700'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    settings.notifyOnCancellation ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Booking Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Booking Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Call Duration (minutes)
              </label>
              <select
                value={settings.callDuration}
                onChange={(e) =>
                  setSettings({ ...settings, callDuration: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Maximum Advance Booking (days)
              </label>
              <select
                value={settings.maxAdvanceBooking}
                onChange={(e) =>
                  setSettings({ ...settings, maxAdvanceBooking: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Minimum Notice (hours)
              </label>
              <select
                value={settings.minNoticeHours}
                onChange={(e) =>
                  setSettings({ ...settings, minNoticeHours: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            className={cn(saveSuccess && 'bg-emerald-500')}
          >
            {saveSuccess ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
