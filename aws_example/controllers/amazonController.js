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

//display list of items in cart
exports.showCart = function(req, res) {
	var cartId = req.cookies.cartId;
	var cartHmac = req.cookies.cartHmac;

	//check for valid cart
	var cart = doesCartExist(cartId, cartHmac, function(){
		if (this == 'True') {
			aws.getCart(cartId, cartHmac, function() {

				//return one item or list of items
				if (Object.prototype.toString.call(this.Cart.CartItems.CartItem) === '[object Array]') {
					res.render('cart', {items: this.Cart.CartItems.CartItem, link: this.Cart.PurchaseURL})
				} else {
					res.render('cart', {item: this.Cart.CartItems.CartItem, link: this.Cart.PurchaseURL})
				}

				
			})
		} else {
			res.render('cart', {msg: "Your shopping cart is empty."});
		}
	})
	//res.send("cart page");
}

//update cart
exports.updateCart = function(req, res) {
	var cartId = req.cookies.cartId;
	var cartHmac = req.cookies.cartHmac;
	var itemId = req.body.cartitemid;
	var quantity = req.body.quantity;


	//check for valid cart
	var cart = doesCartExist(cartId, cartHmac, function(){
		if (this == 'True') {
			aws.modifyCart(cartId, cartHmac, itemId, quantity, function() {
				res.redirect('/cart');
			})
		} else {
			res.redirect('/');
		}
	})
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