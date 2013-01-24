// TextArray SMS Reminder Application
// File: arylib.test.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: Test file for "Main" library
// Contains: Test setup and methods for user auth functions.


'use strict';

var assert = require('assert'),
    should = require('should'),
    db = require('../lib/db'),
    arylib = require('../lib/arylib');

var username = 'cameron',
    email = 'test@mail.com',
    password = 'testpass';

describe('TextArray Library:', function() {

  var instance_user;

  before(function(done) {
    db.clear(function() {
      arylib.createUser(username, email, password, function(err, user) {
        instance_user = user;
        done();
      });
    });
  })

  describe('create_user', function() {
    // 1:
    it("should save a user object to database", function(done) {
      db.findUserByName(username, function(err, user) {
        should.exist(user);
        should.not.exist(err);
        done();
      });
    })
  })

  describe('authenticate', function() {
    // 1:
    it("should return user_id if correctly identified", function(done) {
      arylib.authenticate(username, password, function(err, user) {
        should.not.exist(err);
        instance_user._id.should.eql(user._id);
        done();
      });
    })
  })

  describe('create_job', function() {
    // 1:
    // Job; owner, name, target_number, messages_key, frequency
    it("should save a job and return job id", function(done) {
      var owner = 'cameron',
          job_name = 'test',
          messages_key = 'testkey',
          target_number = '6191111111',
          frequency = '6';

      arylib.createJob(owner, job_name, messages_key, target_number, frequency, function(err, job_id) {
        should.not.exist(err);
        should.exist(job_id);
        done();
      });
    })
  })

  describe('find_ready_jobs', function() {
    // 1:
    it("should find jobs whose time since last message exceeds wait time, returns array of jobs", function(done) {
      var jobs = new Array();

    });
  })

})