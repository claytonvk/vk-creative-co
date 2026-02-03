-- Seed initial categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Weddings', 'weddings', 'Wedding photography and videography', 1),
  ('Brand', 'brand', 'Brand and commercial photography', 2),
  ('Lifestyle', 'lifestyle', 'Lifestyle and portrait photography', 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial site settings for hero section
INSERT INTO site_settings (key, value, category, description) VALUES
  ('hero_title', 'Capturing Life''s Beautiful Moments', 'hero', 'Main hero headline'),
  ('hero_subtitle', 'Professional photography and videography for weddings, brands, and lifestyle', 'hero', 'Hero subtitle text'),
  ('hero_cta_text', 'View Portfolio', 'hero', 'Primary CTA button text'),
  ('hero_cta_link', '/portfolio', 'hero', 'Primary CTA button link'),
  ('hero_secondary_cta_text', 'Book a Session', 'hero', 'Secondary CTA button text'),
  ('hero_secondary_cta_link', '/contact', 'hero', 'Secondary CTA button link')
ON CONFLICT (key) DO NOTHING;

-- Seed initial site settings for contact info
INSERT INTO site_settings (key, value, category, description) VALUES
  ('contact_email', 'hello@vkstudios.com', 'contact', 'Primary contact email'),
  ('contact_phone', '(555) 123-4567', 'contact', 'Contact phone number'),
  ('contact_address', '123 Creative Way, Los Angeles, CA 90001', 'contact', 'Studio address'),
  ('contact_hours', 'Mon-Fri: 9am-5pm PST', 'contact', 'Business hours')
ON CONFLICT (key) DO NOTHING;

-- Seed initial site settings for social links
INSERT INTO site_settings (key, value, category, description) VALUES
  ('social_instagram', 'https://instagram.com/vkstudios', 'social', 'Instagram profile URL'),
  ('social_facebook', 'https://facebook.com/vkstudios', 'social', 'Facebook page URL'),
  ('social_pinterest', 'https://pinterest.com/vkstudios', 'social', 'Pinterest profile URL'),
  ('social_tiktok', '', 'social', 'TikTok profile URL')
ON CONFLICT (key) DO NOTHING;

-- Seed initial site settings for about page
INSERT INTO site_settings (key, value, category, description) VALUES
  ('about_headline', 'Our Story', 'about', 'About page main headline'),
  ('about_intro', 'We believe every moment tells a story worth preserving.', 'about', 'About page intro text'),
  ('about_content', 'With over a decade of experience in photography and videography, we specialize in capturing authentic moments that reflect your unique story. Our approach combines artistic vision with technical excellence to create timeless images you''ll treasure forever.', 'about', 'About page main content'),
  ('about_image', '/images/about-studio.jpg', 'about', 'About page featured image')
ON CONFLICT (key) DO NOTHING;

-- Seed initial site settings for footer
INSERT INTO site_settings (key, value, category, description) VALUES
  ('footer_tagline', 'Creating timeless memories, one frame at a time.', 'footer', 'Footer tagline'),
  ('footer_copyright', '© 2024 VK Studios. All rights reserved.', 'footer', 'Copyright text')
ON CONFLICT (key) DO NOTHING;

-- Seed sample value props
INSERT INTO value_props (title, description, icon, display_order) VALUES
  ('Authentic Storytelling', 'We capture genuine moments and emotions that tell your unique story naturally.', 'heart', 1),
  ('Artistic Excellence', 'Every image is crafted with meticulous attention to light, composition, and detail.', 'camera', 2),
  ('Personalized Experience', 'From consultation to delivery, we tailor every aspect to your vision and style.', 'sparkles', 3)
ON CONFLICT DO NOTHING;

-- Seed sample testimonials
INSERT INTO testimonials (quote, author_name, author_role, rating, display_order, is_featured) VALUES
  ('Working with VK Studios was an absolute dream. They captured our wedding day perfectly and made us feel so comfortable throughout the entire process.', 'Sarah & Michael', 'Wedding Clients', 5, 1, true),
  ('The brand photography exceeded all our expectations. The images perfectly capture our company''s essence and have elevated our entire marketing presence.', 'Jennifer Chen', 'Marketing Director', 5, 2, true),
  ('I was nervous about my portrait session, but the team made it so easy and fun. The photos turned out absolutely stunning!', 'Amanda Torres', 'Portrait Client', 5, 3, true)
ON CONFLICT DO NOTHING;

-- Seed sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
  ('How far in advance should I book?', 'We recommend booking 3-6 months in advance for weddings and 2-4 weeks for portrait sessions. However, we do accommodate last-minute bookings when available.', 'Booking', 1),
  ('What is your pricing structure?', 'Our packages vary based on the type of session and your specific needs. Visit our Investment page for detailed pricing, or contact us for a custom quote.', 'Pricing', 2),
  ('Do you travel for destination weddings?', 'Yes! We love destination weddings and are available to travel worldwide. Travel fees vary by location and will be included in your custom quote.', 'Booking', 3),
  ('When will I receive my photos?', 'Portrait sessions are typically delivered within 2-3 weeks. Wedding galleries are delivered within 6-8 weeks. Rush delivery is available for an additional fee.', 'Delivery', 4),
  ('Do you offer payment plans?', 'Yes, we offer flexible payment plans for all packages. A deposit is required to secure your date, with the remaining balance due before your session or event.', 'Pricing', 5)
ON CONFLICT DO NOTHING;

-- Seed sample investment packages
INSERT INTO investment_packages (name, price, price_display, description, features, display_order, is_featured, badge_text) VALUES
  ('Essential', 250000, 'Starting at $2,500', 'Perfect for intimate celebrations and small events', '["4 hours of coverage", "1 photographer", "Online gallery", "100+ edited images", "Print release"]'::jsonb, 1, false, null),
  ('Signature', 450000, 'Starting at $4,500', 'Our most popular package for full-day coverage', '["8 hours of coverage", "2 photographers", "Engagement session", "Online gallery", "300+ edited images", "Print release", "Wedding album"]'::jsonb, 2, true, 'Most Popular'),
  ('Luxe', 750000, 'Starting at $7,500', 'The ultimate experience for your special day', '["Full day coverage", "2 photographers + videographer", "Engagement session", "Online gallery", "500+ edited images", "Print release", "Premium wedding album", "Highlight film", "Same-day edits"]'::jsonb, 3, false, null)
ON CONFLICT DO NOTHING;
