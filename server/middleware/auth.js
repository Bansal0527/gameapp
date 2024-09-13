const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Extracting JWT from request cookies, body or header
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization")?.replace("Bearer ", "");

  // If JWT is missing, return 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ success: false, message: `Token Missing` });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};