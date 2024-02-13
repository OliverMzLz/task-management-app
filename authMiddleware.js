const jwt = require('jsonwebtoken'); // Import JWT library

const secretKey = 'secret';

const authMiddleware = (req, res, next) => {
  if (req.path === '/register' || req.path === '/login' || req.path === '/') {
    // Skip token validation for registration and login routes
    next();
  } else {
    //token is in cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }

  }
};

module.exports = authMiddleware;
