import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendCancellationEmail, sendRescheduleEmail, sendStatusUpdateEmail } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check if user is authenticated admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const body = await request.json();
    const { status, date, time } = body;

    // Fetch existing booking
    const { data: existingBooking, error: fetchError } = await adminClient
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updates: Record<string, unknown> = {};
    
    if (status) {
      updates.status = status;
    }
    
    if (date && time) {
      // Check if new slot is available
      const { data: conflictingBooking } = await adminClient
        .from('bookings')
        .select('id')
        .eq('date', date)
        .eq('time', time)
        .in('status', ['confirmed', 'rescheduled'])
        .neq('id', id)
        .single();

      if (conflictingBooking) {
        return NextResponse.json(
          { error: 'New time slot is not available' },
          { status: 409 }
        );
      }

      updates.date = date;
      updates.time = time;
      updates.status = 'rescheduled';
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await adminClient
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    // Send notification emails
    try {
      if (status === 'cancelled') {
        await sendCancellationEmail(updatedBooking);
      } else if (updates.date && updates.time) {
        await sendRescheduleEmail(updatedBooking, existingBooking);
      } else if (status === 'confirmed' || status === 'completed') {
        await sendStatusUpdateEmail(updatedBooking);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const adminDel = createAdminClient();

    // Check if user is authenticated admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: userData } = await adminDel
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

    // Fetch booking first for email notification
    const { data: booking } = await adminDel
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    const { error: deleteError } = await adminDel
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting booking:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: 500 }
      );
    }

    // Send cancellation email
    try {
      await sendCancellationEmail(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
