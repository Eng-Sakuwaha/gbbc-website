import jwt from 'jsonwebtoken';

// Blocks the request if no valid JWT is present.
export const protect = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server misconfigured.' });
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized. Please sign in.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Restricts access to specific roles. Use after `protect`.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'Forbidden. You do not have permission.' });
  }
  next();
};