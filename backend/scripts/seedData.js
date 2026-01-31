const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/jespark.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Seeding database...');

// Helper function to run queries
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Clear existing data
const clearData = async () => {
  await run('DELETE FROM redemptions');
  await run('DELETE FROM transactions');
  await run('DELETE FROM notifications');
  await run('DELETE FROM coupons');
  await run('DELETE FROM users');
  await run('DELETE FROM rewards');
  await run('DELETE FROM deals');
  await run('DELETE FROM stores');
  await run('DELETE FROM brands');
  await run('DELETE FROM banners');
};

const seedDatabase = async () => {
  try {
    await clearData();

// Seed Users
const hashedPassword = bcrypt.hashSync('123456', 10);

const users = [
  {
    id: 'u1',
    name: 'อเล็กซ์ จอห์นสัน',
    phone: '0812345678',
    email: 'alex@example.com',
    password: hashedPassword,
    points: 4250,
    wallet_balance: 1240.50,
    tier: 'Platinum',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYvFoqSDUxOAnBxwGGtCvdgMEzqRY-vU9tzWNOIgy5QHhYYqC2zSU-LtzAAkZ6stX5jCsgSvO1_QSxcb_N0QFUowBUtIjhugEjw7_rp_Ele9evcJuOQfPVTh4gxIS4Na12G-slm1AK_4R6hjeh2Db7ywOHP-LHKoCtPo0hJDJlwgQ7571Cms90SxMSGGYHs9r0ca-W461C-EwJBVz0NWu6Rk61-aUjohKWKNTHjqUR4ddNbDSvQkC0BO_RNoeK0AyztC-7C2zUzed'
  },
  {
    id: 'u2',
    name: 'สมชาย ใจดี',
    phone: '0823456789',
    email: 'somchai@example.com',
    password: hashedPassword,
    points: 2100,
    wallet_balance: 850.00,
    tier: 'Gold'
  }
];

const userStmt = db.prepare(`
  INSERT INTO users (id, name, phone, email, password, points, wallet_balance, tier, avatar)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

users.forEach(user => {
  userStmt.run(
    user.id, user.name, user.phone, user.email, user.password,
    user.points, user.wallet_balance, user.tier, user.avatar || null
  );
});

console.log('✅ Users seeded');

// Seed Rewards
const rewards = [
  {
    id: 'r1',
    title: 'คูปองสตาร์บัคส์ 300 บาท',
    description: 'แลกคะแนนเพื่อรับคูปองสตาร์บัคส์มูลค่า 300 บาท ใช้ได้ทุกสาขา',
    points: 1000,
    category: 'เครื่องดื่ม',
    is_popular: 1,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
  },
  {
    id: 'r2',
    title: 'บัตรกำนัล Central 500 บาท',
    description: 'บัตรกำนัลห้างสรรพสินค้าเซ็นทรัล มูลค่า 500 บาท',
    points: 1500,
    category: 'ช้อปปิ้ง',
    is_popular: 1,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'
  },
  {
    id: 'r3',
    title: 'ส่วนลด Grab 100 บาท',
    description: 'โค้ดส่วนลด Grab มูลค่า 100 บาท สำหรับการเดินทาง',
    points: 500,
    category: 'การเดินทาง',
    is_popular: 0,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
  },
  {
    id: 'r4',
    title: 'บัตรชมภาพยนตร์ SF Cinema',
    description: 'บัตรชมภาพยนตร์ฟรี 1 ที่นั่ง ที่ SF Cinema',
    points: 800,
    category: 'บันเทิง',
    is_popular: 1,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400'
  },
  {
    id: 'r5',
    title: 'ส่วนลด Lazada 200 บาท',
    description: 'โค้ดส่วนลด Lazada มูลค่า 200 บาท ใช้ได้กับทุกสินค้า',
    points: 700,
    category: 'ช้อปปิ้ง',
    is_popular: 0,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'
  }
];

const rewardStmt = db.prepare(`
  INSERT INTO rewards (id, title, description, points, category, is_popular, stock, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

rewards.forEach(r => {
  rewardStmt.run(r.id, r.title, r.description, r.points, r.category, r.is_popular, r.stock, r.image);
});

console.log('✅ Rewards seeded');

// Seed Deals
const deals = [
  {
    id: 'd1',
    title: 'สดชื่นรับซัมเมอร์',
    subtitle: 'รับคะแนน x2 สำหรับเมนูชาเย็น',
    tag: 'ยอดนิยม',
    category: 'เครื่องดื่ม',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'
  },
  {
    id: 'd2',
    title: 'Happy Hour',
    subtitle: 'ส่วนลด 50% ทุกวันศุกร์ 16:00-19:00',
    tag: 'พิเศษ',
    category: 'อาหาร',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
  },
  {
    id: 'd3',
    title: 'Weekend Special',
    subtitle: 'ซื้อ 1 แถม 1 เมนูขนมหวาน',
    tag: 'สุดสัปดาห์',
    category: 'ขนมหวาน',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
  }
];

const dealStmt = db.prepare(`
  INSERT INTO deals (id, title, subtitle, tag, category, image)
  VALUES (?, ?, ?, ?, ?, ?)
`);

deals.forEach(d => {
  dealStmt.run(d.id, d.title, d.subtitle, d.tag, d.category, d.image);
});

console.log('✅ Deals seeded');

// Seed Stores
const stores = [
  {
    id: 's1',
    name: 'Jespark Central World',
    address: '999/9 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ 10330',
    phone: '02-123-4567',
    hours: '10:00 - 22:00',
    latitude: 13.7467,
    longitude: 100.5398,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
  },
  {
    id: 's2',
    name: 'Jespark Siam Paragon',
    address: '991 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ 10330',
    phone: '02-234-5678',
    hours: '10:00 - 22:00',
    latitude: 13.7465,
    longitude: 100.5347,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
  },
  {
    id: 's3',
    name: 'Jespark EmQuartier',
    address: '693 ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ 10110',
    phone: '02-345-6789',
    hours: '10:00 - 22:00',
    latitude: 13.7308,
    longitude: 100.5698,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'
  }
];

const storeStmt = db.prepare(`
  INSERT INTO stores (id, name, address, phone, hours, latitude, longitude, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stores.forEach(s => {
  storeStmt.run(s.id, s.name, s.address, s.phone, s.hours, s.latitude, s.longitude, s.image);
});

console.log('✅ Stores seeded');

// Seed Brands
const brands = [
  { id: 'b1', name: 'Starbucks', category: 'เครื่องดื่ม', is_recommended: 1, logo: 'https://logo.clearbit.com/starbucks.com' },
  { id: 'b2', name: 'Central', category: 'ช้อปปิ้ง', is_recommended: 1, logo: 'https://logo.clearbit.com/central.co.th' },
  { id: 'b3', name: 'Grab', category: 'การเดินทาง', is_recommended: 1, logo: 'https://logo.clearbit.com/grab.com' },
  { id: 'b4', name: 'SF Cinema', category: 'บันเทิง', is_recommended: 1, logo: 'https://logo.clearbit.com/sfcinemacity.com' },
  { id: 'b5', name: 'Lazada', category: 'ช้อปปิ้ง', is_recommended: 1, logo: 'https://logo.clearbit.com/lazada.co.th' },
  { id: 'b6', name: 'Shopee', category: 'ช้อปปิ้ง', is_recommended: 0, logo: 'https://logo.clearbit.com/shopee.co.th' },
  { id: 'b7', name: 'LINE MAN', category: 'อาหาร', is_recommended: 1, logo: 'https://logo.clearbit.com/lineman.line.me' },
  { id: 'b8', name: 'Airbnb', category: 'ท่องเที่ยว', is_recommended: 0, logo: 'https://logo.clearbit.com/airbnb.com' }
];

const brandStmt = db.prepare(`
  INSERT INTO brands (id, name, category, is_recommended, logo)
  VALUES (?, ?, ?, ?, ?)
`);

brands.forEach(b => {
  brandStmt.run(b.id, b.name, b.category, b.is_recommended, b.logo);
});

console.log('✅ Brands seeded');

// Seed Banners
const banners = [
  {
    id: 'bn1',
    title: 'Double Points Weekend',
    subtitle: 'รับคะแนนคูณ 2 ทุกวันเสาร์-อาทิตย์',
    button_text: 'ดูรายละเอียด',
    link: '/rewards',
    order_index: 1,
    is_active: 1,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800'
  },
  {
    id: 'bn2',
    title: 'New Member Bonus',
    subtitle: 'สมัครสมาชิกใหม่รับ 500 คะแนนฟรี',
    button_text: 'สมัครเลย',
    link: '/register',
    order_index: 2,
    is_active: 1,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
  }
];

const bannerStmt = db.prepare(`
  INSERT INTO banners (id, title, subtitle, button_text, link, order_index, is_active, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

banners.forEach(b => {
  bannerStmt.run(b.id, b.title, b.subtitle, b.button_text, b.link, b.order_index, b.is_active, b.image);
});

console.log('✅ Banners seeded');

// Seed Notifications for user u1
const notifications = [
  {
    id: 'n1',
    user_id: 'u1',
    title: 'คะแนนใหม่เข้าแล้ว!',
    message: 'คุณได้รับ 150 คะแนนจากการซื้อสินค้า',
    category: 'Promotions',
    icon: 'stars',
    icon_bg: 'bg-primary/10',
    icon_color: 'text-primary',
    is_read: 0
  },
  {
    id: 'n2',
    user_id: 'u1',
    title: 'ดีลพิเศษวันนี้',
    message: 'รับส่วนลด 50% สำหรับเมนูใหม่ล่าสุด',
    category: 'Promotions',
    icon: 'local_offer',
    icon_bg: 'bg-orange-100',
    icon_color: 'text-orange-600',
    is_read: 0
  },
  {
    id: 'n3',
    user_id: 'u1',
    title: 'อัปเดตระบบ',
    message: 'เวอร์ชันใหม่พร้อมให้ใช้งานแล้ว',
    category: 'System',
    icon: 'system_update',
    icon_bg: 'bg-blue-100',
    icon_color: 'text-blue-600',
    is_read: 1
  }
];

const notifStmt = db.prepare(`
  INSERT INTO notifications (id, user_id, title, message, category, icon, icon_bg, icon_color, is_read)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

notifications.forEach(n => {
  notifStmt.run(n.id, n.user_id, n.title, n.message, n.category, n.icon, n.icon_bg, n.icon_color, n.is_read);
});

console.log('✅ Notifications seeded');

// Seed Coupons for user u1
const coupons = [
  {
    id: 'c1',
    user_id: 'u1',
    code: 'COFFEE20',
    title: 'Jespark Coffee',
    description: 'ส่วนลด 20% สำหรับเครื่องดื่มทุกชนิด',
    discount: '20% OFF',
    expiry_date: '2026-12-31',
    category: 'Food',
    is_used: 0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
  },
  {
    id: 'c2',
    user_id: 'u1',
    code: 'FOOD50',
    title: 'Jespark Restaurant',
    description: 'ส่วนลด 50 บาท สำหรับอาหารทุกเมนู',
    discount: '฿50 OFF',
    expiry_date: '2026-06-30',
    category: 'Food',
    is_used: 0,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
  }
];

const couponStmt = db.prepare(`
  INSERT INTO coupons (id, user_id, code, title, description, discount, expiry_date, category, is_used, image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

coupons.forEach(c => {
  couponStmt.run(c.id, c.user_id, c.code, c.title, c.description, c.discount, c.expiry_date, c.category, c.is_used, c.image);
});

console.log('✅ Coupons seeded');

// Seed Transactions for user u1
const transactions = [
  {
    id: 't1',
    user_id: 'u1',
    type: 'earn',
    amount: 100,
    description: 'ซื้อกาแฟ Americano',
    balance_after: 4250
  },
  {
    id: 't2',
    user_id: 'u1',
    type: 'spend',
    amount: 500,
    description: 'แลกของรางวัล: ส่วนลด Grab 100 บาท',
    balance_after: 3750
  },
  {
    id: 't3',
    user_id: 'u1',
    type: 'earn',
    amount: 150,
    description: 'ซื้อเค้ก Chocolate Cake',
    balance_after: 3900
  }
];

const transStmt = db.prepare(`
  INSERT INTO transactions (id, user_id, type, amount, description, balance_after)
  VALUES (?, ?, ?, ?, ?, ?)
`);

transactions.forEach(t => {
  transStmt.run(t.id, t.user_id, t.type, t.amount, t.description, t.balance_after);
});

console.log('✅ Transactions seeded');

console.log('');
console.log('🎉 Database seeded successfully!');
console.log('');
console.log('📝 Test Credentials:');
console.log('   Phone: 0812345678');
console.log('   Password: 123456');
console.log('');

db.close();
