var Amazon = require('../models/amazonModel');
var app = require('../app');
var crypto = require('crypto');
var aws = new Amazon();

var items = [{asin: 'B00008GKAV', quantity:2},{asin: 'B016ZPB7QE', quantity:1}]
//var items = typeof items !== 'undefined' ? items : [{asin: 'B00008GKAV', quantity:2},{asin: 'B016ZPB7QE', quantity:1}];

//Sample Pedigree ASIN's
//B00008GKAV
//B016ZPB7QE
//B0029NR4LO


//test cart id
// 146-3900379-4362452

//test cart hmac
// wpBn6pIUbX0Xr2/j8Rr2Ae0aKBY=





// exports.getCart = function(req, res) {
// 	if (req.cookie.cartId) {
// 		res.send("has cart");
// 	} else {
// 		res.send("no cart");
// 	}
// 	res.send("has cart");
// }


//list items for sale
exports.listItems = function(req, res) {
	//example items list
	var items = 'B00008GKAV,B0029NR4LO';
	
	var awsItems = aws.getItems(items, function(){
		res.render('index', {items: this.Items.Item});
	});
};

//add item to cart
//create cart if one does not exist
exports.addToCart = function(req, res) {
	var asin = req.body.asin;
	var cartId = req.cookies.cartId;
	var cartHmac = req.cookies.cartHmac;
	var cart = doesCartExist(cartId, cartHmac, function(){
		if (this == 'True') {
			//cart exists and is valid. Modify cart with new items
			aws.cartAdd(asin, 1, cartId, cartHmac, function(){
				//clear and reset cart cookies with 7 day expiration
				res.clearCookie('cartHmac');
				res.clearCookie('cartId');
				res.cookie('cartHmac', cartHmac, {maxAge: 1000 * 60 * 60 * 24 * 7});
				res.cookie('cartId', cartId, {maxAge: 1000 * 60 * 60 * 24 * 7});
				res.redirect('/cart');
			});
		} else {
			//cart does not exist or is invalid. Create new cart and add items
			aws.createCart(asin, 1, function(){
				//clear and reset cart cookies with 7 day expiration
				res.clearCookie('cartHmac');
				res.clearCookie('cartId');
				res.cookie('cartHmac', this.Cart.HMAC, {maxAge: 1000 * 60 * 60 * 24 * 7});
				res.cookie('cartId', this.Cart.CartId, {maxAge: 1000 * 60 * 60 * 24 * 7});
				res.redirect('/cart');
			})
		}
	});
}

//check if cart exists using user cookies and is valid
var doesCartExist = function(id,hmac,cb) {
	var cart = aws.getCart(id, hmac, function(){
		if(!('Errors' in this.Cart.Request) && this.Cart.Request.IsValid == "True"){
			//cart is valid and exists
			cb.call('True');
		} else {
			//cart is invalid or does not exist
			cb.call('False');
		}
	});
}

exports.showCart = function(req, res) {
	res.send("cart page");
}

function getItemsObj(items){
	var obj = {};
	for (var i in items) {
		var item = items[i];
		i++;
		var asinStr = "Item." + i + ".ASIN";
		obj[asinStr] = item.asin;
		var quantityStr = "Item." + i + ".Quantity";
		obj[quantityStr] = item.quantity;
	}
	return obj;
};