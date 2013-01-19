'use strict';

var assert = require ('assert'),
    db = require('../lib/db'),
    should = require('should'),
    our_library = require('../lib/arylib')

var userData = {};

describe('database', function() {
  var insertedJob;
  var username = 'cameron';

  describe('open', function() {
    it('should open a database connection', function(done) {
      db.open(done);
    });
  });

  describe('insertOne', function() {
    it('should insert an object to its collection', function(done) {
      var job = {username: username,
                time_started: new Date(),
                time_modified: new Date(),
                target_number: 6193585266,
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
});



//   test('getUser should return a user according to our name query', function(done) {
//     arylib.getUser(test_username, function(err, user) {
//       should.not.exist(err);
//       should.exist(user);
//       user.username.should.eql(test_username);
//       done();
//     });
//   });

//   test('getUserById should return a user according to our id query', function(done) {
//     arylib.getUserById(test_user_id, function(err, user) {
//       should.not.exist(err);
//       user._id.should.eql(test_user_id);
//       done();
//     });
//   });
// });
// });