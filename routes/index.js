const express = require('express');
const router = express.Router();
const { login, signup, logout, isAuth } = require('../controllers');
const { checkNoAuth } = require('../middlewares/check-auth');

router.post('/login', checkNoAuth, login);
router.post('/sign-up', checkNoAuth, signup);
router.get('/logout', logout);
router.get('/check-auth', isAuth);

module.exports = router;
