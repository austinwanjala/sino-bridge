-- Supabase Seed Data for SinoBridge Chinese School

-- Clear existing data to prevent duplicates
TRUNCATE TABLE homepage_content, homepage_sections, programs, teachers, events, news_posts, gallery_images, gallery_albums, testimonials RESTART IDENTITY CASCADE;

-- Seed Homepage Sections and Content
INSERT INTO homepage_sections (section_type, is_visible) VALUES ('hero', true)
ON CONFLICT (section_type) DO NOTHING;

INSERT INTO homepage_content (section_type, content) VALUES
('hero', '{"heading": "Master Chinese, Connect with the World", "description": "SinoBridge offers immersive language programs blending traditional culture with modern learning methods. Start your journey today.", "image_url": "https://images.unsplash.com/photo-1543332143-4e8c27e3256f?q=80&w=2064&auto=format&fit=crop", "primary_btn_text": "Explore Classes", "primary_btn_link": "/classes", "secondary_btn_text": "Contact Us", "secondary_btn_link": "/contact"}');

-- Seed Programs
INSERT INTO programs (name, slug, level, short_description, image_url, is_active) VALUES
('YOUTH CHINESE TEST (YCT 1)', 'yct-1', 'Beginner', 'Introduction to Chinese for young learners. Focus on basic vocabulary and simple sentences.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),
('YOUTH CHINESE TEST (YCT 2)', 'yct-2', 'Beginner', 'Building on basics, young learners can communicate simply and directly on familiar topics.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),
('YOUTH CHINESE TEST (YCT 3)', 'yct-3', 'Intermediate', 'Reaching an excellent level of basic Chinese, students can handle familiar daily communications.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),
('YOUTH CHINESE TEST (YCT 4)', 'yct-4', 'Intermediate', 'Students can communicate in Chinese for basic, daily, and educational topics.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),
('YOUTH CHINESE TEST (YCT 5)', 'yct-5', 'Advanced', 'Students can communicate on broader topics in Chinese fluently.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),
('YOUTH CHINESE TEST (YCT 6)', 'yct-6', 'Advanced', 'Students achieve a high level of proficiency for young learners in daily communication.', 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=800&auto=format&fit=crop', true),

('HSK Level 1', 'hsk-1', 'Beginner', 'Understand and use very simple Chinese phrases, meet basic needs for communication.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 2', 'hsk-2', 'Beginner', 'Excellent grasp of basic Chinese and can communicate in simple and routine tasks.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 3', 'hsk-3', 'Intermediate', 'Communicate in Chinese at a basic level in daily, academic, and professional lives.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 4', 'hsk-4', 'Intermediate', 'Discuss a relatively wide range of topics in Chinese and are capable of communicating fluently.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 5', 'hsk-5', 'Advanced', 'Read Chinese newspapers and magazines, enjoy Chinese films and plays, and give speeches.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 6', 'hsk-6', 'Advanced', 'Easily comprehend written and spoken information in Chinese and express ideas fluently.', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=800&auto=format&fit=crop', true),
('HSK Level 7', 'hsk-7', 'Master', 'In-depth comprehension and complex communication for specialized topics and academic studies.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop', true),
('HSK Level 8', 'hsk-8', 'Master', 'High-level fluency and mastery of Chinese language nuances for advanced professional needs.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop', true),
('HSK Level 9', 'hsk-9', 'Expert', 'Native-level fluency for advanced translation, academic research, and deep cultural contexts.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop', true);

-- Seed Teachers
INSERT INTO teachers (full_name, position, short_bio, profile_photo_url, is_active, display_order) VALUES
('Li Wei', 'Senior Instructor', 'Over 15 years of experience teaching Chinese as a second language. Specializes in HSK preparation and business Chinese.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop', true, 1),
('Chen Ming', 'Cultural Ambassador', 'Expert in traditional Chinese arts including calligraphy and tea ceremony. Brings language to life through cultural immersion.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop', true, 2),
('Sarah Jenkins', 'Bilingual Coordinator', 'Fluent in Mandarin and English. Helps bridge the gap for absolute beginners and manages our study abroad programs.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop', true, 3);

-- Seed Events
INSERT INTO events (title, slug, event_date, start_time, venue, description, featured_image_url, status) VALUES
('Mid-Autumn Festival Celebration', 'mid-autumn-fest', CURRENT_DATE + INTERVAL '14 days', '18:00', 'Main Campus Courtyard', 'Join us for mooncakes, lantern making, and poetry reading as we celebrate the traditional Mid-Autumn Festival.', 'https://images.unsplash.com/photo-1599388316278-f29e1eb1fdf3?w=800&auto=format&fit=crop', 'published'),
('Calligraphy Workshop', 'calligraphy-workshop', CURRENT_DATE + INTERVAL '5 days', '14:00', 'Room 102', 'Learn the basics of traditional Chinese calligraphy with brush and ink. Materials provided.', 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=800&auto=format&fit=crop', 'published');

-- Seed News
INSERT INTO news_posts (title, slug, excerpt, content, featured_image_url, status, published_at) VALUES
('Enrollment Open for Spring Semester', 'spring-enrollment', 'Secure your spot for the upcoming semester. Early bird discounts apply.', 'We are excited to announce that registration for the Spring semester is now open. Whether you are starting your Chinese learning journey or aiming to pass your next HSK exam, we have the right class for you. Register before the end of the month to receive a 10% early bird discount.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop', 'published', NOW()),
('New Library Resources Added', 'new-library-resources', 'Hundreds of new graded readers and cultural books available.', 'Our campus library has just been updated with over 200 new graded readers, perfect for students from HSK 1 to HSK 6. We also added a new section on modern Chinese history and literature.', null, 'published', NOW());

-- Seed Gallery
INSERT INTO gallery_images (title, description, image_url, display_order, is_published) VALUES
('Spring Festival Gala', 'Events', 'https://images.unsplash.com/photo-1549216010-911cb75f64d0?w=800&auto=format&fit=crop', 1, true),
('Advanced Class Presentation', 'Academics', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop', 2, true),
('Tea Ceremony Workshop', 'Culture', 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&auto=format&fit=crop', 3, true);

-- Seed Testimonials
INSERT INTO testimonials (name, program, message, rating, is_active, display_order) VALUES
('James Wilson', 'Beginner Mandarin', 'I was intimidated by the characters at first, but the teachers here make it so logical and fun. I passed my HSK 2 after just one year!', 5, true, 1),
('Elena Rossi', 'Business Chinese', 'The business vocabulary and cultural etiquette I learned at SinoBridge were crucial for my company''s expansion into the Asian market.', 5, true, 2),
('David Chen', 'Intermediate Mandarin', 'Great community, passionate teachers, and excellent facilities. Highly recommended.', 4, true, 3);
