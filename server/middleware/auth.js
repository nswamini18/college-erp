const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'college_erp_default_development_secret_2026';

/**
 * Verify JWT token from Authorization header
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7).trim() 
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, identifier, email, role, student_id, faculty_id }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authorization token has expired. Please log in again.'
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles Allowed roles ('STUDENT', 'FACULTY', 'ADMIN')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
}

/**
 * Helper to generate JWT token for a user
 * @param {Object} user 
 * @returns {string} Signed JWT
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.user_id || user.id,
      identifier: user.identifier || user.email,
      email: user.email,
      role: user.role,
      student_id: user.student_id || null,
      faculty_id: user.faculty_id || null
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = {
  authenticateToken,
  requireRole,
  generateToken,
  JWT_SECRET
};
