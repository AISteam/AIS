var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('users', {title:'A.I.S自动化工作系统'});
});

router.get('/list',function(req,res){
	db.open(function(err,db){
		db.collection('users',function(err,collection){
			collection.find().toArray(function(err,users){
				db.close();
				console.log(users);
				res.json({
					code: 0,
					data: users
				});
			});
		});
	});
});

router.post('/add',function(req,res){
	var user = {'name':req.body['name'],'email':req.body['email'],'password':req.body['password'],'regDate':req.body['regDate']};
	db.open(function(err,db){
		db.collection('users',function(err,collection){
			collection.insert(user,{safe:true},function(err,result){
				db.close();
				if(err){
					res.json({
						code: 1,
						msg: err
					});
				}else{
					res.json({
						code: 0,
						data: result
					});
				}
			});
		});
	});
});

module.exports = router;
