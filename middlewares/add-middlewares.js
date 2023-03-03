const express = require('express');
const createError = require('http-errors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');

const morgan = require('morgan');
const bcrypt = require('bcrypt');
const mongooseStoreOpt = require('../connection');
const User = require('../models/User');

function addMiddlewares(router) {
  router.use(express.urlencoded({ limit: '30mb', extended: true }));
  router.use(express.json({ limit: '30mb' }));

  router.use(morgan('dev'));

  const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  };
  router.use(corsMiddleware);
  router.use(express.static('public'));

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      const currentUser = await User.findOne({ username });
      if (currentUser === null) {
        return done('Error. Username not found!');
      }
      const isPasswordCorrect = await bcrypt.compare(password, currentUser.password);
      if (isPasswordCorrect) {
        const user = {
          id: currentUser.id,
          nickname: currentUser.nickname,
          email: currentUser.email,
        };
        return done(null, user);
      }
      return done('Error. Password not correct!');
    },
  ));

  router.use(session({
    key: 'elbrus_scheduler_sid',
    store: new MongoStore(mongooseStoreOpt),
    secret: process.env.COOKIESSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
  }));

  router.use(passport.initialize());
  router.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).select({ password: 0, __v: 0}).lean();
    done(null, user);
  });
}

function addErrorHandlers(router) {
  router.use((req, res, next) => {
    next(createError(404));
  });

  router.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json(err);
  });
}

module.exports = {
  addMiddlewares,
  addErrorHandlers,
};
