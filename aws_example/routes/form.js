var express = require('express');
var router = express.Router();
var aws = require('../node_modules/aws-lib/lib/aws');


/* Call aws api */
/*prodAdv = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');

prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(err, result) {
  awsjson = JSON.stringify(result);
})*/

/* GET form page. */
router.get('/', function(req, res, next) {
  // res.render('index', { 
  // 	title: 'AWS API Test',
  // 	aws_output: awsjson
  // });
  res.render('form')
});

router.post('/', function(req, res, next) {
	searchStr = req.body.search;
	prodAdv = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');
	prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: searchStr}, function(err, result) {
	  console.log(JSON.stringify(result, null, 2))
	})
});

module.exports = router;
