const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get All Rewards
router.get('/', authMiddleware, (req, res, next) => {
  try {
    const { category, search, sortBy, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM rewards WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sortBy === 'points_asc') {
      query += ' ORDER BY points ASC';
    } else if (sortBy === 'points_desc') {
      query += ' ORDER BY points DESC';
    } else if (sortBy === 'popular') {
      query += ' ORDER BY is_popular DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const rewards = db.prepare(query).all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM rewards WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      data: rewards.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        points: r.points,
        image: r.image,
        category: r.category,
        isPopular: r.is_popular === 1,
        isLimited: r.is_limited === 1,
        stock: r.stock
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

// Get Reward by ID
router.get('/:id', authMiddleware, (req, res, next) => {
  try {
    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบของรางวัล'
      });
    }

    res.json({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      points: reward.points,
      image: reward.image,
      category: reward.category,
      isPopular: reward.is_popular === 1,
      isLimited: reward.is_limited === 1,
      stock: reward.stock
    });
  } catch (error) {
    next(error);
  }
});

// Get Popular Rewards
router.get('/popular', authMiddleware, (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const rewards = db.prepare(`
      SELECT * FROM rewards 
      WHERE is_popular = 1 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(parseInt(limit));

    res.json(rewards.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      points: r.points,
      image: r.image,
      category: r.category,
      isPopular: true,
      isLimited: r.is_limited === 1
    })));
  } catch (error) {
    next(error);
  }
});

// Redeem Reward
router.post('/redeem', authMiddleware, (req, res, next) => {
  try {
    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุรหัสของรางวัล'
      });
    }

    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(rewardId);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบของรางวัล'
      });
    }

    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.userId);

    if (user.points < reward.points) {
      return res.status(400).json({
        success: false,
        message: 'คะแนนของคุณไม่เพียงพอ'
      });
    }

    if (reward.stock === 0) {
      return res.status(400).json({
        success: false,
        message: 'ของรางวัลหมดแล้ว'
      });
    }

    const newPoints = user.points - reward.points;
    db.prepare('UPDATE users SET points = ?, updated_at = datetime("now") WHERE id = ?')
      .run(newPoints, req.user.userId);

    if (reward.stock > 0) {
      db.prepare('UPDATE rewards SET stock = stock - 1 WHERE id = ?').run(rewardId);
    }

    const couponCode = 'REWARD' + Date.now().toString(36).toUpperCase();
    const redemptionId = 'rd' + Date.now() + Math.random().toString(36).substr(2, 9);

    db.prepare(`
      INSERT INTO redemptions (id, user_id, reward_id, points_used, coupon_code, status)
      VALUES (?, ?, ?, ?, ?, 'completed')
    `).run(redemptionId, req.user.userId, rewardId, reward.points, couponCode);

    const transactionId = 't' + Date.now() + Math.random().toString(36).substr(2, 9);
    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, description, balance_after)
      VALUES (?, ?, 'spend', ?, ?, ?)
    `).run(transactionId, req.user.userId, reward.points, `แลกของรางวัล: ${reward.title}`, newPoints);

    res.json({
      success: true,
      message: 'แลกของรางวัลสำเร็จ!',
      couponCode,
      transactionId: redemptionId,
      remainingPoints: newPoints
    });
  } catch (error) {
    next(error);
  }
});

// Get Redemption History
router.get('/history', authMiddleware, (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const redemptions = db.prepare(`
      SELECT r.*, rw.title, rw.image, rw.category
      FROM redemptions r
      JOIN rewards rw ON r.reward_id = rw.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(req.user.userId, parseInt(limit), offset);

    const { total } = db.prepare(`
      SELECT COUNT(*) as total FROM redemptions WHERE user_id = ?
    `).get(req.user.userId);

    res.json({
      data: redemptions.map(r => ({
        id: r.id,
        rewardTitle: r.title,
        rewardImage: r.image,
        category: r.category,
        pointsUsed: r.points_used,
        couponCode: r.coupon_code,
        status: r.status,
        redeemedAt: r.created_at
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
