// Lightweight input validation helpers used by admin routes.
export const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => {
    const v = req.body?.[f];
    return v === undefined || v === null || v === '';
  });
  if (missing.length) {
    return res.status(400).json({
      message: `Please provide: ${missing.join(', ')}.`
    });
  }
  next();
};

export const sanitizeStrings = (fields) => (req, _res, next) => {
  for (const f of fields) {
    if (typeof req.body?.[f] === 'string') {
      req.body[f] = req.body[f].trim();
    }
  }
  next();
};