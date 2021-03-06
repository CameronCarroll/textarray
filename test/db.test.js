// TextArray SMS Reminder Application
// File: db.test.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: Test file for DB library.
// Contains: DB access layer tests and setup.


'use strict';

var assert = require ('assert'),
    db = require('../lib/db'),
    should = require('should'),
    arylib = require('../lib/arylib');

var userData = {};

describe('database', function() {

  after(function(done) {
    db.clear(done());
  })
  
  var insertedJob;
  var username = 'cameron';

  describe('open', function() {
    it('should open db and return our collection', function(done) {
      db.open(function(err, collection) {
        should.not.exist(err);
        should.exist(collection);
        done();
      });
    });
  });

  describe('insertOne', function() {

    it('should insert an object to its collection', function(done) {
      // note: this is NOT the current job schema
      var job = {username: username,
                time_started: new Date(),
                time_modified: new Date(),
                target_number: '6193585266',
                message_pack_index: 'testpack',
                frequency: 6}
      db.insertOne('jobs', job, function(err, job) {
        should.not.exist(err);
        should.exist(job._id);
        insertedJob = job;
        done();
      });
    })
  })

  describe('findOne', function() {
    it('should find an object from its collection', function(done) {
      var id = insertedJob._id;
      db.findOne('jobs', id, function(error, job) {
        should.not.exist(error);
        should.exist(job._id);
        job.username.should.eql(insertedJob.username);
        job.message_pack_index.should.eql(insertedJob.message_pack_index);
        done();
      });
    });
  });

  describe('findUserById', function() {
    var user_id;

    before(function(done) {
      var username = 'cameron',
          email = 'test@mail.com',
          password = 'testpass';
      

      db.clear(function() {
        arylib.createUser(username, email, password, function(err, user) {
          user_id = user._id;
          done();
        });
      });
    })

    it('should return a user object found by id', function(done) {
      db.findUserById(user_id, function(err, user) {
        should.not.exist(err);
        user._id.should.eql(user_id);
        done();
      });
    })
  })

  describe('findUserByName', function() {
    var user_id;
    var user_name;

    before(function(done) {
      var username = 'cameron',
          email = 'test@mail.com',
          password = 'testpass';

          user_name = username;
      

      db.clear(function() {
        arylib.createUser(username, email, password, function(err, user) {
          user_id = user._id;
          done();
        });
      });
    })

    it('should return a user object found by name', function(done) {
      db.findUserByName(user_name, function(err, user) {
        should.not.exist(err);
        user._id.should.eql(user_id);
        done();
      });
    })
  }),

  describe('find_job_for_user', function() {

    var user_id;

    before(function(done) {
      var owner = 'cameron',
          job_name = 'test job 1',
          messages = 'test message 1',
          target_number = '6193585266',
          frequency = '6';

      db.findUserByName(owner, function(err, user) {
        user_id = user._id;
        arylib.createJob(user_id, job_name, messages, target_number, frequency, function(err, job_id) {
          should.not.exist(err);
          should.exist(job_id);
          done();
        });
      });
    })

    // 1:
    it("should return a job given a user's id", function(done) {
      db.findJobByUser(user_id, function(err, job) {
        should.not.exist(err);
        should.exist(job);
        done();
      });
    })
  })

  describe('find_all_jobs', function() {
    before(function(done) {
      var owner_name = 'cameron',
          job_name = 'test job 2',
          messages = 'test message',
          target_number = '6193585266',
          frequency = '6';

      db.findUserByName(owner_name, function(err, user) {
        var user_id = user._id;
        arylib.createJob(user_id, job_name, messages, target_number, frequency, function(err, job_id) {
          should.not.exist(err);
          should.exist(job_id);
          done();
        });
      });
    })

    it("should return all jobs", function(done) {
      db.findAllJobs(function(err, jobs) {
        should.not.exist(err);
        should.exist(jobs);
        done(); 
      });
    })
  })

  describe('find_ready_jobs', function() {

    // 1:
    it("should find jobs which haven't been sent yet and which have waited long enough", function(done) {
      db.findPendingJobs(function(err, pending_jobs) {
        should.not.exist(err);
        should.exist(pending_jobs);
        done();
      })
    });
  })

});