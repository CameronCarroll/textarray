// TextArray SMS Reminder Application
// File: arylib.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: "Main" library file for TextArray.
// Contains: User auth helper methods;


'use strict';

var bcrypt = require('bcrypt'),
    db = require('./db'),
    http = require('http'),
    ObjectID = require('mongodb').ObjectID,
    kue = require('kue'),
    redis = require('kue/node_modules/redis'),
    request = require('request').post,
    url = require('url');

kue.redis.createClient = function() {
  var our_url;
  if (process.env.REDISTOGO_URL)
    our_url = process.env.REDISTOGO_URL
  else
    our_url = 'redis://localhost:6379'

  console.log('myredis: ' + process.env.REDISTOGO_URL);
  console.log('process.env: -- ');
  console.log(process.env)
;
  var redisUrl = url.parse(our_url)
    , client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
      client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

var kuejobs = kue.createQueue();

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
              last_sms_time: null, time_created: new Date(), sms_sent: 0, pending: false};
    db.insertOne('jobs', job, function(err, job) {
      if (job) {
        callback(err, job._id);
      }
      else
        callback(err, null);
    });
  },

  checkAndQueueMessages: function() {
    db.findPendingJobs(function(err, pending_jobs) {
      if (pending_jobs) {
        pending_jobs.forEach(function(job) {
          kuejobs.create('sms', {
            title: job.job_name,
            job: job
          }).save(function(err) {
            db.set('jobs', job._id, {pending: true}, function(err, success) {
              console.log(job);
              console.log('New pending job: ' + job.job_name);
            })
          });
        });
      }
      else {
        console.log('no pending jobs');
      }
    });
  },

  sendMessages: function() {
    kuejobs.process('sms', function(job, done) {
      module.exports.sendMessage(job.data.job.messages, job.data.job.target_number, function(success) {
        if (success) {
          var new_sms_sent = job.data.job.sms_sent + 1;
          var new_sms_time = new Date();
          db.set('jobs', job.data.job._id, {sms_sent: new_sms_sent, last_sms_time: new_sms_time, pending: false}, function(err, success) {
            if (!err && job) {
              console.log('Successfully sent message for project: ' + job.data.job.job_name);
            }
            else {
              console.log('(sendMessages) Failed to update project.')
              console.log('Error: ' + err);
            }
          })
        }
        else {
          // report as failed somehow?
          console.log('didnt report success');
        }
      });
    });
  },

  sendMessage: function(message, destination, callback) {

    var req_str = "number=" + destination + "&message=" + message
    var req_options = {
      uri: 'http://www.textbelt.com/text',
      body: req_str,
      method: "POST",
      headers: {"content-type": "application/x-www-form-urlencoded"}
    }

    request(req_options, function(err, res, body) {
      var body_data = JSON.parse(body);
      if (body_data.success) {
        callback(true);
      }
      else {
        callback(false);
      }

    })
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