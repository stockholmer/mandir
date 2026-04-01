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
