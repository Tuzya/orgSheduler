function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ err: 'Unauthorized' });
  }
}

function checkNoAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ err: 'Already Authorized' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role === 'admin') next();
  else res.status(403).json({ err: 'Forbidden' });
}

module.exports = { checkAuth, checkNoAuth, isAdmin };
