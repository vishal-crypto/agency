'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/admin';
import { Card, Badge, Button, Spinner, Input } from '@/components/ui';
import { Shield, ShieldOff, Users, UserPlus, Mail, Plus, Eye, EyeOff } from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export default function TeamPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create admin form
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to load users');
      }
    } catch {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setActionLoading(userId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setSuccess(`Role updated to ${newRole}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update role');
      }
    } catch {
      setError('Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPassword.trim()) return;

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          fullName: newName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => [data, ...prev]);
        setNewEmail('');
        setNewPassword('');
        setNewName('');
        setShowForm(false);
        setSuccess(`Admin account created for ${data.email}`);
      } else {
        setError(data.error || 'Failed to create admin');
      }
    } catch {
      setError('Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  const admins = users.filter((u) => u.role === 'admin');
  const regularUsers = users.filter((u) => u.role !== 'admin');

  return (
    <AdminLayout title="Team Management" description="Manage admin access for your team.">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {error && (
            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              {success}
            </div>
          )}

          {/* Add Admin Section */}
          {!showForm ? (
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <Plus size={18} />
              Add New Admin
            </Button>
          ) : (
            <Card className="border-violet-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-400" />
                Create Admin Account
              </h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <Input
                  label="Full Name (optional)"
                  type="text"
                  placeholder="John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" isLoading={creating}>
                    Create Admin
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setNewEmail('');
                      setNewPassword('');
                      setNewName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              <p className="text-xs text-zinc-500 mt-3">
                The new admin can log in at <span className="text-violet-400">/login</span> with these credentials.
              </p>
            </Card>
          )}

          {/* Admins */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Admins ({admins.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admins.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onToggleRole={toggleRole}
                  isLoading={actionLoading === user.id}
                />
              ))}
              {admins.length === 0 && (
                <p className="text-sm text-zinc-500 col-span-2">No admin users yet.</p>
              )}
            </div>
          </div>

          {/* Regular users */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">
                Users ({regularUsers.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onToggleRole={toggleRole}
                  isLoading={actionLoading === user.id}
                />
              ))}
              {regularUsers.length === 0 && (
                <p className="text-sm text-zinc-500 col-span-2">
                  No regular users yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function UserCard({
  user,
  onToggleRole,
  isLoading,
}: {
  user: UserRecord;
  onToggleRole: (id: string, role: string) => void;
  isLoading: boolean;
}) {
  const isAdmin = user.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {(user.full_name || user.email).charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {user.full_name || 'No Name'}
            </span>
            <Badge variant={isAdmin ? 'success' : 'default'} className="text-xs">
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
            <Mail size={12} />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="text-xs text-zinc-600 mt-0.5">
            Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
          </div>
        </div>
        <Button
          variant={isAdmin ? 'ghost' : 'outline'}
          size="sm"
          onClick={() => onToggleRole(user.id, user.role)}
          isLoading={isLoading}
          className={isAdmin ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-violet-400 hover:text-violet-300'}
        >
          {isAdmin ? (
            <>
              <ShieldOff size={14} className="mr-1.5" />
              Revoke
            </>
          ) : (
            <>
              <Shield size={14} className="mr-1.5" />
              Make Admin
            </>
          )}
        </Button>
      </Card>
    </motion.div>
  );
}
