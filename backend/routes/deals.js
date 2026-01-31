const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM deals WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR subtitle LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const deals = db.prepare(query).all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM deals WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR subtitle LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      data: deals,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/latest', authMiddleware, (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const deals = db.prepare(`
      SELECT * FROM deals 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(parseInt(limit));

    res.json(deals);
  } catch (error) {
    next(error);
  }
});

router.get('/special', authMiddleware, (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const deals = db.prepare(`
      SELECT * FROM deals 
      WHERE tag = 'พิเศษ' OR tag = 'ยอดนิยม'
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(parseInt(limit));

    res.json(deals);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, (req, res, next) => {
  try {
    const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบดีล'
      });
    }

    res.json(deal);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
