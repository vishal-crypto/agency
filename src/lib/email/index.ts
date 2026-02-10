import { Booking } from '@/types';
import { format } from 'date-fns';
import { formatTimeDisplay } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import nodemailer from 'nodemailer';

// Gmail SMTP email sending
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD; // Google App Password
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vishalrathod1351@gmail.com';

interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    console.warn('[Email] SMTP_EMAIL or SMTP_PASSWORD not set. Skipping email.');
    console.log('[Email] Would have sent:', { to: payload.to, subject: payload.subject });
    return true;
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${SITE_CONFIG.name}" <${SMTP_EMAIL}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    console.log('[Email] Sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

function getEmailTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 32px;
          }
          .detail-row {
            display: flex;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            margin-bottom: 12px;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
            width: 100px;
          }
          .detail-value {
            color: #1a1a1a;
          }
          .footer {
            padding: 24px 32px;
            background: #f9fafb;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #7c3aed;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            margin-top: 24px;
          }
          .booking-id {
            background: #ede9fe;
            color: #7c3aed;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 24px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${SITE_CONFIG.name}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.</p>
            <p>${SITE_CONFIG.address}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendBookingConfirmation(booking: Booking): Promise<boolean> {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = formatTimeDisplay(booking.time);

  const content = `
    <h2 style="margin-top: 0;">Booking Confirmed!</h2>
    <p>Hi ${booking.name},</p>
    <p>Your strategy call has been successfully scheduled. Here are the details:</p>
    
    <div class="booking-id">Booking ID: ${booking.id}</div>
    
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${formattedDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time</span>
      <span class="detail-value">${formattedTime} (${booking.timezone || 'UTC'})</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Duration</span>
      <span class="detail-value">30 minutes</span>
    </div>
    
    <p>We'll send you a calendar invite with the meeting link shortly.</p>
    <p>If you need to reschedule or cancel, please contact us at <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.</p>
    
    <p style="margin-top: 32px;">Looking forward to speaking with you!</p>
    <p><strong>The ${SITE_CONFIG.name} Team</strong></p>
  `;

  return sendEmail({
    from: SMTP_EMAIL || 'noreply@elevateagency.com',
    to: booking.email,
    subject: `Booking Confirmed - ${formattedDate} at ${formattedTime}`,
    html: getEmailTemplate(content, 'Booking Confirmed'),
  });
}

export async function sendAdminNotification(booking: Booking): Promise<boolean> {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = formatTimeDisplay(booking.time);

  const content = `
    <h2 style="margin-top: 0;">New Booking Received</h2>
    <p>A new strategy call has been booked:</p>
    
    <div class="booking-id">Booking ID: ${booking.id}</div>
    
    <div class="detail-row">
      <span class="detail-label">Name</span>
      <span class="detail-value">${booking.name}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Email</span>
      <span class="detail-value">${booking.email}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${formattedDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time</span>
      <span class="detail-value">${formattedTime} (${booking.timezone || 'UTC'})</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Booked At</span>
      <span class="detail-value">${format(new Date(booking.created_at), 'PPpp')}</span>
    </div>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" class="button">View in Dashboard</a>
  `;

  return sendEmail({
    from: SMTP_EMAIL || 'noreply@elevateagency.com',
    to: ADMIN_EMAIL,
    subject: `New Booking: ${booking.name} - ${formattedDate}`,
    html: getEmailTemplate(content, 'New Booking'),
  });
}

export async function sendCancellationEmail(booking: Booking): Promise<boolean> {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = formatTimeDisplay(booking.time);

  const content = `
    <h2 style="margin-top: 0;">Booking Cancelled</h2>
    <p>Hi ${booking.name},</p>
    <p>Your strategy call has been cancelled. Here were the original details:</p>
    
    <div class="booking-id">Booking ID: ${booking.id}</div>
    
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${formattedDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time</span>
      <span class="detail-value">${formattedTime}</span>
    </div>
    
    <p>If you'd like to book a new call, please visit our website:</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/book" class="button">Book a New Call</a>
    
    <p style="margin-top: 32px;">If you have any questions, please contact us at <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.</p>
  `;

  return sendEmail({
    from: SMTP_EMAIL || 'noreply@elevateagency.com',
    to: booking.email,
    subject: `Booking Cancelled - ${formattedDate}`,
    html: getEmailTemplate(content, 'Booking Cancelled'),
  });
}

export async function sendStatusUpdateEmail(booking: Booking): Promise<boolean> {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = formatTimeDisplay(booking.time);

  const statusLabel = booking.status === 'confirmed' ? 'Approved & Confirmed' : 'Completed';
  const statusColor = booking.status === 'confirmed' ? '#22c55e' : '#3b82f6';
  const statusEmoji = booking.status === 'confirmed' ? '✅' : '🎉';

  const content = `
    <h2 style="margin-top: 0;">${statusEmoji} Booking ${statusLabel}!</h2>
    <p>Hi ${booking.name},</p>
    <p>Great news! Your strategy call has been <strong style="color: ${statusColor};">${statusLabel.toLowerCase()}</strong> by our team.</p>
    
    <div class="booking-id">Booking ID: ${booking.id}</div>
    
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${formattedDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time</span>
      <span class="detail-value">${formattedTime} (${booking.timezone || 'UTC'})</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Duration</span>
      <span class="detail-value">30 minutes</span>
    </div>
    <div class="detail-row" style="background: ${booking.status === 'confirmed' ? '#f0fdf4' : '#eff6ff'};">
      <span class="detail-label">Status</span>
      <span class="detail-value" style="color: ${statusColor}; font-weight: bold;">${statusLabel}</span>
    </div>
    
    ${booking.status === 'confirmed' ? `
      <p>We'll send you a calendar invite with the meeting link shortly. Please make sure to join on time.</p>
      <p>If you need to reschedule or cancel, please contact us at <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.</p>
    ` : `
      <p>Thank you for your time! We hope the session was valuable.</p>
      <p>If you'd like to discuss next steps, feel free to book another call:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/book" class="button">Book Another Call</a>
    `}
    
    <p style="margin-top: 32px;">Best regards,</p>
    <p><strong>The ${SITE_CONFIG.name} Team</strong></p>
  `;

  return sendEmail({
    from: SMTP_EMAIL || 'noreply@elevateagency.com',
    to: booking.email,
    subject: `${statusEmoji} Booking ${statusLabel} - ${formattedDate} at ${formattedTime}`,
    html: getEmailTemplate(content, `Booking ${statusLabel}`),
  });
}

export async function sendRescheduleEmail(
  newBooking: Booking,
  oldBooking: Booking
): Promise<boolean> {
  const oldDate = format(new Date(oldBooking.date), 'EEEE, MMMM d, yyyy');
  const oldTime = formatTimeDisplay(oldBooking.time);
  const newDate = format(new Date(newBooking.date), 'EEEE, MMMM d, yyyy');
  const newTime = formatTimeDisplay(newBooking.time);

  const content = `
    <h2 style="margin-top: 0;">Booking Rescheduled</h2>
    <p>Hi ${newBooking.name},</p>
    <p>Your strategy call has been rescheduled. Here are the updated details:</p>
    
    <div class="booking-id">Booking ID: ${newBooking.id}</div>
    
    <h3 style="color: #ef4444; margin-bottom: 8px;">Previous Time (Cancelled)</h3>
    <div class="detail-row" style="background: #fef2f2;">
      <span class="detail-label">Date</span>
      <span class="detail-value" style="text-decoration: line-through;">${oldDate} at ${oldTime}</span>
    </div>
    
    <h3 style="color: #22c55e; margin-bottom: 8px;">New Time</h3>
    <div class="detail-row" style="background: #f0fdf4;">
      <span class="detail-label">Date</span>
      <span class="detail-value">${newDate}</span>
    </div>
    <div class="detail-row" style="background: #f0fdf4;">
      <span class="detail-label">Time</span>
      <span class="detail-value">${newTime} (${newBooking.timezone || 'UTC'})</span>
    </div>
    
    <p>We'll send you an updated calendar invite shortly.</p>
    <p>If you have any questions, please contact us at <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.</p>
    
    <p style="margin-top: 32px;">Looking forward to speaking with you!</p>
    <p><strong>The ${SITE_CONFIG.name} Team</strong></p>
  `;

  return sendEmail({
    from: SMTP_EMAIL || 'noreply@elevateagency.com',
    to: newBooking.email,
    subject: `Booking Rescheduled - ${newDate} at ${newTime}`,
    html: getEmailTemplate(content, 'Booking Rescheduled'),
  });
}
