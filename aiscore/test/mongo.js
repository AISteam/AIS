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
			//assert.equal(null,err);
			console.log('更新数据的回调返回');
			console.log(result);
		});

		//查询数据
		collection.find().toArray(function(err,docs){
			console.log('find方法查找返回');
			console.log(docs);
			for(var index in docs){
				console.log('姓名为：'+docs[index]['name']);
			}
		});

		//查询并返回一个结果
		collection.findOne(function(err,doc){
			assert.equal(null,err);
			console.log('findOne方法查找返回');
			console.log(doc);
		});

		//有条件的查询
		collection.find({'name':'ericqin','password':'admin'}).toArray(function(err,user){
			console.log('查找用户名为ericqin，密码为admin的用户是否存在');
			console.log(user);
		});

		//按条件查询并返回一个结果
		collection.findOne({'id':1}, function(err, result) {
			//assert.equal(null,err);
			console.log('findOne有条件查询');
			console.log(result);
		});

		//删除数据
		collection.remove({'id':1},{safe:true},function(err,result){
			//assert.equal(null,err);
			console.log('删除数据结果返回');
			console.log(result);
		});

		collection.remove({'id':2},{safe:true},function(err,result){
			assert.equal(null,err);
			console.log('删除数据结果返回');
			console.log(result);
			db.close();
		});
	});
});