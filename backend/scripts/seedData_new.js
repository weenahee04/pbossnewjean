const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/jespark.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Seeding database...');

const hashedPassword = bcrypt.hashSync('123456', 10);

db.serialize(() => {
  // Clear existing data
  db.run('DELETE FROM redemptions');
  db.run('DELETE FROM transactions');
  db.run('DELETE FROM notifications');
  db.run('DELETE FROM coupons');
  db.run('DELETE FROM users');
  db.run('DELETE FROM rewards');
  db.run('DELETE FROM deals');
  db.run('DELETE FROM stores');
  db.run('DELETE FROM brands');
  db.run('DELETE FROM banners');

  // Seed Users
  const userStmt = db.prepare(`
    INSERT INTO users (id, name, phone, email, password, points, wallet_balance, tier, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  userStmt.run('u1', 'อเล็กซ์ จอห์นสัน', '0812345678', 'alex@example.com', hashedPassword, 4250, 1240.50, 'Platinum', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYvFoqSDUxOAnBxwGGtCvdgMEzqRY-vU9tzWNOIgy5QHhYYqC2zSU-LtzAAkZ6stX5jCsgSvO1_QSxcb_N0QFUowBUtIjhugEjw7_rp_Ele9evcJuOQfPVTh4gxIS4Na12G-slm1AK_4R6hjeh2Db7ywOHP-LHKoCtPo0hJDJlwgQ7571Cms90SxMSGGYHs9r0ca-W461C-EwJBVz0NWu6Rk61-aUjohKWKNTHjqUR4ddNbDSvQkC0BO_RNoeK0AyztC-7C2zUzed');
  userStmt.run('u2', 'สมชาย ใจดี', '0823456789', 'somchai@example.com', hashedPassword, 2100, 850.00, 'Gold', null);
  userStmt.finalize();

  console.log('✅ Users seeded');

  // Seed Rewards
  const rewardStmt = db.prepare(`
    INSERT INTO rewards (id, title, description, points, category, is_popular, stock, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  rewardStmt.run('r1', 'คูปองสตาร์บัคส์ 300 บาท', 'แลกคะแนนเพื่อรับคูปองสตาร์บัคส์มูลค่า 300 บาท ใช้ได้ทุกสาขา', 1000, 'เครื่องดื่ม', 1, 50, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400');
  rewardStmt.run('r2', 'บัตรกำนัล Central 500 บาท', 'บัตรกำนัลห้างสรรพสินค้าเซ็นทรัล มูลค่า 500 บาท', 1500, 'ช้อปปิ้ง', 1, 30, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400');
  rewardStmt.run('r3', 'ส่วนลด Grab 100 บาท', 'โค้ดส่วนลด Grab มูลค่า 100 บาท สำหรับการเดินทาง', 500, 'การเดินทาง', 0, 100, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400');
  rewardStmt.run('r4', 'บัตรชมภาพยนตร์ SF Cinema', 'บัตรชมภาพยนตร์ฟรี 1 ที่นั่ง ที่ SF Cinema', 800, 'บันเทิง', 1, 40, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400');
  rewardStmt.run('r5', 'ส่วนลด Lazada 200 บาท', 'โค้ดส่วนลด Lazada มูลค่า 200 บาท ใช้ได้กับทุกสินค้า', 700, 'ช้อปปิ้ง', 0, 60, 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400');
  rewardStmt.finalize();

  console.log('✅ Rewards seeded');

  // Seed Deals
  const dealStmt = db.prepare(`
    INSERT INTO deals (id, title, subtitle, tag, category, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  dealStmt.run('d1', 'สดชื่นรับซัมเมอร์', 'รับคะแนน x2 สำหรับเมนูชาเย็น', 'ยอดนิยม', 'เครื่องดื่ม', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400');
  dealStmt.run('d2', 'Happy Hour', 'ส่วนลด 50% ทุกวันศุกร์ 16:00-19:00', 'พิเศษ', 'อาหาร', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400');
  dealStmt.run('d3', 'Weekend Special', 'ซื้อ 1 แถม 1 เมนูขนมหวาน', 'สุดสัปดาห์', 'ขนมหวาน', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400');
  dealStmt.finalize();

  console.log('✅ Deals seeded');

  // Seed Stores
  const storeStmt = db.prepare(`
    INSERT INTO stores (id, name, address, phone, hours, latitude, longitude, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  storeStmt.run('s1', 'Jespark Central World', '999/9 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ 10330', '02-123-4567', '10:00 - 22:00', 13.7467, 100.5398, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400');
  storeStmt.run('s2', 'Jespark Siam Paragon', '991 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ 10330', '02-234-5678', '10:00 - 22:00', 13.7465, 100.5347, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400');
  storeStmt.run('s3', 'Jespark EmQuartier', '693 ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ 10110', '02-345-6789', '10:00 - 22:00', 13.7308, 100.5698, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400');
  storeStmt.finalize();

  console.log('✅ Stores seeded');

  // Seed Brands
  const brandStmt = db.prepare(`
    INSERT INTO brands (id, name, category, is_recommended, logo)
    VALUES (?, ?, ?, ?, ?)
  `);

  brandStmt.run('b1', 'Starbucks', 'เครื่องดื่ม', 1, 'https://logo.clearbit.com/starbucks.com');
  brandStmt.run('b2', 'Central', 'ช้อปปิ้ง', 1, 'https://logo.clearbit.com/central.co.th');
  brandStmt.run('b3', 'Grab', 'การเดินทาง', 1, 'https://logo.clearbit.com/grab.com');
  brandStmt.run('b4', 'SF Cinema', 'บันเทิง', 1, 'https://logo.clearbit.com/sfcinemacity.com');
  brandStmt.run('b5', 'Lazada', 'ช้อปปิ้ง', 1, 'https://logo.clearbit.com/lazada.co.th');
  brandStmt.run('b6', 'Shopee', 'ช้อปปิ้ง', 0, 'https://logo.clearbit.com/shopee.co.th');
  brandStmt.run('b7', 'LINE MAN', 'อาหาร', 1, 'https://logo.clearbit.com/lineman.line.me');
  brandStmt.run('b8', 'Airbnb', 'ท่องเที่ยว', 0, 'https://logo.clearbit.com/airbnb.com');
  brandStmt.finalize();

  console.log('✅ Brands seeded');

  // Seed Banners
  const bannerStmt = db.prepare(`
    INSERT INTO banners (id, title, subtitle, button_text, link, order_index, is_active, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  bannerStmt.run('bn1', 'Double Points Weekend', 'รับคะแนนคูณ 2 ทุกวันเสาร์-อาทิตย์', 'ดูรายละเอียด', '/rewards', 1, 1, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800');
  bannerStmt.run('bn2', 'New Member Bonus', 'สมัครสมาชิกใหม่รับ 500 คะแนนฟรี', 'สมัครเลย', '/register', 2, 1, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800');
  bannerStmt.finalize();

  console.log('✅ Banners seeded');

  // Seed Notifications for user u1
  const notifStmt = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, category, icon, icon_bg, icon_color, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  notifStmt.run('n1', 'u1', 'คะแนนใหม่เข้าแล้ว!', 'คุณได้รับ 150 คะแนนจากการซื้อสินค้า', 'Promotions', 'stars', 'bg-primary/10', 'text-primary', 0);
  notifStmt.run('n2', 'u1', 'ดีลพิเศษวันนี้', 'รับส่วนลด 50% สำหรับเมนูใหม่ล่าสุด', 'Promotions', 'local_offer', 'bg-orange-100', 'text-orange-600', 0);
  notifStmt.run('n3', 'u1', 'อัปเดตระบบ', 'เวอร์ชันใหม่พร้อมให้ใช้งานแล้ว', 'System', 'system_update', 'bg-blue-100', 'text-blue-600', 1);
  notifStmt.finalize();

  console.log('✅ Notifications seeded');

  // Seed Coupons for user u1
  const couponStmt = db.prepare(`
    INSERT INTO coupons (id, user_id, code, title, description, discount, expiry_date, category, is_used, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  couponStmt.run('c1', 'u1', 'COFFEE20', 'Jespark Coffee', 'ส่วนลด 20% สำหรับเครื่องดื่มทุกชนิด', '20% OFF', '2026-12-31', 'Food', 0, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400');
  couponStmt.run('c2', 'u1', 'FOOD50', 'Jespark Restaurant', 'ส่วนลด 50 บาท สำหรับอาหารทุกเมนู', '฿50 OFF', '2026-06-30', 'Food', 0, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400');
  couponStmt.finalize();

  console.log('✅ Coupons seeded');

  // Seed Transactions for user u1
  const transStmt = db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount, description, balance_after)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  transStmt.run('t1', 'u1', 'earn', 100, 'ซื้อกาแฟ Americano', 4250);
  transStmt.run('t2', 'u1', 'spend', 500, 'แลกของรางวัล: ส่วนลด Grab 100 บาท', 3750);
  transStmt.run('t3', 'u1', 'earn', 150, 'ซื้อเค้ก Chocolate Cake', 3900);
  transStmt.finalize();

  console.log('✅ Transactions seeded');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📝 Test Credentials:');
  console.log('   Phone: 0812345678');
  console.log('   Password: 123456');
  console.log('');

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
  });
});
