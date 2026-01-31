const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', (req, res, next) => {
  try {
    const user = db.prepare(`
      SELECT wallet_balance FROM users WHERE id = ?
    `).get(req.user.userId);

    res.json({
      balance: user.wallet_balance
    });
  } catch (error) {
    next(error);
  }
});

router.get('/transactions', (req, res, next) => {
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

    const transactions = db.prepare(query).all(...params);

    const totalQuery = type 
      ? 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ? AND type = ?'
      : 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    
    const totalParams = type ? [req.user.userId, type] : [req.user.userId];
    const { total } = db.prepare(totalQuery).get(...totalParams);

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

router.post('/topup', (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'จำนวนเงินไม่ถูกต้อง'
      });
    }

    const user = db.prepare(`
      SELECT wallet_balance FROM users WHERE id = ?
    `).get(req.user.userId);

    const newBalance = user.wallet_balance + amount;

    db.prepare(`
      UPDATE users 
      SET wallet_balance = ?, updated_at = datetime("now") 
      WHERE id = ?
    `).run(newBalance, req.user.userId);

    const transactionId = 't' + Date.now() + Math.random().toString(36).substr(2, 9);
    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, description, balance_after)
      VALUES (?, ?, 'topup', ?, ?, ?)
    `).run(transactionId, req.user.userId, amount, `เติมเงินผ่าน ${paymentMethod || 'ระบบ'}`, newBalance);

    res.json({
      success: true,
      message: 'เติมเงินสำเร็จ',
      balance: newBalance,
      transactionId
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
