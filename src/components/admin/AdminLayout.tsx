'use client';

import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {description && (
              <p className="mt-1 text-zinc-400">{description}</p>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
