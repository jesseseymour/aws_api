var aws = require('../node_modules/aws-lib/lib/aws');
var awsapi = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');

//Sample Pedigree ASIN's
//B00008GKAV
//B016ZPB7QE
//B0029NR4LO

//create cart with items array

exports.cartCreate = function(items, cb) {
	awsapi.call("CartCreate", items, function(err, result) {
		
	})
}

