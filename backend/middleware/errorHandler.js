const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.code || 'INTERNAL_SERVER_ERROR',
    statusCode: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
