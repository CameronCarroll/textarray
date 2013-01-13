'user strict';

var http = require('http'),
bcrypt = require('bcrypt'),
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

function encryptPassword(plaintext_password) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(plaintext_password, salt, function(err, hash) {
      return hash;
    });
  });
}