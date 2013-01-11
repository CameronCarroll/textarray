'user strict';

var http = require('http'),
crypto = require('crypto'),
ObjectID = require('mongodb').ObjectID,
db = require('./db')

module.exports = {
  authenticate: function(username, password, callback) {
    db.findOne('users', {username: username}, function(err, user) {
      if (user && (user.password === encryptPassword(password)))
        callback(error, user._id);
      else
        callback(error, null);
    });
  },

  createUser: function(username, email, password, callback) {
    var user = {username: username, email: email, password: encryptPassword(password)};
    db.insertOne('users', user, callback);
  }
}