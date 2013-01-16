'use strict'

var assert = require('assert'),
    should = require('should'),
    db = require('../lib/db'),
    arylib = require('../lib/arylib');

var username = 'cameron',
    email = 'test@mail.com',
    password = 'testpass';

describe('TextArray Library: ', function() {
  describe('create_user: ', function() {

    // Seed database:
    beforeEach(function(done) {
      db.clear(function() {
        console.log('Cleared database...');
        arylib.createUser(username, email, password, function() {
          console.log('Created user... ');
        });
      });
    })

    // 1:
    it("should save a user object to database", function() {
      console.log("test 1");
    })

    // 2:
    it("should return a user_id if saved successfully", function() {
      console.log("test 2");
    })
  })
})


// suite('textarray library:', function() {

//   var test_username = 'cameron',
//       test_email = 'test@mail.com',
//       test_password = 'testpassword',
//       test_user_id = null;



//   suite('authenticate()', function() {

//     suiteSetup(function() {
//       db.clean_database(function() {
//         arylib.createUser(test_username, test_email, test_password, function(err, user) {
//           console.log(user);
//         });
//       });
//     });

//     suiteTeardown(function() {
//       db.clean_database(function() {
//         console.log('Cleared database for teardown!');
//       });
//     });

//     test('authenticate should return a user id if correct, otherwise null', function(done) {
//       db.findAll('users', function(err, users) {
//         console.log('Found users:');
//         console.log(users);    
//       });
//       arylib.authenticate(test_username, test_password, function(err, user_id) {
//         should.not.exist(err);
//         should.exist(user_id);
//         test_user_id = user_id;
//         done();
//       });
//     });
//   });

  

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