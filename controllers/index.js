const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { saltRounds } = require('../config/constants');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).json(err);
    }
    return req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json(err);
      }
      return res
        .status(202)
        .send();
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

  if (secret === process.env.AUTH_SECRET) {
    const sameUser = await User.findOne({ username });
    if (!sameUser) {
      const hash = await bcrypt.hash(password, saltRounds);
      await User.create({
        username,
        email,
        password: hash,
      });
      return res.status(200).send('Now log in');
    }
    return res.status(400).send('This username is already used');
  }
  return res.status(403).send('Forbidden');
};

exports.logout = (req, res) => {
  req.logout();
  res.status(200).send('You logged out!');
};

exports.isAuth = (req, res) => {
  const isAuth = req.isAuthenticated();
  res.send(isAuth);
};
