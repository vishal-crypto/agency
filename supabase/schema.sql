-- Supabase Database Schema for Digital Marketing Agency Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING POLICIES (for re-running)
-- ============================================
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Anyone can create booking" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read working hours" ON working_hours;
DROP POLICY IF EXISTS "Admins can modify working hours" ON working_hours;
DROP POLICY IF EXISTS "Anyone can read blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Admins can modify blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Anyone can read availability" ON availability;
DROP POLICY IF EXISTS "Admins can modify availability" ON availability;
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Admins can modify settings" ON settings;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data, admins can read all
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'role') = 'service_role'
    OR role = 'admin' AND auth.uid() = id
  );

-- Only admins can update user roles
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT NOT NULL,
  message TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  timezone TEXT DEFAULT 'America/New_York',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a booking (guest booking)
CREATE POLICY "Anyone can create booking" ON bookings
  FOR INSERT WITH CHECK (true);

-- Guests can view their booking with confirmation code (using email match in app)
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (true);

-- Only admins can update bookings
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (true);

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings" ON bookings
  FOR DELETE USING (true);

-- Index for common queries
DROP INDEX IF EXISTS idx_bookings_date;
DROP INDEX IF EXISTS idx_bookings_email;
DROP INDEX IF EXISTS idx_bookings_status;
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- WORKING HOURS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Enable RLS
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

-- Anyone can read working hours (for booking availability)
CREATE POLICY "Anyone can read working hours" ON working_hours
  FOR SELECT USING (true);

-- Only admins can modify working hours
CREATE POLICY "Admins can modify working hours" ON working_hours
  FOR ALL USING (true);

-- Insert default working hours (Mon-Fri 9am-5pm)
INSERT INTO working_hours (day_of_week, start_time, end_time, is_enabled) VALUES
  (0, '09:00', '17:00', false),  -- Sunday
  (1, '09:00', '17:00', true),   -- Monday
  (2, '09:00', '17:00', true),   -- Tuesday
  (3, '09:00', '17:00', true),   -- Wednesday
  (4, '09:00', '17:00', true),   -- Thursday
  (5, '09:00', '17:00', true),   -- Friday
  (6, '09:00', '17:00', false)   -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- ============================================
-- BLOCKED DATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Anyone can read blocked dates (for booking availability)
CREATE POLICY "Anyone can read blocked dates" ON blocked_dates
  FOR SELECT USING (true);

-- Only admins can modify blocked dates
CREATE POLICY "Admins can modify blocked dates" ON blocked_dates
  FOR ALL USING (true);

-- Index for date lookups
DROP INDEX IF EXISTS idx_blocked_dates_date;
CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);

-- ============================================
-- AVAILABILITY TABLE (Optional - for more complex scheduling)
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, time_slot)
);

-- Enable RLS
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Anyone can read availability
CREATE POLICY "Anyone can read availability" ON availability
  FOR SELECT USING (true);

-- Only admins can modify availability
CREATE POLICY "Admins can modify availability" ON availability
  FOR ALL USING (true);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read public settings
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can modify settings" ON settings
  FOR ALL USING (true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('booking', '{"duration": 30, "buffer": 15, "maxAdvanceDays": 60, "timezone": "America/New_York"}'),
  ('notifications', '{"emailEnabled": true, "smsEnabled": false, "adminEmail": "admin@example.com"}'),
  ('company', '{"name": "Elevate Agency", "email": "contact@elevate.agency", "phone": "+1 (555) 123-4567"}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_working_hours_updated_at ON working_hours;
DROP TRIGGER IF EXISTS update_availability_updated_at ON availability;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at  
  BEFORE UPDATE ON working_hours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user record on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    CASE WHEN NEW.email = 'vishalrathod1351@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- CREATE AN ADMIN USER
-- ============================================
-- After running this script, create a user through Supabase Auth,
-- then run this to make them an admin:
-- 
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
