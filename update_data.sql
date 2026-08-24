-- Supabase SQL script to update SinoBridge data
-- Run this in your Supabase SQL Editor

-- 0. FIX SCHEMA MISMATCHES
-- Add columns expected by the UI that are missing from the schema.sql

ALTER TABLE fees ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE fees ADD COLUMN IF NOT EXISTS amount TEXT;
ALTER TABLE fees ADD COLUMN IF NOT EXISTS billing_cycle TEXT;
ALTER TABLE fees ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE fees ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE timetable ADD COLUMN IF NOT EXISTS class_name TEXT;
ALTER TABLE timetable ADD COLUMN IF NOT EXISTS day_of_week TEXT;
ALTER TABLE timetable ADD COLUMN IF NOT EXISTS room TEXT;

-- 1. Update Programs
TRUNCATE TABLE programs CASCADE;
INSERT INTO programs (name, slug, level, is_active, display_order) VALUES
('HSK 1', 'hsk-1', 'ELEMENTARY LEVEL', true, 1),
('HSK 2', 'hsk-2', 'ELEMENTARY LEVEL', true, 2),
('HSK 3', 'hsk-3', 'ELEMENTARY LEVEL', true, 3),
('HSK 4', 'hsk-4', 'INTERMEDIATE LEVEL', true, 4),
('HSK 5', 'hsk-5', 'INTERMEDIATE LEVEL', true, 5),
('HSK 6', 'hsk-6', 'INTERMEDIATE LEVEL', true, 6),
('HSK 7', 'hsk-7', 'ADVANCED LEVEL', true, 7),
('HSK 8', 'hsk-8', 'ADVANCED LEVEL', true, 8),
('HSK 9', 'hsk-9', 'ADVANCED LEVEL', true, 9);

-- 2. Update Fees
TRUNCATE TABLE fees CASCADE;
INSERT INTO fees (title, amount, is_active, display_order) VALUES
('HSK 1 COST', '58 USD', true, 1),
('HSK 2 COST', '73 USD', true, 2),
('HSK 3 COST', '115 USD', true, 3),
('HSK 4 COST', '193 USD', true, 4),
('HSK 5 COST', '310 USD', true, 5),
('HSK 6 COST', '540 USD', true, 6);

-- 3. Update Teachers
TRUNCATE TABLE teachers CASCADE;
INSERT INTO teachers (full_name, position, is_active, display_order) VALUES
('Jing Wu 老师', 'Senior Instructor', true, 1),
('Antony 老师', 'Senior Instructor', true, 2),
('Albert 老师', 'Bilingual Coordinator', true, 3);

-- 4. Update Events
TRUNCATE TABLE events CASCADE;
-- Also setting slug and event_date as they are NOT NULL
INSERT INTO events (title, slug, event_date, is_active) VALUES
('Annual Chinese Bee Competition', 'annual-chinese-bee', CURRENT_DATE + INTERVAL '10 days', true),
('Chinese Bridge Competition', 'chinese-bridge', CURRENT_DATE + INTERVAL '20 days', true),
('Dragon Boat Festival', 'dragon-boat', CURRENT_DATE + INTERVAL '30 days', true),
('Wish Festival', 'wish-festival', CURRENT_DATE + INTERVAL '40 days', true);

-- 5. Update Timetable (Example entries for Early morning, Daytime, Late Evening)
TRUNCATE TABLE timetable CASCADE;
-- day and start_time, end_time are NOT NULL in original schema
INSERT INTO timetable (class_name, day, day_of_week, start_time, end_time, room) VALUES
('Early Morning Class', 'Monday', 'Monday', '06:00:00', '08:00:00', 'Room A'),
('Daytime Class', 'Wednesday', 'Wednesday', '10:00:00', '12:00:00', 'Room B'),
('Late Evening Class', 'Friday', 'Friday', '18:00:00', '20:00:00', 'Room C');
