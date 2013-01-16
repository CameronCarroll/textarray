var arylib = require('../lib/arylib');

module.exports = {
  getIndex: function(req, res) {
    res.render('index');
  },

  login: function(req, res) {
    res.redirect('/job');
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