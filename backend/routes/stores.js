const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

router.get('/', (req, res, next) => {
  try {
    const { search, latitude, longitude, radius } = req.query;

    let query = 'SELECT * FROM stores WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const stores = db.prepare(query).all(...params);

    let result = stores;

    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      const maxRadius = radius ? parseFloat(radius) : 100;

      result = stores.map(store => {
        const distance = calculateDistance(
          userLat, userLon,
          store.latitude, store.longitude
        );
        return { ...store, distance: Math.round(distance * 10) / 10 };
      }).filter(store => store.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance);
    }

    res.json({
      data: result,
      total: result.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/nearby', (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุพิกัดที่ตั้ง'
      });
    }

    const stores = db.prepare('SELECT * FROM stores').all();
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const maxRadius = parseFloat(radius);

    const nearbyStores = stores.map(store => {
      const distance = calculateDistance(
        userLat, userLon,
        store.latitude, store.longitude
      );
      return { ...store, distance: Math.round(distance * 10) / 10 };
    }).filter(store => store.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyStores);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบร้านค้า'
      });
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
