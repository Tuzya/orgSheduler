const express = require('express');
const router = express.Router();
const {login, signup, logout, isAuth} = require("../controllers");

router.post('/login', login);
router.post('/sign-up', signup);
router.get('/logout', logout);
router.get('/check-auth', isAuth);

module.exports = router;
