const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });


  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });

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

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};


const adminAuth = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};



module.exports = {authMiddleware, adminAuth};
