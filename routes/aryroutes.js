var arylib = require('../lib/arylib');

module.exports = {
  getIndex: function(req, res) {
    res.render('index');
  },

  login: function(req, res) {
    arylib.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        res.redirect('/job');
      }
      else {
        res.redirect('/');
      }
    });
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
    arylib.getUserById(req.session._id, function(err, user) {
      if (user && user.job)
        job = user.job
      res.render('job', {job:job});
    });
  }
}