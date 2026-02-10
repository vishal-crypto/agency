import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: blockedDates, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching blocked dates:', error);
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }

    return NextResponse.json(blockedDates || []);
  } catch (error) {
    console.error('Blocked dates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Check if date is already blocked
    const { data: existing } = await supabase
      .from('blocked_dates')
      .select('id')
      .eq('date', date)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This date is already blocked' },
        { status: 409 }
      );
    }

    const { data: blockedDate, error } = await supabase
      .from('blocked_dates')
      .insert({
        date,
        reason: reason || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blocked date:', error);
      return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }

    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error) {
    console.error('Blocked dates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
