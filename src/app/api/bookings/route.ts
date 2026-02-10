import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email';
import { isValidEmail } from '@/lib/utils';
import { addDays, startOfDay, isBefore, isAfter } from 'date-fns';
import { BOOKING_SETTINGS, WORKING_HOURS_DEFAULT } from '@/lib/constants';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // Max bookings per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many booking requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, date, time, timezone, service } = body;

    // Validation
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate date
    const bookingDate = new Date(date + 'T00:00:00'); // Force local midnight
    const today = startOfDay(new Date());
    const maxDate = addDays(today, BOOKING_SETTINGS.maxDaysInAdvance);

    if (isBefore(bookingDate, today) || isAfter(bookingDate, maxDate)) {
      return NextResponse.json(
        { error: 'Selected date is outside the allowed range', message: 'Please select a date between today and ' + BOOKING_SETTINGS.maxDaysInAdvance + ' days from now' },
        { status: 400 }
      );
    }

    // Validate day of week
    const dayOfWeek = bookingDate.getDay();
    if (!WORKING_HOURS_DEFAULT.workDays.includes(dayOfWeek)) {
      return NextResponse.json(
        { error: 'Selected date is not a working day', message: 'Please select a weekday (Mon-Fri)' },
        { status: 400 }
      );
    }

    // Validate time format
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(time)) {
      return NextResponse.json(
        { error: 'Invalid time format' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if slot is still available (prevent double booking)
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['confirmed', 'rescheduled'])
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing bookings:', checkError);
      return NextResponse.json(
        { error: 'Failed to check availability', message: checkError.message },
        { status: 500 }
      );
    }

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is no longer available', message: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Check for blocked dates
    const { data: blockedDate, error: blockedError } = await supabase
      .from('blocked_dates')
      .select('id')
      .eq('date', date)
      .maybeSingle();

    if (blockedError) {
      console.error('Error checking blocked dates:', blockedError);
      // Non-critical — proceed with booking
    }

    if (blockedDate) {
      console.log('[Booking] Date blocked:', date, blockedDate);
      return NextResponse.json(
        { error: 'This date has been blocked by the admin', message: 'This date has been blocked and is not available for booking' },
        { status: 400 }
      );
    }

    console.log('[Booking] Creating booking:', { name, email, date, time, timezone });

    // Create booking
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        service: service || 'Strategy Session',
        date,
        time,
        timezone: timezone || 'UTC',
        status: 'confirmed',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating booking:', insertError);
      return NextResponse.json(
        { error: 'Failed to create booking', message: insertError.message, details: insertError },
        { status: 500 }
      );
    }

    // Send confirmation emails (non-blocking)
    try {
      await Promise.all([
        sendBookingConfirmation(booking),
        sendAdminNotification(booking),
      ]);
    } catch (emailError) {
      // Log but don't fail the booking
      console.error('Email sending failed:', emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use server client to get the logged-in user (reads cookies)
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use admin client for DB queries (bypasses RLS)
    const adminClient = createAdminClient();

    const { data: userData } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all bookings
    const { data: bookings, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
