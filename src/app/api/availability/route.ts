import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { format, addDays, startOfDay } from 'date-fns';
import { generateTimeSlots } from '@/lib/utils';
import { WORKING_HOURS_DEFAULT, BOOKING_SETTINGS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const requestedDate = new Date(dateParam);
    const today = new Date();
    const minDate = addDays(today, 1);
    const maxDate = addDays(today, BOOKING_SETTINGS.maxDaysInAdvance);

    // Validate date is within allowed range
    if (requestedDate < startOfDay(minDate) || requestedDate > maxDate) {
      return NextResponse.json(
        { error: 'Date is outside booking window' },
        { status: 400 }
      );
    }

    // Check if it's a working day (weekday)
    const dayOfWeek = requestedDate.getDay();
    if (!WORKING_HOURS_DEFAULT.workDays.includes(dayOfWeek)) {
      return NextResponse.json({ slots: [] });
    }

    // Generate all possible time slots
    const allSlots = generateTimeSlots(
      WORKING_HOURS_DEFAULT.start,
      WORKING_HOURS_DEFAULT.end,
      WORKING_HOURS_DEFAULT.slotDuration
    );

    // Fetch existing bookings for this date
    const { data: existingBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', dateParam)
      .in('status', ['confirmed', 'rescheduled']);

    if (bookingError) {
      console.error('Error fetching bookings:', bookingError);
      // Return all slots as available if DB query fails
      return NextResponse.json({
        slots: allSlots.map((time) => ({ time, available: true })),
      });
    }

    // Fetch blocked time slots for this date
    const { data: blockedSlots } = await supabase
      .from('availability')
      .select('time_slot')
      .eq('date', dateParam)
      .eq('is_available', false);

    const bookedTimes = new Set(existingBookings?.map((b) => b.time) || []);
    const blockedTimes = new Set(blockedSlots?.map((s) => s.time_slot) || []);

    // Build slots with availability
    const slots = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time) && !blockedTimes.has(time),
    }));

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
