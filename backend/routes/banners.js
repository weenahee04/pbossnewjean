const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  try {
    const banners = db.prepare(`
      SELECT * FROM banners 
      ORDER BY order_index ASC, created_at DESC
    `).all();

    res.json(banners);
  } catch (error) {
    next(error);
  }
});

router.get('/active', (req, res, next) => {
  try {
    const banners = db.prepare(`
      SELECT * FROM banners 
      WHERE is_active = 1 
      ORDER BY order_index ASC, created_at DESC
    `).all();

    res.json(banners);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
