# 🗄️ Database Documentation - Jespark Rewards & Lifestyle

## 📋 Overview
PostgreSQL 14+ database สำหรับระบบ Jespark Rewards & Lifestyle

## 🏗️ Tables (14 ตาราง)

1. **users** - ข้อมูลผู้ใช้ (id, name, email, phone, points, tier)
2. **categories** - หมวดหมู่ (อาหาร, เครื่องดื่ม, ไอที, ไลฟ์สไตล์)
3. **brands** - แบรนด์พาร์ทเนอร์
4. **rewards** - ของรางวัลที่แลกได้
5. **reward_redemptions** - ประวัติการแลกของรางวัล
6. **deals** - ดีลและโปรโมชั่น
7. **coupons** - คูปองของผู้ใช้
8. **banners** - แบนเนอร์โฆษณา
9. **stores** - สาขาร้านค้า (พร้อม lat/long)
10. **wallet_transactions** - ธุรกรรมกระเป๋าเงิน
11. **points_history** - ประวัติคะแนน
12. **notifications** - การแจ้งเตือน
13. **user_sessions** - เซสชันผู้ใช้ (JWT)
14. **audit_logs** - บันทึกการตรวจสอบ

## 🚀 Installation

```bash
# สร้าง database
createdb jespark_db

# รัน schema
psql -d jespark_db -f database/schema.sql

# รัน sample data
psql -d jespark_db -f database/seed_data.sql
```

## 🔧 Key Features

- UUID primary keys
- Auto-update timestamps (triggers)
- Geolocation support (stores)
- Full-text search ready
- Comprehensive indexes
- Built-in functions:
  - `calculate_distance()` - คำนวณระยะทาง
  - `get_nearby_stores()` - หาสาขาใกล้เคียง
  - `redeem_reward()` - แลกของรางวัล (atomic)

## 📊 Sample Queries

```sql
-- Top users
SELECT name, points, tier FROM users ORDER BY points DESC LIMIT 10;

-- Popular rewards
SELECT r.title, COUNT(rr.id) as redeemed
FROM rewards r
LEFT JOIN reward_redemptions rr ON r.id = rr.reward_id
GROUP BY r.id ORDER BY redeemed DESC;

-- Nearby stores
SELECT * FROM get_nearby_stores(13.7467, 100.5398, 5);
```

## 🔐 Security
- bcrypt password hashing
- JWT authentication
- Row-level security ready
- Audit logging enabled

## 📦 Backup
```bash
pg_dump jespark_db > backup.sql
```
