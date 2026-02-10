import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// Helper: verify the caller is an admin
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminClient = createAdminClient();
  const { data: currentUser } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUser?.role !== 'admin') return null;
  return { user, adminClient };
}

// GET: List all users with admin role info
export async function GET() {
  try {
    const verified = await verifyAdmin();
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: users, error } = await verified.adminClient
      .from('users')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new admin user (email + password)
export async function POST(request: NextRequest) {
  try {
    const verified = await verifyAdmin();
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, password, fullName } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const adminClient = verified.adminClient;

    // Create auth user via admin API
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || '' },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message || 'Failed to create user' }, { status: 500 });
    }

    // Create users table row with admin role
    const { error: insertError } = await adminClient
      .from('users')
      .upsert({
        id: authData.user.id,
        email: email.toLowerCase(),
        full_name: fullName || '',
        role: 'admin',
      }, { onConflict: 'id' });

    if (insertError) {
      console.error('Error creating user row:', insertError);
    }

    return NextResponse.json({
      id: authData.user.id,
      email: authData.user.email,
      full_name: fullName || '',
      role: 'admin',
      created_at: authData.user.created_at,
    });
  } catch (error) {
    console.error('Users POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Update a user's role (admin/user)
export async function PATCH(request: NextRequest) {
  try {
    const verified = await verifyAdmin();
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Prevent removing your own admin role
    if (userId === verified.user.id && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot remove your own admin role' },
        { status: 400 }
      );
    }

    const { data: updated, error } = await verified.adminClient
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Users PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
