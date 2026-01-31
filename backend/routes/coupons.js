const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM coupons WHERE user_id = ?';
    const params = [req.user.userId];

    if (status === 'available') {
      query += ' AND is_used = 0 AND datetime(expiry_date) > datetime("now")';
    } else if (status === 'used') {
      query += ' AND is_used = 1';
    } else if (status === 'expired') {
      query += ' AND is_used = 0 AND datetime(expiry_date) <= datetime("now")';
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const coupons = db.prepare(query).all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM coupons WHERE user_id = ?';
    const countParams = [req.user.userId];

    if (status === 'available') {
      countQuery += ' AND is_used = 0 AND datetime(expiry_date) > datetime("now")';
    } else if (status === 'used') {
      countQuery += ' AND is_used = 1';
    } else if (status === 'expired') {
      countQuery += ' AND is_used = 0 AND datetime(expiry_date) <= datetime("now")';
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      data: coupons.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description,
        discount: c.discount,
        expiryDate: c.expiry_date,
        image: c.image,
        category: c.category,
        isUsed: c.is_used === 1,
        usedAt: c.used_at
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/available', (req, res, next) => {
  try {
    const coupons = db.prepare(`
      SELECT * FROM coupons 
      WHERE user_id = ? 
      AND is_used = 0 
      AND datetime(expiry_date) > datetime("now")
      ORDER BY expiry_date ASC
    `).all(req.user.userId);

    res.json(coupons.map(c => ({
      id: c.id,
      code: c.code,
      title: c.title,
      description: c.description,
      discount: c.discount,
      expiryDate: c.expiry_date,
      image: c.image,
      category: c.category,
      isUsed: false
    })));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const coupon = db.prepare(`
      SELECT * FROM coupons WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.userId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบคูปอง'
      });
    }

    res.json({
      id: coupon.id,
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discount: coupon.discount,
      expiryDate: coupon.expiry_date,
      image: coupon.image,
      category: coupon.category,
      isUsed: coupon.is_used === 1,
      usedAt: coupon.used_at
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/use', (req, res, next) => {
  try {
    const coupon = db.prepare(`
      SELECT * FROM coupons WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.userId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบคูปอง'
      });
    }

    if (coupon.is_used === 1) {
      return res.status(400).json({
        success: false,
        message: 'คูปองนี้ถูกใช้งานแล้ว'
      });
    }

    if (new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'คูปองหมดอายุแล้ว'
      });
    }

    db.prepare(`
      UPDATE coupons 
      SET is_used = 1, used_at = datetime("now") 
      WHERE id = ?
    `).run(req.params.id);

    res.json({
      success: true,
      message: 'ใช้คูปองสำเร็จ!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
