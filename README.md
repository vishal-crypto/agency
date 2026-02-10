# Elevate Digital Marketing Agency

A production-ready SaaS platform for digital marketing agencies built with Next.js 16+, TypeScript, Tailwind CSS, Framer Motion, Zustand, and Supabase.

## Features

### Public Website

- **Home Page** - Hero section, services overview, testimonials, CTA
- **Services Page** - Detailed breakdown of all digital marketing services
- **Case Studies** - Real results with metrics and testimonials
- **About Page** - Team info, values, mission
- **Book a Call** - Multi-step booking flow with calendar and time selection

### Booking System

- Guest booking (no login required)
- Real-time availability checking
- Timezone-aware scheduling
- Service selection
- Email confirmations
- Booking management

### Admin Dashboard

- **Bookings Management** - View, filter, update status, add notes
- **Availability Settings** - Configure working hours by day
- **Blocked Dates** - Block specific dates with reasons
- **Settings** - Booking configuration, notification preferences

### Technical Features

- Premium dark theme UI with smooth Framer Motion animations
- Responsive design for all devices
- Type-safe with full TypeScript coverage
- Zustand state management with persistence
- Supabase for authentication and database
- Transactional email system with Resend
- Protected admin routes with middleware
- Rate limiting on API endpoints

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (Auth, PostgreSQL, RLS)
- **Email**: Resend
- **Icons**: Lucide React
- **Date Handling**: date-fns + date-fns-tz

## Getting Started

### 1. Clone and Install

```bash
cd Agency
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the schema file: `supabase/schema.sql`
4. Create an admin user through Supabase Auth UI
5. Update the user's role to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Public pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── book/              # Booking flow
│   └── login/             # Admin login
├── components/
│   ├── admin/             # Admin components
│   ├── booking/           # Booking components
│   ├── layout/            # Header, Footer
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── lib/
│   ├── supabase/          # Supabase client setup
│   ├── utils/             # Helper functions
│   ├── constants.ts       # Site config, services
│   └── email/             # Email templates
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## API Routes

| Endpoint                          | Method   | Description              |
| --------------------------------- | -------- | ------------------------ |
| `/api/availability`               | GET      | Get available time slots |
| `/api/availability/blocked-dates` | GET      | Get blocked dates        |
| `/api/bookings`                   | POST     | Create new booking       |
| `/api/bookings`                   | GET      | Get bookings (admin)     |
| `/api/bookings/[id]`              | PATCH    | Update booking           |
| `/api/bookings/[id]`              | DELETE   | Cancel booking           |
| `/api/admin/blocked-dates`        | GET/POST | Manage blocked dates     |
| `/api/admin/blocked-dates/[id]`   | DELETE   | Remove blocked date      |
| `/api/admin/working-hours`        | GET/POST | Manage working hours     |
| `/api/auth/logout`                | POST     | Sign out                 |

## Customization

### Site Configuration

Update `src/lib/constants.ts` to customize:

- Site name, tagline, contact info
- Navigation links
- Services list
- Testimonials
- Case studies
- Working hours defaults

### Theme Colors

The theme uses zinc (grays) and violet (accent). Customize in `tailwind.config.ts` and `globals.css`.

### Email Templates

Edit templates in `src/lib/email/index.ts` to customize:

- Confirmation emails
- Admin notifications
- Cancellation emails
- Reschedule emails

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-hosted

```bash
npm run build
npm start
```

## Environment Variables for Production

Ensure all variables are set in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production domain)

## License

MIT
