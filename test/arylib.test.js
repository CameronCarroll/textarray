'use strict'

var assert = require('assert'),
    should = require('should'),
    db = require('../lib/db'),
    arylib = require('../lib/arylib')


suite('textarray library:', function() {

  var username = 'cameron',
      email = 'test@mail.com',
      password = 'testpassword'

  setup(function() {
    // Setup/teardown function also serves to test createUser! How convenient.
    arylib.createUser(username, email, password, function(error, user) {
    });
  });

  teardown(function() {
    db.clean_database
  });

  test('authenticate should return a user id if correct, otherwise null', function() {
    arylib.authenticate(username, password, function(error, user_id) {
      should.not.exist(error);
      should.exist(user_id);
      done();
    });
  });
});