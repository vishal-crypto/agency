'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import {
  Calendar,
  CalendarOff,
  Settings,
  LogOut,
  LayoutDashboard,
  Clock,
  Users,
} from 'lucide-react';

const navItems = [
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/availability', label: 'Availability', icon: Clock },
  { href: '/admin/blocked-dates', label: 'Blocked Dates', icon: CalendarOff },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white">
              {SITE_CONFIG.name}
            </span>
            <p className="text-xs text-zinc-500">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
