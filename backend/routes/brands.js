const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  try {
    const { category, search, limit } = req.query;

    let query = 'SELECT * FROM brands WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY is_recommended DESC, name ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const brands = db.prepare(query).all(...params);

    const { total } = db.prepare('SELECT COUNT(*) as total FROM brands').get();

    res.json({
      data: brands,
      total
    });
  } catch (error) {
    next(error);
  }
});

router.get('/recommended', (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const brands = db.prepare(`
      SELECT * FROM brands 
      WHERE is_recommended = 1 
      ORDER BY name ASC 
      LIMIT ?
    `).all(parseInt(limit));

    res.json(brands);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
