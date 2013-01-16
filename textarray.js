'use strict';

var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./lib/db'),
    arylib = require('./lib/arylib'),
    aryroutes = require('./routes/aryroutes');



// Authentication:

passport.serializeUser(function(use, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.findUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
      db.findUserByName(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password.' }); }
        return done(null, user);
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

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), aryroutes.login);
app.post('/signup', aryroutes.signup);

var port = process.env.PORT || 3000;
db.open(function() {
  console.log("Database opened successfully. Listening on port: " + port);
  app.listen(port);
});