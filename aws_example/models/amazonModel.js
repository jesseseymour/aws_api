var aws = require('../node_modules/aws-lib/lib/aws');
var awsapi = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');

//create cart with items array
exports.cartCreate = function(items) {
	awsapi.call("CartCreate", items, function(err, result) {
	  if (err) {
	  	return res.status(404).json(err);
	  }
	  res.json(result);
	})
}

