var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.post('/', function(req, res, next) {
	var user = {'name':req.body['email'],'password':req.body['password']};
	db.open(function(err,db){
		db.collection('users',function(err,collection){
			collection.findOne(user, function(err, result) {
				db.close();
				if(result){
					res.render('index', {title:'A.I.S自动化工作系统'});
				}else{
					res.render('login',{errorMsg:'账号或密码错误，请重新登录'});
				}
			});
		});
	});
});

module.exports = router;
