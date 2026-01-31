const express = require('express');
const db = require('../config/dbHelpers');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get Profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await db.get(`
      SELECT id, name, email, phone, avatar, points, wallet_balance, tier, member_since
      FROM users WHERE id = ?
    `, [req.user.userId]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      points: user.points,
      walletBalance: user.wallet_balance,
      tier: user.tier,
      memberSince: user.member_since
    });
  } catch (error) {
    next(error);
  }
});

// Update Profile
router.put('/profile', async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (avatar) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ไม่มีข้อมูลที่ต้องการอัปเดต'
      });
    }

    updates.push('updated_at = datetime("now")');
    values.push(req.user.userId);

    await db.run(`
      UPDATE users SET ${updates.join(', ')} WHERE id = ?
    `, values);

    const user = await db.get(`
      SELECT id, name, email, phone, avatar, points, wallet_balance, tier, member_since
      FROM users WHERE id = ?
    `, [req.user.userId]);

    res.json({
      success: true,
      message: 'อัปเดตโปรไฟล์สำเร็จ',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        points: user.points,
        walletBalance: user.wallet_balance,
        tier: user.tier,
        memberSince: user.member_since
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get Points
router.get('/points', async (req, res, next) => {
  try {
    const user = await db.get('SELECT points FROM users WHERE id = ?', [req.user.userId]);

    res.json({
      points: user.points
    });
  } catch (error) {
    next(error);
  }
});

// Add Points
router.post('/points/add', async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'จำนวนคะแนนไม่ถูกต้อง'
      });
    }

    const user = await db.get('SELECT points FROM users WHERE id = ?', [req.user.userId]);
    const newPoints = user.points + amount;

    await db.run('UPDATE users SET points = ?, updated_at = datetime("now") WHERE id = ?',
      [newPoints, req.user.userId]);

    const transactionId = 't' + Date.now() + Math.random().toString(36).substr(2, 9);
    await db.run(`
      INSERT INTO transactions (id, user_id, type, amount, description, balance_after)
      VALUES (?, ?, 'earn', ?, 'เพิ่มคะแนน', ?)
    `, [transactionId, req.user.userId, amount, newPoints]);

    const updatedUser = await db.get(`
      SELECT id, name, email, phone, avatar, points, wallet_balance, tier, member_since
      FROM users WHERE id = ?
    `, [req.user.userId]);

    res.json({
      success: true,
      message: 'เพิ่มคะแนนสำเร็จ',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        points: updatedUser.points,
        walletBalance: updatedUser.wallet_balance,
        tier: updatedUser.tier,
        memberSince: updatedUser.member_since
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get Transactions
router.get('/transactions', async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [req.user.userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const transactions = await db.all(query, params);

    const totalQuery = type 
      ? 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ? AND type = ?'
      : 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    
    const totalParams = type ? [req.user.userId, type] : [req.user.userId];
    const { total } = await db.get(totalQuery, totalParams);

    res.json({
      data: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.created_at,
        balance: t.balance_after
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
