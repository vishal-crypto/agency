import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/admin';

  const supabase = await createClient();

  // Handle OAuth callback (Google)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('OAuth code exchange error:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  // Handle Magic Link / Email OTP callback
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'magiclink' | 'email',
    });
    if (error) {
      console.error('Magic link verify error:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  // At this point the session should be set — check admin role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Check admin role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role === 'admin') {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Not an admin — sign out and inform
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/login?error=not_admin`);
}
