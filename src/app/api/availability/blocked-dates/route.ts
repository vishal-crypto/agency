import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addDays } from 'date-fns';
import { BOOKING_SETTINGS } from '@/lib/constants';

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date();
    const maxDate = addDays(today, BOOKING_SETTINGS.maxDaysInAdvance);

    // Fetch blocked dates within the booking window
    const { data: blockedDates, error } = await supabase
      .from('blocked_dates')
      .select('date')
      .gte('date', today.toISOString().split('T')[0])
      .lte('date', maxDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching blocked dates:', error);
      return NextResponse.json({ dates: [] });
    }

    const dates = blockedDates?.map((d) => d.date) || [];

    return NextResponse.json({ dates });
  } catch (error) {
    console.error('Blocked dates API error:', error);
    return NextResponse.json({ dates: [] });
  }
}
