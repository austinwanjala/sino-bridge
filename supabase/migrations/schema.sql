-- Enable pgcrypto for UUIDs if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: site_settings
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name TEXT NOT NULL DEFAULT 'SinoBridge Chinese School',
    logo_url TEXT,
    favicon_url TEXT,
    tagline TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    whatsapp TEXT,
    address TEXT,
    map_link TEXT,
    facebook TEXT,
    instagram TEXT,
    tiktok TEXT,
    youtube TEXT,
    linkedin TEXT,
    primary_color TEXT DEFAULT '#b91c1c',
    secondary_color TEXT DEFAULT '#1f2937',
    accent_color TEXT DEFAULT '#f59e0b',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    footer_description TEXT,
    copyright_text TEXT,
    useful_links JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: navigation_items
CREATE TABLE public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: homepage_sections
CREATE TABLE public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_type TEXT NOT NULL UNIQUE, -- e.g., 'hero', 'about', 'statistics'
    is_visible BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: homepage_content
CREATE TABLE public.homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_type TEXT NOT NULL REFERENCES public.homepage_sections(section_type) ON DELETE CASCADE,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: programs
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    level TEXT,
    duration TEXT,
    schedule TEXT,
    fee TEXT,
    cta_text TEXT DEFAULT 'Register Now',
    cta_link TEXT DEFAULT '/register',
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: teachers
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    profile_photo_url TEXT,
    position TEXT,
    short_bio TEXT,
    qualifications TEXT,
    specialization TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: timetable
CREATE TABLE public.timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    venue TEXT,
    mode TEXT NOT NULL DEFAULT 'Physical',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: fees
CREATE TABLE public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    level TEXT,
    registration_fee NUMERIC(10,2),
    tuition_fee NUMERIC(10,2),
    duration TEXT,
    payment_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: events
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    featured_image_url TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue TEXT,
    registration_link TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: gallery_albums
CREATE TABLE public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: gallery_images
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: news_posts
CREATE TABLE public.news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    featured_image_url TEXT,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    published_at TIMESTAMPTZ,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    photo_url TEXT,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    program TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: registration_requests
CREATE TABLE public.registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    age INTEGER,
    program_interested TEXT,
    preferred_class TEXT,
    preferred_schedule TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: contact_messages
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all non-sensitive tables
CREATE POLICY "Allow public read access" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.navigation_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public read access" ON public.homepage_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Allow public read access" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.programs FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.teachers FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.timetable FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.fees FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON public.events FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access" ON public.gallery_albums FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.gallery_images FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access" ON public.news_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (is_active = true);

-- Allow public to insert registration requests and contact messages
CREATE POLICY "Allow public insert" ON public.registration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to do everything (ALL) on all tables
CREATE POLICY "Allow admins ALL" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.navigation_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.homepage_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.homepage_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.teachers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.timetable FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.fees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.gallery_albums FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.news_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.registration_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins ALL" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Storage buckets
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);
insert into storage.buckets (id, name, public) values ('hero-images', 'hero-images', true);
insert into storage.buckets (id, name, public) values ('teachers', 'teachers', true);
insert into storage.buckets (id, name, public) values ('programs', 'programs', true);
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
insert into storage.buckets (id, name, public) values ('news', 'news', true);
insert into storage.buckets (id, name, public) values ('testimonials', 'testimonials', true);

-- Storage bucket policies (public read, admin write)
CREATE POLICY "Give public access to logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Give admins access to logos" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'logos');

CREATE POLICY "Give public access to hero-images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Give admins access to hero-images" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'hero-images');

CREATE POLICY "Give public access to teachers" ON storage.objects FOR SELECT USING (bucket_id = 'teachers');
CREATE POLICY "Give admins access to teachers" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'teachers');

CREATE POLICY "Give public access to programs" ON storage.objects FOR SELECT USING (bucket_id = 'programs');
CREATE POLICY "Give admins access to programs" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'programs');

CREATE POLICY "Give public access to gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Give admins access to gallery" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'gallery');

CREATE POLICY "Give public access to news" ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "Give admins access to news" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'news');

CREATE POLICY "Give public access to testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Give admins access to testimonials" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'testimonials');
