# Jespark Backend API

Backend API สำหรับแอปพลิเคชัน Jespark Rewards & Lifestyle

## 🚀 Tech Stack

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **SQLite** (better-sqlite3) - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **express-validator** - Input Validation

## 📋 Prerequisites

- Node.js v18 หรือสูงกว่า
- npm หรือ yarn

## 🔧 Installation

### 1. ติดตั้ง Dependencies

```bash
cd backend
npm install
```

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
DB_PATH=./database/jespark.db
CORS_ORIGIN=http://localhost:3000
API_PREFIX=/api
```

### 3. สร้าง Database และ Seed ข้อมูล

```bash
# สร้าง database tables
npm run init-db

# เพิ่มข้อมูลตัวอย่าง
npm run seed
```

### 4. รัน Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server จะรันที่: `http://localhost:3001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/logout` - ออกจากระบบ
- `POST /api/auth/forgot-password` - ลืมรหัสผ่าน
- `POST /api/auth/reset-password` - รีเซ็ตรหัสผ่าน
- `POST /api/auth/refresh` - Refresh token

### User

- `GET /api/user/profile` - ดึงข้อมูลโปรไฟล์
- `PUT /api/user/profile` - อัปเดตโปรไฟล์
- `GET /api/user/points` - ดึงคะแนนปัจจุบัน
- `POST /api/user/points/add` - เพิ่มคะแนน
- `GET /api/user/transactions` - ดึงประวัติธุรกรรม

### Rewards

- `GET /api/rewards` - ดึงรายการของรางวัล
- `GET /api/rewards/:id` - ดึงของรางวัลตาม ID
- `GET /api/rewards/popular` - ดึงของรางวัลยอดนิยม
- `POST /api/rewards/redeem` - แลกของรางวัล
- `GET /api/rewards/history` - ดึงประวัติการแลก

### Deals

- `GET /api/deals` - ดึงรายการดีล
- `GET /api/deals/latest` - ดึงดีลล่าสุด
- `GET /api/deals/special` - ดึงดีลพิเศษ
- `GET /api/deals/:id` - ดึงดีลตาม ID

### Coupons

- `GET /api/coupons` - ดึงรายการคูปอง
- `GET /api/coupons/available` - ดึงคูปองที่ใช้ได้
- `GET /api/coupons/:id` - ดึงคูปองตาม ID
- `POST /api/coupons/:id/use` - ใช้คูปอง

### Stores

- `GET /api/stores` - ดึงรายการร้านค้า
- `GET /api/stores/nearby` - ดึงร้านค้าใกล้เคียง
- `GET /api/stores/:id` - ดึงร้านค้าตาม ID

### Brands

- `GET /api/brands` - ดึงรายการแบรนด์
- `GET /api/brands/recommended` - ดึงแบรนด์แนะนำ

### Banners

- `GET /api/banners` - ดึงรายการแบนเนอร์
- `GET /api/banners/active` - ดึงแบนเนอร์ที่ active

### Notifications

- `GET /api/notifications` - ดึงการแจ้งเตือน
- `PUT /api/notifications/:id/read` - ทำเครื่องหมายว่าอ่านแล้ว
- `PUT /api/notifications/read-all` - ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
- `DELETE /api/notifications/:id` - ลบการแจ้งเตือน
- `GET /api/notifications/unread-count` - จำนวนที่ยังไม่ได้อ่าน

### Wallet

- `GET /api/wallet/balance` - ดึงยอดเงินในกระเป๋า
- `GET /api/wallet/transactions` - ดึงประวัติธุรกรรม
- `POST /api/wallet/topup` - เติมเงิน

## 🔐 Authentication

API ใช้ JWT (JSON Web Token) สำหรับ authentication

### การเข้าสู่ระบบ

```bash
POST /api/auth/login
Content-Type: application/json

{
  "phone": "0812345678",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u1",
    "name": "อเล็กซ์ จอห์นสัน",
    "phone": "0812345678",
    "points": 4250,
    "walletBalance": 1240.50,
    "tier": "Platinum"
  }
}
```

### การใช้ Token

เพิ่ม Authorization header ในทุก request:

```
Authorization: Bearer <your_token_here>
```

## 🧪 Testing

### ข้อมูลทดสอบ

หลังจาก seed database แล้ว คุณสามารถใช้ข้อมูลนี้ในการทดสอบ:

**User 1:**
- Phone: `0812345678`
- Password: `123456`
- Points: 4250
- Tier: Platinum

**User 2:**
- Phone: `0823456789`
- Password: `123456`
- Points: 2100
- Tier: Gold

### ทดสอบด้วย curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0812345678","password":"123456"}'

# Get Profile (ใส่ token ที่ได้จาก login)
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get Rewards
curl -X GET http://localhost:3001/api/rewards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### ทดสอบด้วย Postman

1. Import collection จาก `postman_collection.json` (ถ้ามี)
2. ตั้งค่า environment variable `base_url` = `http://localhost:3001/api`
3. Login และ copy token
4. ตั้งค่า `token` variable
5. ทดสอบ endpoints อื่นๆ

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User routes
│   ├── rewards.js           # Rewards routes
│   ├── deals.js             # Deals routes
│   ├── coupons.js           # Coupons routes
│   ├── stores.js            # Stores routes
│   ├── brands.js            # Brands routes
│   ├── banners.js           # Banners routes
│   ├── notifications.js     # Notifications routes
│   └── wallet.js            # Wallet routes
├── scripts/
│   ├── initDatabase.js      # Database initialization
│   └── seedData.js          # Seed sample data
├── database/
│   └── jespark.db           # SQLite database (generated)
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── server.js                # Main server file
├── package.json             # Dependencies
└── README.md                # This file
```

## 🗄️ Database Schema

### Users
- id, name, email, phone, password, avatar
- points, wallet_balance, tier, member_since

### Rewards
- id, title, description, points, image
- category, is_popular, is_limited, stock

### Deals
- id, title, subtitle, tag, image, category

### Coupons
- id, user_id, code, title, description
- discount, expiry_date, is_used, used_at

### Stores
- id, name, address, phone, hours
- latitude, longitude, image

### Brands
- id, name, logo, category, is_recommended

### Banners
- id, title, subtitle, image, button_text
- link, order_index, is_active

### Notifications
- id, user_id, title, message, category
- icon, icon_bg, icon_color, is_read

### Transactions
- id, user_id, type, amount
- description, balance_after

### Redemptions
- id, user_id, reward_id, points_used
- coupon_code, status

## 🔒 Security

- Passwords ถูก hash ด้วย bcryptjs
- JWT tokens มีอายุ 7 วัน (ปรับได้ใน .env)
- CORS ถูกตั้งค่าให้รับ request จาก frontend เท่านั้น
- Input validation ด้วย express-validator
- SQL injection protection ด้วย prepared statements

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create jespark-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to Railway

1. เชื่อมต่อ GitHub repository
2. ตั้งค่า environment variables
3. Deploy อัตโนมัติ

### Deploy to VPS

1. Clone repository
2. ติดตั้ง dependencies: `npm install`
3. ตั้งค่า .env
4. รัน init-db และ seed
5. ใช้ PM2 เพื่อรัน server:

```bash
npm install -g pm2
pm2 start server.js --name jespark-api
pm2 save
pm2 startup
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `DB_PATH` | Database path | ./database/jespark.db |
| `CORS_ORIGIN` | Allowed origin | http://localhost:3000 |
| `API_PREFIX` | API prefix | /api |

## 🐛 Troubleshooting

### Database locked error
```bash
# ลบ database และสร้างใหม่
rm database/jespark.db
npm run init-db
npm run seed
```

### Port already in use
```bash
# เปลี่ยน PORT ใน .env
PORT=3002
```

### CORS error
```bash
# ตรวจสอบ CORS_ORIGIN ใน .env
CORS_ORIGIN=http://localhost:3000
```

## 📞 Support

หากมีปัญหาหรือคำถาม:
- Email: support@jespark.com
- GitHub Issues: [Create Issue]

## 📄 License

MIT License

---

**Made with ❤️ by Jespark Team**
