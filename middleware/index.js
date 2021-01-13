const User = require('../models/User');
const Repeater = require("../models/Repeater");


// ALL MIDDLEWARE GOES HERE

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Log In First!');
  res.redirect('/auth/login');
};

module.exports = middlewareObj;
