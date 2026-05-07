/**
 * NoSQL injection protection
 * Strips keys starting with '$' from req.body, req.query, req.params
 */
const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key[0] === '$') {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
};

const sanitizeMiddleware = (req, _res, next) => {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

module.exports = sanitizeMiddleware;
