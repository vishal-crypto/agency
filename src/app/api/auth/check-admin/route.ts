import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vishalrathod1351@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();
    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if user row exists in public.users
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking user:', selectError);
      return NextResponse.json({ error: 'Failed to check user role' }, { status: 500 });
    }

    // If user row exists, return their role
    if (existingUser) {
      return NextResponse.json({ role: existingUser.role });
    }

    // User doesn't exist in public.users — create the row
    // (trigger failed silently, or user was created before schema was set up)
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        full_name: '',
        role,
      }, { onConflict: 'id' })
      .select('role')
      .single();

    if (insertError) {
      console.error('Error creating user row:', insertError);
      return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
    }

    return NextResponse.json({ role: newUser.role });
  } catch (err) {
    console.error('check-admin error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
