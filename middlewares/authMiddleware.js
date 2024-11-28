const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.userRole = decoded.role; // Assuming the token includes the 'role'
    req.userId = decoded._id;   // Assuming the token includes '_id'
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};

module.exports = authMiddleware;
