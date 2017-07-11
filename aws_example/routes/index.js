var express = require('express');
var router = express.Router();
var aws = require('../node_modules/aws-lib/lib/aws');


/* Call aws api */
prodAdv = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');

prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(err, result) {
  awsjson = JSON.stringify(result);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'AWS API Test',
  	aws_output: awsjson
  });
});

module.exports = router;
