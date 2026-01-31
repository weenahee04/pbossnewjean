-- ============================================
-- Jespark Rewards & Lifestyle - Sample Data
-- ============================================

-- ============================================
-- 1. INSERT CATEGORIES
-- ============================================
INSERT INTO categories (id, name, name_en, description, icon, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'อาหาร', 'Food', 'หมวดหมู่อาหารและเครื่องดื่ม', 'restaurant', 1),
('22222222-2222-2222-2222-222222222222', 'เครื่องดื่ม', 'Beverage', 'หมวดหมู่เครื่องดื่มและคาเฟ่', 'local_cafe', 2),
('33333333-3333-3333-3333-333333333333', 'ไอที', 'Technology', 'หมวดหมู่อุปกรณ์ไอทีและอิเล็กทรอนิกส์', 'devices', 3),
('44444444-4444-4444-4444-444444444444', 'ไลฟ์สไตล์', 'Lifestyle', 'หมวดหมู่แฟชั่นและไลฟ์สไตล์', 'shopping_bag', 4),
('55555555-5555-5555-5555-555555555555', 'ท่องเที่ยว', 'Travel', 'หมวดหมู่การท่องเที่ยวและที่พัก', 'flight', 5);

-- ============================================
-- 2. INSERT BRANDS
-- ============================================
INSERT INTO brands (id, name, logo, description, category_id, is_featured) VALUES
('b0000001-0000-0000-0000-000000000001', 'Starbucks', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpHP7ypyvvPB2HdiLPAN61U09KAClGg9egyPVrQ1mabu-2ie1R4AiGH7VYdXwOnMpJ1lbwmtMngvQ_oUJP8Vdl4NxsNicAcVlVd7TgLSIYQxjHmEuPD16VPVnXkBg0oAo2jJ50FnswlxpgIox4sRXGsn9fSD_MVsVDzhrKPYwOQtHP-H_JQu5fz5NruPNIESZoTQ7xlWMSP7MSYP9qzhByMValV1WVGaOdPMvS274PsA1HQ52QfDMTHz3O9itq2RPlOUESMH8Iuy7', 'ร้านกาแฟชั้นนำระดับโลก', '22222222-2222-2222-2222-222222222222', true),
('b0000002-0000-0000-0000-000000000002', 'Burger King', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6LJYBHHFZSoQy3Wg_vzaY4q7StRQxRADyvCwr3oPbcE-wic6aYxSavAaRJj_hBIKpLbPaBP2n3OIZO5Nkhikp0Aeg9UXGfHt1bjUytNPxIl2tCpFhH50GI4iXzvzPqSopMwp-1XQwKL3xiYoiyo6nGyhaMBeC8iSrVYwWKH1ssDvhj_yKn2TmfdeMTgl6aWzo6zZ5o4_kPsTdioDBph4unqllG7hciiaLUJRt3r5n641neGh_VxTjy0_Sf4FEtssjdMk_DuWJedIk', 'ร้านเบอร์เกอร์ระดับโลก', '11111111-1111-1111-1111-111111111111', true),
('b0000003-0000-0000-0000-000000000003', 'Apple Store', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNwxxwP83tAK8CPoyX5fKQBD9KtnuPwOHFQRSOpR9xie_0Z5P9Ysby5kuTkWQDdhvIKEi5-ByLvLvxcb9ouB0zSrKHfclVUTSJM9sWJ50xEPsUIHAe4caMDAAj2LB9XPj33buwzF7g38-jazaemBjS4B6AZ4M3dqL6xWbG0LCAsBioWlY8DLdNu0yY94TqK4AsRlduGiw_W745tva3tD7TLz-aDdWVqyEcN70Xquib3HWPh5JdK2jv6v9_4Ne-LxEkXAfOVUephbCX', 'ผลิตภัณฑ์ Apple อย่างเป็นทางการ', '33333333-3333-3333-3333-333333333333', true),
('b0000004-0000-0000-0000-000000000004', 'Zara', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMksrSYzQxxwOhIaiOrdGpCMKOBnT_fX1_rEh7tm6S_TNG1Pvfa0sF9SfIY63tx81PqORGYeygBgOF2TS13v6tafJtlR7jHZQRsLRDNxMq67mr8GOpYalhfiPe2YXCizl369CBuUb31myVrpJmrmNFeTO9rukNVYsJcY7xCcv5-n5kSJmykWwBFU_QDXcyLZpMpKmP7z2kX91bmHNW_2aqfe3k808rHZSUiTEsyb2BnKlbiQto8gO5ENnstlqeJ4gsjlk0R4XsXnT', 'แฟชั่นสไตล์ยุโรป', '44444444-4444-4444-4444-444444444444', true),
('b0000005-0000-0000-0000-000000000005', 'Coffee House', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOkrrkrPaoAYrwTZjX7zCAYcHaou2cHClYHB6jcKvNOFfRr8-rB7ucRVWjNdwJiEh1IRYJVaBkPo-u5dFeVyi61Czwb92neJeBDKrBljIm4tSf6jdhEkCz7aXi8lheu55IAYyhoz2-IqW4Rgl804C1LeSDX4iiTyLcyINe17-Ik5s5VvA5KyKBJQatWdDM4OK2fOO0BXF7Xzc_uyKIZoVaQIXUphgGBslESzWaDUVGqbevHK9I8VqDk_43wkeQXULKtF4QMV6y_qMv', 'คาเฟ่สไตล์ไทย', '22222222-2222-2222-2222-222222222222', false);

-- ============================================
-- 3. INSERT REWARDS
-- ============================================
INSERT INTO rewards (id, title, description, points, image, category_id, brand_id, stock_quantity, is_popular, is_limited, valid_until) VALUES
('r0000001-0000-0000-0000-000000000001', 'คูปองสตาร์บัคส์ 300 บาท', 'แลกคะแนนเพื่อรับคูปองแทนเงินสดสำหรับเครื่องดื่มที่สตาร์บัคส์ทุกสาขา ใช้ได้ทุกเมนู', 1000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpHP7ypyvvPB2HdiLPAN61U09KAClGg9egyPVrQ1mabu-2ie1R4AiGH7VYdXwOnMpJ1lbwmtMngvQ_oUJP8Vdl4NxsNicAcVlVd7TgLSIYQxjHmEuPD16VPVnXkBg0oAo2jJ50FnswlxpgIox4sRXGsn9fSD_MVsVDzhrKPYwOQtHP-H_JQu5fz5NruPNIESZoTQ7xlWMSP7MSYP9qzhByMValV1WVGaOdPMvS274PsA1HQ52QfDMTHz3O9itq2RPlOUESMH8Iuy7', '22222222-2222-2222-2222-222222222222', 'b0000001-0000-0000-0000-000000000001', 100, true, false, '2024-12-31 23:59:59+07'),
('r0000002-0000-0000-0000-000000000002', 'หูฟังตัดเสียงรบกวนไร้สาย', 'หูฟังคุณภาพพรีเมียม พร้อมระบบตัดเสียงรบกวน แบตเตอรี่ใช้งานได้ 24 ชั่วโมง', 15000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU2Y4J0wfgQkT0ySxZJby_8p-7zltsnSmwV3WGhmsbxmAkxccUFL9LhvUKunRhcq-2pn7kcdKFdmBS9yjdKb57EWY1qjXdjOhRAtnjP0LGaGRZj8CkQR4GLtwwOpeMXbEyjvwzNShCXnCIrbwHafESm68t-IYSfZ1b23Xca7XnfyfJdcHHlX-2QoaGnPLOYm9MQ_d4KE2bzMcDCF6qdhZm6RgKVq_pDq2EhxFJp3TQTST005bRCaxodU7uoEFl3-7RweXEupY3ck-n', '33333333-3333-3333-3333-333333333333', 'b0000003-0000-0000-0000-000000000003', 20, false, false, '2024-12-31 23:59:59+07'),
('r0000003-0000-0000-0000-000000000003', 'ชุดเบอร์เกอร์คิงสุดคุ้ม', 'อิ่มอร่อยกับชุด Whopper Combo ที่สาขาที่ร่วมรายการ พร้อมเครื่องดื่มและมันฝรั่ง', 2200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6LJYBHHFZSoQy3Wg_vzaY4q7StRQxRADyvCwr3oPbcE-wic6aYxSavAaRJj_hBIKpLbPaBP2n3OIZO5Nkhikp0Aeg9UXGfHt1bjUytNPxIl2tCpFhH50GI4iXzvzPqSopMwp-1XQwKL3xiYoiyo6nGyhaMBeC8iSrVYwWKH1ssDvhj_yKn2TmfdeMTgl6aWzo6zZ5o4_kPsTdioDBph4unqllG7hciiaLUJRt3r5n641neGh_VxTjy0_Sf4FEtssjdMk_DuWJedIk', '11111111-1111-1111-1111-111111111111', 'b0000002-0000-0000-0000-000000000002', 50, true, true, '2024-03-31 23:59:59+07'),
('r0000004-0000-0000-0000-000000000004', 'กระเป๋าผ้า Jespark Limited', 'กระเป๋าผ้ารักษ์โลกดีไซน์พิเศษ พกพาสะดวก ของรางวัลจำนวนจำกัด', 500, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG37L70bR_WBhCnGfZIb4yXNNhIPCZoaRrZeKW2gsORJbZmucVKfkUAKX7gD0iZ1tgUIIE3rCkbiPZ2XmTRhfXzKXnn_FlOsyen70pSf9NzKNSwtBndBIfF0kZnjpwZlnCOgc8hMV7AKsZc5wcBJOzmivzLoUexPRIZuosVhv2NEUy7V1wIx4IAI8cL14i0i4jVnxhLrCg1ABE3n1J08m5K7QQgP_itD6WmvCaND3qsvKZHPF0tpwpWDXjjZQzdS93w9-vWszzx2e5', '44444444-4444-4444-4444-444444444444', NULL, 200, false, true, '2024-12-31 23:59:59+07'),
('r0000005-0000-0000-0000-000000000005', 'เสื้อยืด Zara Collection', 'เสื้อยืดคอลเลคชั่นใหม่ล่าสุด ดีไซน์ทันสมัย คุณภาพพรีเมียม', 3500, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMksrSYzQxxwOhIaiOrdGpCMKOBnT_fX1_rEh7tm6S_TNG1Pvfa0sF9SfIY63tx81PqORGYeygBgOF2TS13v6tafJtlR7jHZQRsLRDNxMq67mr8GOpYalhfiPe2YXCizl369CBuUb31myVrpJmrmNFeTO9rukNVYsJcY7xCcv5-n5kSJmykWwBFU_QDXcyLZpMpKmP7z2kX91bmHNW_2aqfe3k808rHZSUiTEsyb2BnKlbiQto8gO5ENnstlqeJ4gsjlk0R4XsXnT', '44444444-4444-4444-4444-444444444444', 'b0000004-0000-0000-0000-000000000004', 30, false, false, '2024-12-31 23:59:59+07');

-- ============================================
-- 4. INSERT DEALS
-- ============================================
INSERT INTO deals (id, title, subtitle, description, image, tag, category_id, brand_id, points_multiplier, is_featured, valid_until) VALUES
('d0000001-0000-0000-0000-000000000001', 'สดชื่นรับซัมเมอร์', 'รับคะแนน x2 สำหรับเมนูชาเย็นทุกรายการ', 'โปรโมชั่นพิเศษสำหรับเมนูชาเย็น รับคะแนนเพิ่มเป็น 2 เท่า', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYUdalIHIIwvOgXgm-58V-uHRqDiaezZoWCHpRCUvpHE3DPaFQG7afxwDLueMMK3V5XfN0yFj2zxVU0tCyPsyz6BOyh3YBw1Heh52vBqUKfHIKKTDPec8huuKMwCMmrCb6n8ZfQ4v6WRePFZWDEFkBWWcB8zrVXuSNixXllbfO2EzmCmqByLhAOgOUlf0Fd8kZHJZG27JbN0FzzdB9Pw2PASH7ql11KUrJbMGCp_MR2rvmnyyK5O84cZEBTrL3CceEhibNXj6yZTMf', 'ยอดนิยม', '22222222-2222-2222-2222-222222222222', 'b0000001-0000-0000-0000-000000000001', 2.00, true, '2024-06-30 23:59:59+07'),
('d0000002-0000-0000-0000-000000000002', 'โบนัสไอที', 'รับฟรี 500 คะแนน เมื่อซื้ออุปกรณ์ไอที', 'ซื้ออุปกรณ์ไอทีครบ 10,000 บาท รับคะแนนโบนัสทันที 500 คะแนน', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNwxxwP83tAK8CPoyX5fKQBD9KtnuPwOHFQRSOpR9xie_0Z5P9Ysby5kuTkWQDdhvIKEi5-ByLvLvxcb9ouB0zSrKHfclVUTSJM9sWJ50xEPsUIHAe4caMDAAj2LB9XPj33buwzF7g38-jazaemBjS4B6AZ4M3dqL6xWbG0LCAsBioWlY8DLdNu0yY94TqK4AsRlduGiw_W745tva3tD7TLz-aDdWVqyEcN70Xquib3HWPh5JdK2jv6v9_4Ne-LxEkXAfOVUephbCX', 'พาร์ทเนอร์', '33333333-3333-3333-3333-333333333333', 'b0000003-0000-0000-0000-000000000003', 1.00, true, '2024-12-31 23:59:59+07'),
('d0000003-0000-0000-0000-000000000003', 'ลดราคาพิเศษ Zara', 'ส่วนลด 30% สำหรับสมาชิก Jespark', 'ช้อปเสื้อผ้าและเครื่องแต่งกายที่ Zara รับส่วนลดทันที 30%', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMksrSYzQxxwOhIaiOrdGpCMKOBnT_fX1_rEh7tm6S_TNG1Pvfa0sF9SfIY63tx81PqORGYeygBgOF2TS13v6tafJtlR7jHZQRsLRDNxMq67mr8GOpYalhfiPe2YXCizl369CBuUb31myVrpJmrmNFeTO9rukNVYsJcY7xCcv5-n5kSJmykWwBFU_QDXcyLZpMpKmP7z2kX91bmHNW_2aqfe3k808rHZSUiTEsyb2BnKlbiQto8gO5ENnstlqeJ4gsjlk0R4XsXnT', 'ใหม่', '44444444-4444-4444-4444-444444444444', 'b0000004-0000-0000-0000-000000000004', 1.00, false, '2024-12-31 23:59:59+07');

-- ============================================
-- 5. INSERT BANNERS
-- ============================================
INSERT INTO banners (id, title, subtitle, description, image, button_text, link, display_order, valid_until) VALUES
('bn000001-0000-0000-0000-000000000001', 'Double Points Weekend', 'รับคะแนนคูณ 2 ทุกการสั่งซื้อเครื่องดื่มตลอดสุดสัปดาห์นี้', 'โปรโมชั่นพิเศษสำหรับสมาชิก Jespark', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200', 'ดูรายละเอียด', '/deals', 1, '2024-12-31 23:59:59+07'),
('bn000002-0000-0000-0000-000000000002', 'Jespark x Starbucks', 'แลกรับส่วนลดพิเศษ 50% สำหรับเมนูใหม่ล่าสุด', 'ร่วมกับ Starbucks มอบความพิเศษให้คุณ', 'https://images.unsplash.com/photo-1544787210-2213d4b2d501?auto=format&fit=crop&q=80&w=1200', 'แลกเลย', '/rewards', 2, '2024-12-31 23:59:59+07'),
('bn000003-0000-0000-0000-000000000003', 'New Store Opening', 'พบกับสาขาใหม่ใจกลางเมือง พร้อมของแถมพิเศษเพียบ!', 'เปิดสาขาใหม่ มีโปรโมชั่นมากมาย', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200', 'เช็คสาขา', '/stores', 3, '2024-12-31 23:59:59+07');

-- ============================================
-- 6. INSERT STORES
-- ============================================
INSERT INTO stores (id, name, address, phone, hours, latitude, longitude, image) VALUES
('s0000001-0000-0000-0000-000000000001', 'Jespark Central World', '999/9 ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330', '02-123-4567', '10:00 - 22:00', 13.7467, 100.5398, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'),
('s0000002-0000-0000-0000-000000000002', 'Jespark Siam Paragon', '991 ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330', '02-234-5678', '10:00 - 22:00', 13.7465, 100.5347, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'),
('s0000003-0000-0000-0000-000000000003', 'Jespark EmQuartier', '693 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110', '02-345-6789', '10:00 - 22:00', 13.7308, 100.5698, 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800'),
('s0000004-0000-0000-0000-000000000004', 'Jespark IconSiam', '299 ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพฯ 10600', '02-456-7890', '10:00 - 22:00', 13.7268, 100.5101, 'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&q=80&w=800'),
('s0000005-0000-0000-0000-000000000005', 'Jespark Terminal 21', '88 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110', '02-567-8901', '10:00 - 22:00', 13.7378, 100.5601, 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=800');

-- ============================================
-- 7. INSERT SAMPLE USERS (for testing)
-- Password: "password123" hashed with bcrypt
-- ============================================
INSERT INTO users (id, name, email, phone, password_hash, avatar, points, tier, member_since) VALUES
('u0000001-0000-0000-0000-000000000001', 'สมชาย ใจดี', 'somchai@example.com', '0812345678', '$2b$10$rKvvLQJxQxQxQxQxQxQxQeO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'https://i.pravatar.cc/150?img=12', 2450, 'Gold', 2021),
('u0000002-0000-0000-0000-000000000002', 'สมหญิง รักดี', 'somying@example.com', '0823456789', '$2b$10$rKvvLQJxQxQxQxQxQxQxQeO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'https://i.pravatar.cc/150?img=45', 5800, 'Platinum', 2020),
('u0000003-0000-0000-0000-000000000003', 'ประยุทธ์ มั่นคง', 'prayut@example.com', '0834567890', '$2b$10$rKvvLQJxQxQxQxQxQxQxQeO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'https://i.pravatar.cc/150?img=33', 1200, 'Silver', 2022),
('u0000004-0000-0000-0000-000000000004', 'วิภา สวยงาม', 'wipa@example.com', '0845678901', '$2b$10$rKvvLQJxQxQxQxQxQxQxQeO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'https://i.pravatar.cc/150?img=47', 450, 'Bronze', 2023);

-- ============================================
-- 8. INSERT SAMPLE COUPONS
-- ============================================
INSERT INTO coupons (id, user_id, code, title, description, discount, image, category_id, brand_id, expires_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'COFFEE20', 'Jespark Coffee', 'ส่วนลด 20% สำหรับเครื่องดื่มทุกเมนู', '20% OFF', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOkrrkrPaoAYrwTZjX7zCAYcHaou2cHClYHB6jcKvNOFfRr8-rB7ucRVWjNdwJiEh1IRYJVaBkPo-u5dFeVyi61Czwb92neJeBDKrBljIm4tSf6jdhEkCz7aXi8lheu55IAYyhoz2-IqW4Rgl804C1LeSDX4iiTyLcyINe17-Ik5s5VvA5KyKBJQatWdDM4OK2fOO0BXF7Xzc_uyKIZoVaQIXUphgGBslESzWaDUVGqbevHK9I8VqDk_43wkeQXULKtF4QMV6y_qMv', '22222222-2222-2222-2222-222222222222', 'b0000001-0000-0000-0000-000000000001', '2024-12-31 23:59:59+07'),
('c0000002-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000001', 'BURGER50', 'Fresh Grocer', 'ลด 50 บาท สำหรับเบอร์เกอร์ทุกเมนู', '50 บาท OFF', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG37L70bR_WBhCnGfZIb4yXNNhIPCZoaRrZeKW2gsORJbZmucVKfkUAKX7gD0iZ1tgUIIE3rCkbiPZ2XmTRhfXzKXnn_FlOsyen70pSf9NzKNSwtBndBIfF0kZnjpwZlnCOgc8hMV7AKsZc5wcBJOzmivzLoUexPRIZuosVhv2NEUy7V1wIx4IAI8cL14i0i4jVnxhLrCg1ABE3n1J08m5K7QQgP_itD6WmvCaND3qsvKZHPF0tpwpWDXjjZQzdS93w9-vWszzx2e5', '11111111-1111-1111-1111-111111111111', 'b0000002-0000-0000-0000-000000000002', '2024-06-30 23:59:59+07'),
('c0000003-0000-0000-0000-000000000003', 'u0000001-0000-0000-0000-000000000001', 'STYLE15', 'Style Hub', 'ส่วนลด 15% สำหรับเสื้อผ้าทุกชิ้น', '15% OFF', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMksrSYzQxxwOhIaiOrdGpCMKOBnT_fX1_rEh7tm6S_TNG1Pvfa0sF9SfIY63tx81PqORGYeygBgOF2TS13v6tafJtlR7jHZQRsLRDNxMq67mr8GOpYalhfiPe2YXCizl369CBuUb31myVrpJmrmNFeTO9rukNVYsJcY7xCcv5-n5kSJmykWwBFU_QDXcyLZpMpKmP7z2kX91bmHNW_2aqfe3k808rHZSUiTEsyb2BnKlbiQto8gO5ENnstlqeJ4gsjlk0R4XsXnT', '44444444-4444-4444-4444-444444444444', 'b0000004-0000-0000-0000-000000000004', '2024-03-15 23:59:59+07');

-- ============================================
-- 9. INSERT SAMPLE NOTIFICATIONS
-- ============================================
INSERT INTO notifications (user_id, title, message, category, link) VALUES
('u0000001-0000-0000-0000-000000000001', 'คะแนนใกล้หมดอายุ', 'คุณมีคะแนน 500 จะหมดอายุใน 7 วัน อย่าลืมนำไปใช้ก่อนหมดอายุนะคะ', 'rewards', '/rewards'),
('u0000001-0000-0000-0000-000000000001', 'ดีลใหม่มาแล้ว!', 'ดีลพิเศษจาก Starbucks รับคะแนนคูณ 2 ตลอดสัปดาห์นี้', 'deals', '/deals'),
('u0000001-0000-0000-0000-000000000001', 'ยินดีต้อนรับสู่ Jespark', 'ขอบคุณที่เป็นสมาชิกกับเรา รับคะแนนต้อนรับ 100 คะแนน', 'account', '/profile'),
('u0000002-0000-0000-0000-000000000002', 'คุณได้รับคะแนนใหม่', 'รับคะแนน 50 จากการซื้อสินค้าที่ Burger King', 'rewards', '/wallet');

-- ============================================
-- 10. INSERT SAMPLE WALLET TRANSACTIONS
-- ============================================
INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference_type) VALUES
('u0000001-0000-0000-0000-000000000001', 'earn', 100, 2450, 'รับคะแนนจากการซื้อกาแฟ Americano', 'purchase'),
('u0000001-0000-0000-0000-000000000001', 'earn', 50, 2350, 'รับคะแนนจากการซื้อเบอร์เกอร์', 'purchase'),
('u0000001-0000-0000-0000-000000000001', 'spend', -1000, 2300, 'แลกคูปองสตาร์บัคส์ 300 บาท', 'reward_redemption'),
('u0000001-0000-0000-0000-000000000001', 'earn', 150, 2450, 'รับคะแนนจากโปรโมชั่น Double Points', 'deal');

-- ============================================
-- 11. INSERT SAMPLE POINTS HISTORY
-- ============================================
INSERT INTO points_history (user_id, points_change, points_before, points_after, reason, reference_type) VALUES
('u0000001-0000-0000-0000-000000000001', 100, 2350, 2450, 'รับคะแนนจากการซื้อสินค้า', 'purchase'),
('u0000001-0000-0000-0000-000000000001', -1000, 3450, 2450, 'แลกของรางวัล', 'reward_redemption'),
('u0000002-0000-0000-0000-000000000002', 200, 5600, 5800, 'รับคะแนนจากการซื้อสินค้า', 'purchase'),
('u0000003-0000-0000-0000-000000000003', 100, 1100, 1200, 'รับคะแนนต้อนรับสมาชิกใหม่', 'welcome_bonus');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'brands', COUNT(*) FROM brands
UNION ALL
SELECT 'rewards', COUNT(*) FROM rewards
UNION ALL
SELECT 'deals', COUNT(*) FROM deals
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'stores', COUNT(*) FROM stores
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'wallet_transactions', COUNT(*) FROM wallet_transactions
UNION ALL
SELECT 'points_history', COUNT(*) FROM points_history;
