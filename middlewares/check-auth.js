function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('NOT AUTHENTICATED');
  }
}

module.exports = checkAuth;
