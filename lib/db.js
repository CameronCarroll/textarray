// TextArray SMS Reminder Application
// File: db.js --- Created: January 2013
// Author: Cameron Carroll
// Purpose: "Database" library file; Provides a DAL and helper methods.
// Contains: Database connection logic; DB helper methods.

'use strict';

var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID;
var mongo = require('mongodb').MongoClient;

var DBCleaner = require('database-cleaner');
var dbCleaner = new DBCleaner('mongodb');

var envHost = process.env['MONGO_NODE_DRIVER_HOST'],
    envPort = process.env['MONGO_NODE_DRIVER_PORT'],
    localUri = envHost != null ? envHost : 'localhost',
    localPort = envPort != null ? envPort : Connection.DEFAULT_PORT;

var host, mongostr;
var port = localPort
var dbname = 'textarray'

if (process.env.MONGOLAB_URI) {
  mongostr = process.env.MONGOLAB_URI;
}
else {
  host = localUri;
  mongostr = 'mongodb://' + host + ':' + port + '/' + dbname;
}



console.log('mongostr: ') + mongostr;
console.log(localUri);
console.log(process.env.MONGOLAB_URI);

module.exports = {
  find: function(name, query, limit, callback) {
    module.exports.open(function(err, db) {
      db.collection(name).find(query).sort({_id: -1}).limit(limit).toArray(callback);
    });
  },
  findUserById: function(id, callback) {
    module.exports.open(function(err, db) {
      var name = 'users';
      var objectid = new ObjectID(id.toString());
      db.collection(name).findOne({_id: objectid}, callback);
    });
  },
  findUserByName: function(username, callback) {
    
    module.exports.open(function(err, db) {
      var name = 'users';
      db.collection(name).findOne({username: username}, callback);
    });
  },
  findOne: function(name, query, callback) {
    module.exports.open(function(err, db) {
      db.collection(name).findOne(query, callback);
    });
  },
  findAll: function(name, callback) {
    module.exports.open(function(err, db) {
      db.collection(name).find().toArray(callback);
    });
  },
  push: function(name, id, updateQuery, callback) {
    module.exports.open(function(err, db) {
      var objectid = new ObjectID(id.toString());
      db.collection(name).update({_id: objectid}, {$push: updateQuery}, {safe:true}, callback);
    });
  },
  // this motherfucker overwrites everything! must supply ALL KEYS AND DATA!
  update: function(name, id, updateQuery, callback) {
    module.exports.open(function(err, db) {
      var objectid = new ObjectID(id.toString());
      db.collection(name).update({_id: objectid}, updateQuery, callback);
    });
    
  },
  // callback(err, success)
  set: function(name, id, updateQuery, callback) {
    module.exports.open(function(err, db) {
      var objectid = new ObjectID(id.toString());
      db.collection(name).update({_id: objectid}, {$set: updateQuery}, callback);
    });
  },
  insert: function(name, items, callback) {
    module.exports.open(function(err, db) {
      db.collection(name).insert(items, callback);
    });
  },
  insertOne: function(name, item, callback) {
    module.exports.insert(name, item, function(err, items) {
      if (items) {
        callback(err, items[0]);
      }
      else {
        callback(err, null);
        console.log('(insertOne) Error: ' + err);
      }
    });
  },
  open: function(callback) {
    mongo.connect(mongostr, {}, function(err, db) {
      if (db)
        callback(err, db);
      else
        throw err;
    });
  },
  clear: function(callback) {
    module.exports.open(function(err, db) {
      dbCleaner.clean(db, callback);
    }); 
  },
  findJobByUser: function(user_id, callback) {
    module.exports.findOne('jobs', {owner: user_id}, function(err, job) {
      if (job)
        callback(err, job);
      else
        callback(err, null);
    });
  },
  findAllJobs: function(callback) {
    module.exports.open(function(err, db) {
      db.collection('jobs').find(function(err, jobs) {
        jobs.toArray(function(err, jobs) {
          callback(err, jobs);
        });
      });
    }); 
  },
  findPendingJobs: function(callback) {
    var jobs_pending = new Array();
    module.exports.findAllJobs(function(err, jobs) {
      if (jobs) {
        jobs.forEach(function(job) {
          if (job.last_sms_time && !job.pending) {
            var waitTimeInSeconds = job.frequency * 3600;
            var now = new Date();
            var timeWaited = now - job.last_sms_time;
            if (timeWaited > waitTimeInSeconds) {
              jobs_pending.push(job);
            }
            else {
              // job isn't ready
            }
          }
          else if (!job.pending) { // first message of project, automatically pending unless already added
            jobs_pending.push(job);
          }
        });
      }
      else {
        // do nothing
      }
      

      if (jobs_pending.length > 0)
        callback(err, jobs_pending);
      else
        callback(err, null);
    })
  }
}
