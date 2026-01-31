const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'jespark.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

console.log('🗄️  Initializing database...');

const schema = `
  -- Users Table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    wallet_balance REAL DEFAULT 0,
    tier TEXT DEFAULT 'Bronze',
    member_since TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Rewards Table
  CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    image TEXT,
    category TEXT,
    is_popular INTEGER DEFAULT 0,
    is_limited INTEGER DEFAULT 0,
    stock INTEGER DEFAULT -1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Deals Table
  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT,
    image TEXT,
    category TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Coupons Table
  CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount TEXT,
    expiry_date TEXT,
    image TEXT,
    category TEXT,
    is_used INTEGER DEFAULT 0,
    used_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Stores Table
  CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    hours TEXT,
    latitude REAL,
    longitude REAL,
    image TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Brands Table
  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    category TEXT,
    is_recommended INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Banners Table
  CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT,
    button_text TEXT,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Notifications Table
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    message TEXT,
    category TEXT,
    icon TEXT,
    icon_bg TEXT,
    icon_color TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Transactions Table
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    balance_after REAL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Redemptions Table
  CREATE TABLE IF NOT EXISTS redemptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    reward_id TEXT NOT NULL,
    points_used INTEGER NOT NULL,
    coupon_code TEXT,
    status TEXT DEFAULT 'completed',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_coupons_user_id ON coupons(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
`;

db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Database tables created successfully!');
  console.log('📍 Database location:', dbPath);
  
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    }
    process.exit(0);
  });
});
