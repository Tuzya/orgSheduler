const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const {saltRounds} = require('../config/constants');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.error('Auth Error:', err);
      return res.status(400).json({err: 'Wrong name or password.'});
    }
    return req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error', err);
        return res.status(400).json({err});
      }
      return res
        .status(202)
        .json({message: 'ok'});
    });
  })(req, res, next);
};

exports.signup = async (req, res) => {
  const {
    username,
    email,
    password,
    secret,
  } = req.body;

  try {
    if (secret === process.env.AUTH_SECRET) {
      const sameUser = await User.findOne({username});
      if (!sameUser) {
        const hash = await bcrypt.hash(password, saltRounds);
        await User.create({
          username,
          email,
          password: hash,
        });
        return res.status(200).json({message: 'Now log in'});
      }
      return res.status(400).json({err: 'This username is already used'});
    }
    return res.status(403).json({err: 'Forbidden'});
  } catch (err) {
    console.error(err);
    res.status(500).json({err: err.message});
  }
};

exports.logout = (req, res, next) => {

  req.logout((err) => {
    if (err) { return next(err.message); }
    res.status(200).send('You logged out!');
  });
};

exports.isAuth = (req, res) => {
  const isAuth = req.isAuthenticated();
  res.send(isAuth);
};
