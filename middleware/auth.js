const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from Authorization header
  const token = req.header('Authorization');

  // If no token, deny
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Remove 'Bearer ' if present
    const pureToken = token.startsWith('Bearer ')
      ? token.slice(7, token.length)
      : token;

    // Verify token using environment secret
    const decoded = jwt.verify(pureToken, process.env.JWT_SECRET || 'jwtSecretKey123');

    // Attach user object to request
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};
