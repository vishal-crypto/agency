import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const { workingHours } = body;

    if (!workingHours || !Array.isArray(workingHours)) {
      return NextResponse.json(
        { error: 'Invalid working hours data' },
        { status: 400 }
      );
    }

    // Delete existing working hours
    await supabase.from('working_hours').delete().neq('id', '');

    // Insert new working hours
    const { data, error } = await supabase
      .from('working_hours')
      .insert(
        workingHours
          .filter((wh: { enabled: boolean }) => wh.enabled)
          .map((wh: { day: number; startHour: number; endHour: number }) => ({
            day_of_week: wh.day,
            start_time: `${wh.startHour.toString().padStart(2, '0')}:00`,
            end_time: `${wh.endHour.toString().padStart(2, '0')}:00`,
            is_active: true,
          }))
      )
      .select();

    if (error) {
      console.error('Error saving working hours:', error);
      return NextResponse.json(
        { error: 'Failed to save working hours' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Working hours API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: workingHours, error } = await supabase
      .from('working_hours')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error fetching working hours:', error);
      return NextResponse.json(
        { error: 'Failed to fetch working hours' },
        { status: 500 }
      );
    }

    return NextResponse.json(workingHours || []);
  } catch (error) {
    console.error('Working hours API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
