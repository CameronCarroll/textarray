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

  login_form: function(req, res) {
    if (req.session.passport.user) {
      res.redirect('/');
    }
    else {
      res.render('login', { message: req.flash('error') });
    }
  },

  signup_form: function(req, res) {
    if (req.session.passport.user) {
      res.redirect('/job');
    }
    else {
      res.render('signup', { message: req.flash('error') });
    }
  },

  signup: function(req, res) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;

    console.log("Creating user for signup...");

    if (username && password) {
      arylib.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
        console.log(user);
        res.redirect('/job');
      });
    }
    else {
      console.log('username and password fail');
      res.redirect('/signup', { message: "Missed a required field."});
    }
    
  },

  getUser: function(req, res) {
    db.findUserByName(req.params.username, function(err, user) {
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
          res.render('job', {job:user.job, message:req.flash('error')});
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

  create_job_form: function(req, res) {
    if (req.session.passport.user) {
      db.findUserById(req.session.passport.user, function(err, user) {
        res.render('create_job', { message: req.flash('error') });
      });
    }
    else {
      res.redirect('/login');
    }
  },

  create_job: function(req, res) {

    var owner = req.session.passport.user,
        jobName = req.body.jobName,
        messages = req.body.messages,
        targetNumber = req.body.targetNumber,
        frequency = req.body.frequency;

    arylib.createJob(owner, jobName, messages, targetNumber, frequency, function(err, job_id) {
      db.set('users', owner, {job: job_id}, function(err, user) {
        res.redirect('/job', { message: "Created job successfully."});
      });
    });
  },

  update_job_form: function(req, res) {
    if (req.session.passport.user) {
      db.findUserById(req.session.passport.user, function(err, user) {
        res.render('update_job', { message: req.flash('error') });
      });
    }
    else {
      res.redirect('/login');
    }
  },

  update_job: function(req, res) {

    var owner = req.session.passport.user,
        jobName = req.body.jobName,
        messages = req.body.messages,
        targetNumber = req.body.targetNumber,
        frequency = req.body.frequency;

    arylib.createJob(owner, jobName, messages, targetNumber, frequency, function(err, job_id) {
      db.set('users', owner, {job: job_id}, function(err, user) {
        res.redirect('/job');
      });
    });
  }

  
}