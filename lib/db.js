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

var DBCleaner = require('database-cleaner');
var dbCleaner = new DBCleaner('mongodb');

var envHost = process.env['MONGO_NODE_DRIVER_HOST'],
    envPort = process.env['MONGO_NODE_DRIVER_PORT'],
    localUri = envHost != null ? envHost : 'localhost',
    localPort = envPort != null ? envPort : Connection.DEFAULT_PORT;

var host = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || localUri,
    port = localPort

var db = new Db('textarray', new Server(host, port, {}), {native_parser:false, journal:true});

module.exports = {
  find: function(name, query, limit, callback) {
    db.collection(name).find(query).sort({_id: -1}).limit(limit).toArray(callback);
  },
  findUserById: function(id, callback) {
    var name = 'users';
    var objectid = new ObjectID(id.toString());
    db.collection(name).findOne({_id: objectid}, callback);
  },
  findUserByName: function(username, callback) {
    var name = 'users';
    db.collection(name).findOne({username: username}, callback);
  },
  findOne: function(name, query, callback) {
    db.collection(name).findOne(query, callback);
  },
  findAll: function(name, callback) {
    db.collection(name).find().toArray(callback);
  },
  push: function(name, id, updateQuery, callback) {
    var objectid = new ObjectID(id.toString());
    db.collection(name).update({_id: objectid}, {$push: updateQuery}, {safe:true}, callback);
  },
  update: function(name, id, updateQuery, callback) {
    var objectid = new ObjectID(id.toString());
    db.collection(name).update({_id: objectid}, updateQuery, callback);
  },
  set: function(name, id, updateQuery, callback) {
    var objectid = new ObjectID(id.toString());
    db.collection(name).update({_id: objectid}, {$set: updateQuery}, callback);
  },
  insert: function(name, items, callback) {
    db.collection(name).insert(items, callback);
  },
  insertOne: function(name, item, callback) {
    module.exports.insert(name, item, function(err, items) {
      callback(err, items[0]);
    });
  },
  open: function(callback) {
    db.open(callback);
  },
  clear: function(callback) {
    dbCleaner.clean(db, callback);
  },
  findJobByUser: function(user_id, callback) {
    module.exports.findOne('jobs', {owner: user_id}, function(err, job) {
      if (job)
        callback(err, job);
      else
        callback(err, null);
    });
  }
}
