require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const rewardsRoutes = require('./routes/rewards');
const dealsRoutes = require('./routes/deals');
const couponsRoutes = require('./routes/coupons');
const storesRoutes = require('./routes/stores');
const brandsRoutes = require('./routes/brands');
const bannersRoutes = require('./routes/banners');
const notificationsRoutes = require('./routes/notifications');
const walletRoutes = require('./routes/wallet');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const API_PREFIX = process.env.API_PREFIX || '/api';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Jespark Rewards & Lifestyle API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      user: `${API_PREFIX}/user`,
      rewards: `${API_PREFIX}/rewards`,
      deals: `${API_PREFIX}/deals`,
      coupons: `${API_PREFIX}/coupons`,
      stores: `${API_PREFIX}/stores`,
      brands: `${API_PREFIX}/brands`,
      banners: `${API_PREFIX}/banners`,
      notifications: `${API_PREFIX}/notifications`,
      wallet: `${API_PREFIX}/wallet`
    }
  });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/user`, userRoutes);
app.use(`${API_PREFIX}/rewards`, rewardsRoutes);
app.use(`${API_PREFIX}/deals`, dealsRoutes);
app.use(`${API_PREFIX}/coupons`, couponsRoutes);
app.use(`${API_PREFIX}/stores`, storesRoutes);
app.use(`${API_PREFIX}/brands`, brandsRoutes);
app.use(`${API_PREFIX}/banners`, bannersRoutes);
app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${API_PREFIX}/wallet`, walletRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Jespark API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}${API_PREFIX}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
