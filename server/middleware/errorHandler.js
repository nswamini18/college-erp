/**
 * Centralized Express Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  // Do not log sensitive credentials or headers
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API ERROR] ${req.method} ${req.originalUrl}:`, {
    status: statusCode,
    message: err.message,
    code: err.code || 'UNKNOWN'
  });

  // MySQL specific error translation
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A duplicate record already exists.'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Invalid foreign key reference. The referenced record does not exist.'
    });
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected server error occurred.' 
      : message
  });
}

/**
 * 404 Route Not Found Handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
