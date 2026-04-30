const jwt = require('jsonwebtoken');
const response = require('../../utils/response');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Token tidak ditemukan', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return response.error(res, 'Token tidak valid', 401);
  }
};

// Pastikan function ini diekspor dengan benar
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'Unauthorized', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      return response.error(res, 'Anda tidak memiliki akses', 403);
    }
    next();
  };
};

module.exports = { 
  verifyToken, 
  authorizeRoles  // <- pastikan ini diekspor
};