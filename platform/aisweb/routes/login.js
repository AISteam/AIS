var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'A.I.S自动化工作系统平台' });
});

module.exports = router;
