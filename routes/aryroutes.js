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
    console.log('(job route) sesh id: ' + req.session.passport.user);
    db.findUserById(req.session.passport.user, function(err, user) {
      if (user && user.job) {
        job = user.job;
        res.render('job', {job:job});
      }
      else if (user) {
        res.render('job', {job:null});
      }
      else {
        res.redirect('/login');
        //res.render('login');
      }
    });
  },

  logged_in: function(req, res) {
    res.redirect('/job');
  }
}