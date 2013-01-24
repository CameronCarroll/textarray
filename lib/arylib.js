// TextArray SMS Reminder Application
// File: arylib.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: "Main" library file for TextArray.
// Contains: User auth helper methods;


'use strict';

var bcrypt = require('bcrypt'),
    db = require('./db'),
    http = require('http'),
    ObjectID = require('mongodb').ObjectID

var WORK_FACTOR = 10;

module.exports = {
  authenticate: function(username, password, callback) {
    db.findUserByName(username, function(err, user) {
      if (user) {
        encryptPassword(password, user.salt, function(err, hash) {
        if (err) throw err;
        if (user && (user.password === hash))
          callback(err, user);
        else
          callback(err, null);
        });
      }
      else {
        callback(err, null);
      }
      
    });
  },

  createUser: function(username, email, password, callback) {
    generateSalt(WORK_FACTOR, function(err, salt) {
      if (salt && !err) {
        encryptPassword(password, salt, function(err, hash) {
          if (err)
            throw err;
          if (hash) {
            var user = {username: username, email: email, password: hash, salt: salt};
            db.insertOne('users', user, callback);
          }
        });
      }
      else {
        throw err;
      }
    });    
  },

  createJob: function(owner, job_name, messages, target_number, frequency, callback) {
    var job = {owner: owner, job_name: job_name, messages: messages, target_number: target_number, frequency: frequency,
              last_sms_time: null, time_created: new Date()};
    db.insertOne('jobs', job, function(err, job) {
      if (job) {
        callback(err, job._id);
      }
      else
        callback(err, null);
    });
  },

  checkAndSendMessages: function() {
    db.findPendingJobs(function(err, pending_jobs) {
      if (pending_jobs) {
        pending_jobs.forEach(function(job) {
          console.log('Should be adding job to queue: --');
          console.log(job);
        });
      }
      else {
        console.log('no pending jobs');
      }
    });
  }
}

function encryptPassword(plaintext_password, salt, callback) {
  bcrypt.hash(plaintext_password, salt, function(err, hash) {
    if (hash) {
      callback(err, hash);
    }
    else {
      callback(err, null);
    }    
  });
}

function generateSalt(work_factor, callback) {
  bcrypt.genSalt(work_factor, function(err, salt) {
    if (!err && salt)
      callback(err, salt);
    else
      callback(err, null);
  });
}