var aws = require('../node_modules/aws-lib/lib/aws');
var awsapi = aws.createProdAdvClient('AKIAIINBSKK365ZUFIKA', 'PrMDVoocsdXAmKbjIzWIoMbkDPHFPhbz6cZ7FyJK', 'catapulttest-20');

//Sample Pedigree ASIN's
//B00008GKAV
//B016ZPB7QE
//B0029NR4LO

function Amazon() {
	this.itemsArr = [];
}

//call api to get one item by ASIN
Amazon.prototype.getItems = function(items, cb) {
	awsapi.call("ItemLookup", {ItemId: items, ResponseGroup: 'Small, Images'}, function(err, result) {
		cb.call(result);
	}.bind(this));
}

//create cart
Amazon.prototype.createCart = function(asin, quantity, cb) {
	quantity = quantity || 1;
	awsapi.call("CartCreate",
	{
		'Item.1.ASIN': asin,
		'Item.1.Quantity': quantity
	},
	function(err, result){
		cb.call(result);
	})
}

//get cart
Amazon.prototype.getCart = function(id, hmac, cb) {
	awsapi.call("CartGet", {CartId: id, HMAC: hmac}, function(err, result) {
		cb.call(result);
	})
}

//add to cart
Amazon.prototype.cartAdd = function(asin, quantity, id, hmac, cb) {
	quantity = quantity || 1;
	awsapi.call("CartAdd", 
		{
			'Item.1.ASIN': asin, 
			'Item.1.Quantity': quantity,
			AssociateTag: 'catapulttest-20', 
			CartId: id,
			HMAC: hmac
		},
		function(err, result){
			cb.call(result);
		})
}

//modify cart
Amazon.prototype.modifyCart = function(cartId, cartHmac, itemId, quantity, cb) {
	awsapi.call("CartModify", 
		{
			CartId: cartId,
			HMAC: cartHmac,
			'Item.1.CartItemId': itemId,
			'Item.1.Quantity': quantity
			},
			function(err, result){
				cb();
			})
}

module.exports = Amazon;