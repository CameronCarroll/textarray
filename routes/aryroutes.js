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
    db.findUserById(req.session._id, function(err, user) {
      if (user && user.job) {
        job = user.job;
        res.render('job', {job:job});
      }
      else {
        res.render('job', {job:null});
      }
    });
  },

  logged_in: function(req, res) {
    res.redirect('/job');
  }
}