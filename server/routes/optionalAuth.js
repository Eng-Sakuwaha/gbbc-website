import jwt from 'jsonwebtoken';

// Attaches req.user if a valid token is present, but never blocks the request.
export const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // invalid token — treat as anonymous
    }
  }
  next();
};