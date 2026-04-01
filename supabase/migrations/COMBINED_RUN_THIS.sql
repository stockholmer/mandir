-- Hindu Mandir Stockholm — Initial Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE membership_type AS ENUM ('family', 'single');
CREATE TYPE member_status AS ENUM ('pending', 'active', 'expired');
CREATE TYPE donation_type AS ENUM ('one_time', 'monthly', 'yearly');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE payment_method AS ENUM ('swish', 'bankgiro', 'stripe', 'cash');
CREATE TYPE event_category AS ENUM ('puja', 'festival', 'cultural');
CREATE TYPE bhandara_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE data_request_type AS ENUM ('export', 'delete');
CREATE TYPE data_request_status AS ENUM ('pending', 'processing', 'completed');
CREATE TYPE feedback_type AS ENUM ('suggestion', 'bug', 'compliment', 'other');
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'viewer');
CREATE TYPE audit_action AS ENUM ('login', 'logout', 'create', 'update', 'delete', 'export', 'settings_change');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE newsletter_issue_type AS ENUM ('pdf', 'rich_text');
CREATE TYPE announcement_type AS ENUM ('news', 'event', 'urgent');

-- ============================================================
-- ADMINS (must come first — referenced by blog_posts)
-- ============================================================
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'viewer',
  display_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- ============================================================
-- MEMBERS (temple membership)
-- ============================================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  membership_type membership_type NOT NULL DEFAULT 'single',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  membership_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM now())::INT,
  membership_years INT[] NOT NULL DEFAULT ARRAY[]::INT[],
  auto_renewal BOOLEAN NOT NULL DEFAULT false,
  status member_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);

-- ============================================================
-- DONATIONS
-- ============================================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  type donation_type NOT NULL DEFAULT 'one_time',
  in_memory_of TEXT DEFAULT '',
  in_honour_of TEXT DEFAULT '',
  donor_name TEXT DEFAULT 'Anonymous',
  donor_email TEXT DEFAULT '',
  donor_phone TEXT DEFAULT '',
  payment_method payment_method,
  status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  swish_payment_id TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_donor_email ON donations(donor_email);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  time_display TEXT DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  category event_category,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_published ON events(is_published, date);

-- ============================================================
-- RSVPS
-- ============================================================
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  number_of_guests INT NOT NULL DEFAULT 1 CHECK (number_of_guests > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rsvps_event ON rsvps(event_id);

-- ============================================================
-- TIMESLOT EVENTS & TIMESLOTS
-- ============================================================
CREATE TABLE timeslot_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  image_url TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  allow_multiple_bookings BOOLEAN NOT NULL DEFAULT false,
  linked_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeslot_events_active ON timeslot_events(is_active, date);

CREATE TABLE timeslots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES timeslot_events(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  booked_by_name TEXT,
  booked_by_phone TEXT,
  booked_by_email TEXT,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_times CHECK (end_time > start_time)
);

CREATE INDEX idx_timeslots_event ON timeslots(event_id);
CREATE INDEX idx_timeslots_booked ON timeslots(is_booked);

-- ============================================================
-- BHANDARA BOOKINGS
-- ============================================================
CREATE TABLE bhandara_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  occasion TEXT NOT NULL DEFAULT '',
  number_of_guests INT NOT NULL DEFAULT 1,
  special_requirements TEXT DEFAULT '',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status bhandara_status NOT NULL DEFAULT 'pending',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bhandara_date ON bhandara_bookings(date);

-- ============================================================
-- PAYMENTS (membership payments)
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  method payment_method NOT NULL,
  receipt_number TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status payment_status NOT NULL DEFAULT 'completed',
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_member ON payments(member_id);

-- ============================================================
-- NEWSLETTER
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_subs_active ON newsletter_subscribers(is_active);

CREATE TABLE newsletter_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type newsletter_issue_type NOT NULL DEFAULT 'pdf',
  pdf_url TEXT,
  content_html TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- BLOG POSTS (one row per locale per post)
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'sv',
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content_html TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  author_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  category TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status blog_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(slug, locale)
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- ============================================================
-- ANNOUNCEMENTS / NEWS
-- ============================================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL DEFAULT '{}',
  body JSONB NOT NULL DEFAULT '{}',
  type announcement_type NOT NULL DEFAULT 'news',
  linked_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  notify_subscribers BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_published ON announcements(is_published, published_at DESC);

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FEEDBACK
-- ============================================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  type feedback_type NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- VOLUNTEERS
-- ============================================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  availability TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  experience TEXT DEFAULT '',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DATA REQUESTS (GDPR)
-- ============================================================
CREATE TABLE data_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type data_request_type NOT NULL,
  message TEXT DEFAULT '',
  status data_request_status NOT NULL DEFAULT 'pending',
  verification_token TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action audit_action NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  user_id UUID,
  user_email TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_table ON audit_log(table_name, created_at DESC);

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  album TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_photos_album ON gallery_photos(album, sort_order);

CREATE TABLE gallery_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SETTINGS (key-value)
-- ============================================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CONSENT RECORDS (GDPR)
-- ============================================================
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_email ON consent_records(email);

-- ============================================================
-- LIBRARY: BOOKS
-- ============================================================
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn TEXT DEFAULT '',
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT DEFAULT '',
  language TEXT NOT NULL DEFAULT 'Sanskrit' CHECK (language IN ('Sanskrit', 'Hindi', 'English', 'Swedish')),
  category TEXT DEFAULT '',
  total_copies INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
  available_copies INT NOT NULL DEFAULT 1 CHECK (available_copies >= 0),
  shelf_location TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- LIBRARY: MEMBERS (library card holders)
-- ============================================================
CREATE TABLE library_members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  member_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- LIBRARY: BORROWINGS
-- ============================================================
CREATE TABLE borrowings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
  borrowed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days')::DATE,
  returned_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_borrowings_book ON borrowings(book_id);
CREATE INDEX idx_borrowings_member ON borrowings(member_id);
CREATE INDEX idx_borrowings_active ON borrowings(returned_date) WHERE returned_date IS NULL;

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_members_updated BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_newsletter_issues_updated BEFORE UPDATE ON newsletter_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_data_requests_updated BEFORE UPDATE ON data_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_books_updated BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: Book availability tracking
-- ============================================================
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE books SET available_copies = available_copies - 1 WHERE id = NEW.book_id AND available_copies > 0;
  ELSIF TG_OP = 'UPDATE' AND OLD.returned_date IS NULL AND NEW.returned_date IS NOT NULL THEN
    UPDATE books SET available_copies = available_copies + 1 WHERE id = NEW.book_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_borrowing_availability
  AFTER INSERT OR UPDATE ON borrowings
  FOR EACH ROW EXECUTE FUNCTION update_book_availability();

-- ============================================================
-- TRIGGER: Generate library member number
-- ============================================================
CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INT;
  year_str TEXT;
BEGIN
  IF NEW.member_number IS NULL OR NEW.member_number = '' THEN
    year_str := EXTRACT(YEAR FROM now())::TEXT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(member_number FROM 9) AS INT)), 0) + 1
    INTO next_num
    FROM library_members
    WHERE member_number LIKE 'TL-' || year_str || '-%';
    NEW.member_number := 'TL-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_member_number
  BEFORE INSERT ON library_members
  FOR EACH ROW EXECUTE FUNCTION generate_member_number();

-- ============================================================
-- FUNCTION: Atomic timeslot booking
-- ============================================================
CREATE OR REPLACE FUNCTION book_timeslot(
  p_slot_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_is_booked BOOLEAN;
BEGIN
  SELECT is_booked INTO v_is_booked
  FROM timeslots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF v_is_booked IS NULL THEN
    RAISE EXCEPTION 'Timeslot not found';
  END IF;

  IF v_is_booked THEN
    RETURN false;
  END IF;

  UPDATE timeslots SET
    is_booked = true,
    booked_by_name = p_name,
    booked_by_phone = p_phone,
    booked_by_email = p_email,
    booked_at = now()
  WHERE id = p_slot_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: GDPR data export
-- ============================================================
CREATE OR REPLACE FUNCTION export_user_data(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  normalized_email TEXT := lower(trim(p_email));
BEGIN
  SELECT COALESCE(jsonb_agg(row_data), '[]'::JSONB)
  INTO result
  FROM (
    SELECT jsonb_build_object('source', 'members', 'data', to_jsonb(t)) AS row_data FROM members t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'donations', 'data', to_jsonb(t)) FROM donations t WHERE lower(donor_email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'contacts', 'data', to_jsonb(t)) FROM contacts t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'bhandara_bookings', 'data', to_jsonb(t)) FROM bhandara_bookings t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'volunteers', 'data', to_jsonb(t)) FROM volunteers t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'newsletter_subscribers', 'data', to_jsonb(t)) FROM newsletter_subscribers t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'timeslots', 'data', to_jsonb(t)) FROM timeslots t WHERE lower(booked_by_email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'feedback', 'data', to_jsonb(t)) FROM feedback t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'rsvps', 'data', to_jsonb(t)) FROM rsvps t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'data_requests', 'data', to_jsonb(t)) FROM data_requests t WHERE lower(email) = normalized_email
    UNION ALL
    SELECT jsonb_build_object('source', 'consent_records', 'data', to_jsonb(t)) FROM consent_records t WHERE lower(email) = normalized_email
  ) sub;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VIEW: Public timeslots (hides PII)
-- ============================================================
CREATE VIEW public_timeslots AS
  SELECT id, event_id, start_time, end_time, is_booked
  FROM timeslots;

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('liveStream', '{"isLive": false, "videoId": ""}'::JSONB),
  ('site', '{"logoUrl": "", "phone": "", "email": "", "address": ""}'::JSONB);
-- Hindu Mandir Stockholm — Row Level Security Policies

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid() AND role = 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeslot_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bhandara_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PUBLIC READ: Published content visible to everyone
-- ============================================================

-- Events
CREATE POLICY "Public read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage events" ON events FOR ALL USING (is_admin());

-- Gallery
CREATE POLICY "Public read photos" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Admins manage photos" ON gallery_photos FOR ALL USING (is_admin());

CREATE POLICY "Public read videos" ON gallery_videos FOR SELECT USING (true);
CREATE POLICY "Admins manage videos" ON gallery_videos FOR ALL USING (is_admin());

-- Newsletter issues (published only)
CREATE POLICY "Public read published issues" ON newsletter_issues FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage issues" ON newsletter_issues FOR ALL USING (is_admin());

-- Blog posts (published only)
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage posts" ON blog_posts FOR ALL USING (is_admin());

-- Announcements (published, non-expired)
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (is_published = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL USING (is_admin());

-- Settings (public read for live stream config etc.)
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON settings FOR ALL USING (is_admin());

-- Timeslot events (active only)
CREATE POLICY "Public read active timeslot events" ON timeslot_events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage timeslot events" ON timeslot_events FOR ALL USING (is_admin());

-- Timeslots: admins only (public uses the public_timeslots VIEW)
CREATE POLICY "Admins manage timeslots" ON timeslots FOR ALL USING (is_admin());

-- Books: everyone can see the catalog
CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Admins manage books" ON books FOR ALL USING (is_admin());

-- ============================================================
-- ADMIN-ONLY TABLES
-- ============================================================

CREATE POLICY "Admins manage members" ON members FOR ALL USING (is_admin());
CREATE POLICY "Admins manage donations" ON donations FOR ALL USING (is_admin());
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());
CREATE POLICY "Admins manage rsvps" ON rsvps FOR ALL USING (is_admin());
CREATE POLICY "Admins manage bhandara" ON bhandara_bookings FOR ALL USING (is_admin());
CREATE POLICY "Admins manage contacts" ON contacts FOR ALL USING (is_admin());
CREATE POLICY "Admins manage feedback" ON feedback FOR ALL USING (is_admin());
CREATE POLICY "Admins manage volunteers" ON volunteers FOR ALL USING (is_admin());
CREATE POLICY "Admins manage data_requests" ON data_requests FOR ALL USING (is_admin());
CREATE POLICY "Admins manage subscribers" ON newsletter_subscribers FOR ALL USING (is_admin());
CREATE POLICY "Admins manage audit_log" ON audit_log FOR ALL USING (is_admin());
CREATE POLICY "Admins manage consent" ON consent_records FOR ALL USING (is_admin());

-- ============================================================
-- ADMINS TABLE: own record + super_admin management
-- ============================================================
CREATE POLICY "Users read own admin record" ON admins FOR SELECT USING (id = auth.uid());
CREATE POLICY "Super admins manage admins" ON admins FOR ALL USING (is_super_admin());

-- ============================================================
-- LIBRARY: Members can see own profile, admins manage all
-- ============================================================
CREATE POLICY "Users read own library profile" ON library_members FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins manage library members" ON library_members FOR ALL USING (is_admin());

-- Borrowings: users see own, admins manage all
CREATE POLICY "Users read own borrowings" ON borrowings FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Admins manage borrowings" ON borrowings FOR ALL USING (is_admin());

-- ============================================================
-- GRANT access to public_timeslots VIEW
-- ============================================================
GRANT SELECT ON public_timeslots TO anon;
GRANT SELECT ON public_timeslots TO authenticated;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('newsletters', 'newsletters', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT DO NOTHING;

-- Storage policies: public read
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read newsletters" ON storage.objects FOR SELECT USING (bucket_id = 'newsletters');
CREATE POLICY "Public read blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- Storage policies: admin write
CREATE POLICY "Admins upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND is_admin());
CREATE POLICY "Admins delete gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND is_admin());
CREATE POLICY "Admins upload newsletters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'newsletters' AND is_admin());
CREATE POLICY "Admins delete newsletters" ON storage.objects FOR DELETE USING (bucket_id = 'newsletters' AND is_admin());
CREATE POLICY "Admins upload blog-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND is_admin());
CREATE POLICY "Admins delete blog-images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND is_admin());
CREATE POLICY "Admins upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND is_admin());
CREATE POLICY "Admins delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND is_admin());
