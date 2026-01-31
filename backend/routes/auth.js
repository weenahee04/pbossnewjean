const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/dbHelpers');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper function to generate user ID
const generateId = () => 'u' + Date.now() + Math.random().toString(36).substr(2, 9);

// Login
router.post('/login', [
  body('phone').matches(/^0[0-9]{9}$/).withMessage('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'),
  body('password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { phone, password } = req.body;

    const user = await db.get('SELECT * FROM users WHERE phone = ?', [phone]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        phone: userWithoutPassword.phone,
        avatar: userWithoutPassword.avatar,
        points: userWithoutPassword.points,
        walletBalance: userWithoutPassword.wallet_balance,
        tier: userWithoutPassword.tier,
        memberSince: userWithoutPassword.member_since
      }
    });
  } catch (error) {
    next(error);
  }
});

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('กรุณากรอกชื่อ'),
  body('phone').matches(/^0[0-9]{9}$/).withMessage('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'),
  body('password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  body('email').optional().isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { name, phone, password, email } = req.body;

    const existingUser = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId();

    await db.run(`
      INSERT INTO users (id, name, phone, password, email, points, wallet_balance, tier)
      VALUES (?, ?, ?, ?, ?, 0, 0, 'Bronze')
    `, [userId, name, phone, hashedPassword, email || null]);

    const token = jwt.sign(
      { userId, phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: {
        id: userId,
        name,
        phone,
        email: email || null,
        points: 0,
        walletBalance: 0,
        tier: 'Bronze',
        memberSince: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ'
  });
});

// Forgot Password
router.post('/forgot-password', [
  body('phone').matches(/^0[0-9]{9}$/).withMessage('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { phone } = req.body;

    const user = await db.get('SELECT id FROM users WHERE phone = ?', [phone]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ'
      });
    }

    res.json({
      success: true,
      message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังเบอร์โทรศัพท์แล้ว'
    });
  } catch (error) {
    next(error);
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('กรุณาระบุ token'),
  body('newPassword').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { token, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
});

// Refresh Token
router.post('/refresh', authMiddleware, (req, res, next) => {
  try {
    const token = jwt.sign(
      { userId: req.user.userId, phone: req.user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
