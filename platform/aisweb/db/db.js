var Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	assert = require('assert');

var db = new Db('ais',new Server('10.6.212.230',27017));
module.exports = db;