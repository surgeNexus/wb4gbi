const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const passport = require('passport');
const middleware = require('../middleware/index');
const Repeater = require('../models/Repeater');
const User = require('../models/User');

router.get('/register', middleware.isLoggedIn, function (req, res) {
  Repeater.find({}, (err, foundRepeaters) => {
    if(err){console.log(err); res.redirect('back')}
    res.render('auth/register', {
      repeaters: foundRepeaters
    });
  });
});
  
  //handle sign up logic
  router.post('/register', middleware.isLoggedIn, function (req, res) {
    if (req.body.password === req.body.password2) {
      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
      });
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          console.log(err.message);
          return res.render('register', { error: err.message });
        }
        passport.authenticate('local')(req, res, function () {
          req.flash(
            'success',
            'Your secret account has been created, ' +
              user.username.toUpperCase()
          );
          res.redirect('/');
        });
      });
    } else {
      req.flash('error', 'Your passwords do not match');
      res.redirect('back');
    }
  });
  
  router.get('/login', function (req, res) {
    Repeater.find({}, (err, foundRepeaters) => {
      if(err){console.log(err); res.redirect('back')}
      res.render('auth/login', {
        repeaters: foundRepeaters
      });
    });
  });

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: 'Welcome Back!'
    }),
    function (req, res) {}
  );
  
  router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
  });

module.exports = router;
