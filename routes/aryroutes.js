// TextArray SMS Reminder Application
// File: aryroutes.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: "Routes" file; Handles requests with a response based on route.
// Contains: Logic for web app routes.


var arylib = require('../lib/arylib');
var db = require('../lib/db');

module.exports = {
  getIndex: function(req, res) {
    res.render('index');
  },

  login: function(req, res) {
    res.render('login', { message: req.flash('error') });
  },

  signup: function(req, res) {
    arylib.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      console.log(user);
      res.redirect('/job');
    });
  },

  getUser: function(req, res) {
    arylib.getUser(req.params.username, function(err, user) {
      if (user)
        res.send('1');
      else
        res.send('0');
    });
  },

  job: function(req, res) {
    if (req.session.passport.user) {
      db.findUserById(req.session.passport.user, function(err, user) {
        if (user && user.job) {
          res.render('job', {job:user.job});
        }
        else {
          res.redirect('/create_job');
        }
      });
    }
    else {
      res.redirect('/login');
    }
  },

  create_job: function(req, res) {
    if (req.session.passport.user) {
      db.findUserById(req.session.passport.user, function(err, user) {
        res.render('create_job', { message: req.flash('error') });
      });
    }
    else {
      res.redirect('/login');
    }
  }
}