const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'กรุณาเข้าสู่ระบบ',
        error: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่',
        error: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token ไม่ถูกต้อง',
      error: 'INVALID_TOKEN'
    });
  }
};

module.exports = authMiddleware;
