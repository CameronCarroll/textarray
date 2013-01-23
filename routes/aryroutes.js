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
    db.findUserById(req.session.passport.user, function(err, user) {
      if (user && user.job) {
        job = user.job;
        res.render('job', {job:job});
      }
      else if (user) {
        res.redirect('/create_job');
      }
      else {
        res.redirect('/login');
        //res.render('login');
      }
    });
  },

  create_job: function(req, res) {
    db.findUserById(req.session.passport.user, function(err, user) {

    });
  },

  logged_in: function(req, res) {
    res.redirect('/job');
  }
}