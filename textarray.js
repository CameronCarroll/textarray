'use strict';

var express = require('express'),
    db = require('./lib/db'),
    arylib = require('./lib/arylib');

var app = express(express.logger());

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'txtarysecretsauce'}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
});

app.set('view options', {
  layout: false
});

app.get('/', aryroutes.getIndex);
app.get('/login', aryroutes.login);
app.get('/signup', aryroutes.signup);
app.get('/job', aryroutes.job);
app.get('/api/user/:username', aryroutes.getUser);

var port = process.env.PORT || 3000;
db.open(function() {
  console.log("Database opened successfully. Listening on port: " + port);
  app.listen(port);
});