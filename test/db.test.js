'use strict';

var assert = require ('assert'),
    db = require('../lib/db'),
    should = require('should'),
    our_library = require('../lib/arylib')

var userData = {};

suite('database:', function() {
  var insertedUser;
  var insertedJob;
  var insertedArray;

  test('open should a db connection', function(done) {
    db.open(done);
  });

  test('insertOne should insert an object to its collection', function(done) {
    var user = generate_some_user
    db.insertOne('users', user, function(error, user) {
      should.not.exist(error);
      should.exist(user._id);
      insertedUser = user;
      done();
    });
  });

  test('findOne should find an object from its collection', function(done) {
    var id = insertedUser._id;
    db.findOne('users', id, function(error, user) {
      should.not.exist(error);
      should.exist(user._id);
      user.some_attribute.should.eql(insertedUser.some_attribute);
      user.some_attribute2.should.eql(insertedUser.some_attribute2);
      done();
    });
  });
});