var Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	assert = require('assert');

var db = new Db('ais',new Server('127.0.0.1',27017));
//连接数据库
db.open(function(err,db){
	assert.equal(null,err);
	console.log('数据库已连接成功！');

	db.createCollection('ais',{safe:true},function(err,collection){
		assert.equal(null,err);

		//添加用户
		var user1 = {'id':1,'name':'ericqin','password':'ericqin','depart':'fd'};
		var user2 = {'id':2,'name':'chixiang','password':'chixiang','depart':'fd'};
		collection.insert([user1,user2],{safe:true},function(err,result){
			assert.equal(null,err);
			console.log('插入数据的回调返回');
			console.log(result);
		});

		//更新数据
		collection.update({'id':1},{$set:{'password':'admin','depart':'ad'}},{safe:true},function(err,result){
			assert.equal(null,err);
			console.log('更新数据的回调返回');
			console.log(result);
		});

		//查询数据
		collection.find().toArray(function(err,docs){
			console.log('find方法查找返回');
			console.log(docs);
		});

		collection.findOne(function(err,doc){
			console.log('findOne方法查找返回');
			console.log(doc);
		});

		//删除数据
		collection.remove({'id':1},{safe:true},function(err,result){
			assert.equal(null,err);
			console.log('删除数据结果返回');
			console.log(result);
		});

		collection.remove({'id':2},{safe:true},function(err,result){
			assert.equal(null,err);
			console.log('删除数据结果返回');
			console.log(result);
		});
	});
});