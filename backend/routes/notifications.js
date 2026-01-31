const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  try {
    const { category, unreadOnly } = req.query;

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.userId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (unreadOnly === 'true') {
      query += ' AND is_read = 0';
    }

    query += ' ORDER BY created_at DESC';

    const notifications = db.prepare(query).all(...params);

    const { unreadCount } = db.prepare(`
      SELECT COUNT(*) as unreadCount 
      FROM notifications 
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.userId);

    res.json({
      data: notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category,
        icon: n.icon,
        iconBg: n.icon_bg,
        iconColor: n.icon_color,
        isUnread: n.is_read === 0,
        time: n.created_at
      })),
      total: notifications.length,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', (req, res, next) => {
  try {
    const notification = db.prepare(`
      SELECT id FROM notifications WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการแจ้งเตือน'
      });
    }

    db.prepare(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE id = ?
    `).run(req.params.id);

    res.json({
      success: true,
      message: 'อัปเดตสถานะสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
});

router.put('/read-all', (req, res, next) => {
  try {
    db.prepare(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE user_id = ? AND is_read = 0
    `).run(req.user.userId);

    res.json({
      success: true,
      message: 'อ่านทั้งหมดแล้ว'
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const notification = db.prepare(`
      SELECT id FROM notifications WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการแจ้งเตือน'
      });
    }

    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'ลบการแจ้งเตือนสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/unread-count', (req, res, next) => {
  try {
    const { count } = db.prepare(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE user_id = ? AND is_read = 0
    `).get(req.user.userId);

    res.json({ count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
