# API Documentation - Jespark Rewards & Lifestyle

## 📋 Overview

ระบบนี้ใช้ REST API สำหรับการสื่อสารระหว่าง Frontend และ Backend
Base URL จะถูกกำหนดใน environment variable: `VITE_API_BASE_URL`

## 🔧 Configuration

### Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root ของโปรเจค:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
# หรือ
VITE_API_BASE_URL=https://your-production-api.com/api

# Optional: Gemini API (ถ้าใช้)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔐 Authentication

ทุก API request จะมี JWT token ใน Authorization header:
```
Authorization: Bearer <token>
```

Token จะถูกเก็บใน localStorage ที่ key: `jespark_auth`

## 📡 API Endpoints

### 1. Authentication APIs

#### POST `/auth/login`
เข้าสู่ระบบ

**Request Body:**
```json
{
  "phone": "0812345678",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u1",
    "name": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "phone": "0812345678",
    "avatar": "https://...",
    "points": 2450,
    "tier": "Gold",
    "memberSince": "2021"
  }
}
```

#### POST `/auth/register`
สมัครสมาชิก

**Request Body:**
```json
{
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "password": "password123"
}
```

#### POST `/auth/logout`
ออกจากระบบ

---

### 2. User APIs

#### GET `/user/profile`
ดึงข้อมูลโปรไฟล์ผู้ใช้

**Response:**
```json
{
  "id": "u1",
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "avatar": "https://...",
  "points": 2450,
  "tier": "Gold",
  "memberSince": "2021"
}
```

#### PUT `/user/profile`
อัพเดทโปรไฟล์

**Request Body:**
```json
{
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "avatar": "https://..."
}
```

#### GET `/user/points`
ดึงข้อมูลคะแนนปัจจุบัน

**Response:**
```json
{
  "points": 2450
}
```

---

### 3. Rewards APIs

#### GET `/rewards`
ดึงรายการของรางวัลทั้งหมด

**Query Parameters:**
- `category` (optional): หมวดหมู่ (อาหาร, เครื่องดื่ม, ไอที, ไลฟ์สไตล์)
- `search` (optional): คำค้นหา
- `sortBy` (optional): การเรียงลำดับ (points_asc, points_desc, popular)
- `page` (optional): หน้าที่ต้องการ (default: 1)
- `limit` (optional): จำนวนรายการต่อหน้า (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "r1",
      "title": "คูปองสตาร์บัคส์ 300 บาท",
      "description": "แลกคะแนนเพื่อรับคูปอง...",
      "points": 1000,
      "image": "https://...",
      "category": "เครื่องดื่ม",
      "isPopular": true,
      "isLimited": false
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### GET `/rewards/:id`
ดึงข้อมูลของรางวัลตาม ID

#### GET `/rewards/popular`
ดึงของรางวัลยอดนิยม

**Query Parameters:**
- `limit` (optional): จำนวนรายการ (default: 5)

#### POST `/rewards/redeem`
แลกของรางวัล

**Request Body:**
```json
{
  "rewardId": "r1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "แลกรางวัลสำเร็จ!",
  "couponCode": "STAR300",
  "transactionId": "TXN123456",
  "remainingPoints": 1450
}
```

#### GET `/rewards/history`
ดึงประวัติการแลกของรางวัล

**Query Parameters:**
- `page` (optional)
- `limit` (optional)

---

### 4. Deals APIs

#### GET `/deals`
ดึงรายการดีลทั้งหมด

**Query Parameters:**
- `category` (optional)
- `search` (optional)
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "d1",
      "title": "สดชื่นรับซัมเมอร์",
      "subtitle": "รับคะแนน x2 สำหรับเมนูชาเย็น",
      "tag": "ยอดนิยม",
      "image": "https://..."
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 20
}
```

#### GET `/deals/latest`
ดึงดีลล่าสุด

**Query Parameters:**
- `limit` (optional): default 5

#### GET `/deals/special`
ดึงดีลพิเศษ

---

### 5. Brands APIs

#### GET `/brands`
ดึงรายการแบรนด์

**Query Parameters:**
- `category` (optional)
- `search` (optional)
- `limit` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "b1",
      "name": "Starbucks",
      "logo": "https://...",
      "category": "เครื่องดื่ม"
    }
  ],
  "total": 50
}
```

#### GET `/brands/recommended`
ดึงแบรนด์แนะนำ

**Query Parameters:**
- `limit` (optional): default 8

---

### 6. Banners APIs

#### GET `/banners`
ดึงรายการแบนเนอร์ทั้งหมด

**Response:**
```json
[
  {
    "id": "bn1",
    "title": "Double Points Weekend",
    "subtitle": "รับคะแนนคูณ 2...",
    "image": "https://...",
    "buttonText": "ดูรายละเอียด",
    "link": "/rewards",
    "order": 1
  }
]
```

#### GET `/banners/active`
ดึงแบนเนอร์ที่ active อยู่

---

### 7. Coupons APIs

#### GET `/coupons`
ดึงรายการคูปอง

**Query Parameters:**
- `status` (optional): available, used, expired
- `category` (optional)
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "c1",
      "code": "COFFEE20",
      "title": "Jespark Coffee",
      "description": "ส่วนลด 20%",
      "discount": "20% OFF",
      "expiryDate": "2024-12-31T23:59:59Z",
      "image": "https://...",
      "category": "Food",
      "isUsed": false,
      "usedAt": null
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

#### GET `/coupons/available`
ดึงคูปองที่ใช้ได้

#### POST `/coupons/:id/use`
ใช้คูปอง

**Response:**
```json
{
  "success": true,
  "message": "ใช้คูปองสำเร็จ!"
}
```

---

### 8. Stores APIs

#### GET `/stores`
ดึงรายการร้านค้า

**Query Parameters:**
- `search` (optional)
- `latitude` (optional)
- `longitude` (optional)
- `radius` (optional): รัศมีในหน่วย km

**Response:**
```json
{
  "data": [
    {
      "id": "s1",
      "name": "Jespark Central World",
      "address": "999/9 ถนนพระราม 1...",
      "phone": "02-123-4567",
      "hours": "10:00 - 22:00",
      "latitude": 13.7467,
      "longitude": 100.5398,
      "distance": 1.2,
      "image": "https://..."
    }
  ],
  "total": 25
}
```

#### GET `/stores/nearby`
ดึงร้านค้าใกล้เคียง

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)
- `radius` (optional): default 5 km

---

### 9. Wallet APIs

#### GET `/wallet/balance`
ดึงยอดเงินในกระเป๋า

**Response:**
```json
{
  "balance": 5000
}
```

#### GET `/wallet/transactions`
ดึงประวัติธุรกรรม

**Query Parameters:**
- `type` (optional): earn, spend, refund
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "t1",
      "type": "earn",
      "amount": 100,
      "description": "ซื้อกาแฟ Americano",
      "date": "2024-01-15T10:30:00Z",
      "balance": 5000
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### POST `/wallet/topup`
เติมเงิน

**Request Body:**
```json
{
  "amount": 1000,
  "paymentMethod": "credit_card"
}
```

---

### 10. Notifications APIs

#### GET `/notifications`
ดึงการแจ้งเตือน

**Query Parameters:**
- `category` (optional): rewards, deals, system, account
- `unreadOnly` (optional): true/false

**Response:**
```json
[
  {
    "id": "n1",
    "title": "คะแนนใกล้หมดอายุ",
    "message": "คุณมีคะแนน 500 จะหมดอายุใน 7 วัน",
    "category": "rewards",
    "timestamp": "2024-01-15T10:00:00Z",
    "isRead": false
  }
]
```

#### PUT `/notifications/:id/read`
ทำเครื่องหมายว่าอ่านแล้ว

#### PUT `/notifications/read-all`
ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว

#### DELETE `/notifications/:id`
ลบการแจ้งเตือน

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message in Thai",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes

- `400` - Bad Request: ข้อมูลที่ส่งมาไม่ถูกต้อง
- `401` - Unauthorized: ไม่ได้เข้าสู่ระบบหรือ token หมดอายุ
- `403` - Forbidden: ไม่มีสิทธิ์เข้าถึง
- `404` - Not Found: ไม่พบข้อมูลที่ต้องการ
- `500` - Internal Server Error: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์

---

## 🔄 API Client Configuration

API client ถูกกำหนดไว้ที่ `services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token
apiClient.interceptors.request.use((config) => {
  const authData = localStorage.getItem('jespark_auth');
  if (authData) {
    const { token } = JSON.parse(authData);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 📝 Notes

1. **Authentication**: ทุก API (ยกเว้น `/auth/login` และ `/auth/register`) ต้องมี JWT token
2. **Pagination**: APIs ที่รองรับ pagination จะใช้ `page` และ `limit` parameters
3. **Date Format**: ใช้ ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
4. **Language**: Response messages เป็นภาษาไทย
5. **Rate Limiting**: API อาจมี rate limiting (ขึ้นอยู่กับ backend implementation)

---

## 🧪 Testing

สามารถทดสอบ API ด้วย:
- Postman
- Thunder Client (VS Code Extension)
- curl commands

### Example curl command:

```bash
curl -X GET "http://localhost:3001/api/rewards" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## 📞 Support

หากมีปัญหาหรือคำถามเกี่ยวกับ API กรุณาติดต่อทีมพัฒนา
