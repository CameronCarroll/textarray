'use strict';

var bcrypt = require('bcrypt'),
    db = require('./db'),
    http = require('http'),
    ObjectID = require('mongodb').ObjectID

var WORK_FACTOR = 10;

module.exports = {
  authenticate: function(username, password, callback) {
    db.findOne('users', {username: username}, function(err, user) {
      console.log('(authenticate): [user] -- (nextline) ');
      console.log(user);
      if (user && (user.password === encryptPassword(password, user.salt)))
        callback(err, user._id);
      else
        callback(err, null);
    });
  },

  createUser: function(username, email, password, callback) {
    generateSalt(WORK_FACTOR, function(err, salt) {
      console.log('(createUser): [salt] -- ' + salt);
      if (salt && !err) {
        encryptPassword(password, salt, function(err, hash) {
          if (err)
            throw err;
          if (hash) {
            var user = {username: username, email: email, password: hash, salt: salt};
            db.insertOne('users', user, callback);
            console.log('(createUser): [user] -- (nextline) ');
            console.log(user);
          }
        });
      }
      else {
        throw err;
      }
    });    
  },

  getUser: function(username, callback) {
    db.findOne('users', {username: username}, callback);
  },

  getUserById: function(id, callback) {
    db.findOne('users', {_id: new ObjectID(id)}, callback);
  }

}

function encryptPassword(plaintext_password, salt, callback) {
  console.log('(encryptPassword) salt: ' + salt);
  bcrypt.hash(plaintext_password, salt, function(err, hash) {
    console.log('Hash: ' + hash);
    if (hash)
      callback(err, hash);
    else
      callback(err, null);
  });
}

function generateSalt(work_factor, callback) {
  bcrypt.genSalt(work_factor, function(err, salt) {
    console.log('(generateSalt) salt: ' + salt);
    if (!err && salt)
      callback(err, salt);
    else
      callback(err, null);
  });
}