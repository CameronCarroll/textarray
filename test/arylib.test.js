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

  beforeEach(function(done) {
    db.clear(function() {
      arylib.createUser(username, email, password, function(err, user) {
        // console.log(" ");
        // console.log("(BeforeEach) Generated User: --");
        // console.log(user);
        // console.log(" ");
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

})