// TextArray SMS Reminder Application
// File: textarray.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: "Main" file for TextArray web app. Invoke with 'node textarray.js'
// Contains: Auth logic, app configuration, route funnels, server starting logic

'use strict';

var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./lib/db'),
    arylib = require('./lib/arylib'),
    aryroutes = require('./routes/aryroutes'),
    flash = require('connect-flash');

var VERSION = '0.1.1';



// Authentication:

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.findUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
      arylib.authenticate(username, password, function(err, user) {
        if (err) { return done(err, { message: 'Error.'}); }
        if (!user) { return done(null, false, { message: 'Authentication failed.' }); }
        return done(null, user, { message: 'Success.'});
      })
    });
  }
));

// Application config:

var app = express(express.logger());

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'txtarysecretsauce'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
});

app.set('view options', {
  layout: false
});

// Route funnels:

app.get('/', aryroutes.getIndex);
app.get('/api/user/:username', aryroutes.getUser);
app.get('/job', aryroutes.job);
app.get('/login', aryroutes.login_form);
app.get('/signup', aryroutes.signup_form)
app.get('/create_job', aryroutes.create_job_form);
app.get('/update_job', aryroutes.update_job_form);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), aryroutes.job);
app.post('/signup', aryroutes.signup);
app.post('/create_job', aryroutes.create_job);
app.post('/update_job', aryroutes.update_job);

var port = process.env.PORT || 3000;
db.open(function() {
  console.log("TextArray " + VERSION + " -- Cameron Carroll 2013");
  console.log("Database opened successfully. Listening on port: " + port);
  app.listen(port);

  var minute = 60000;

  setInterval(arylib.checkAndSendMessages, minute)
});

