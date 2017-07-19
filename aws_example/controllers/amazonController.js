var amazonModel = require('../models/amazonModel');

var items = [{asin: 'B00008GKAV', quantity:2},{asin: 'B016ZPB7QE', quantity:1}]
//var items = typeof items !== 'undefined' ? items : [{asin: 'B00008GKAV', quantity:2},{asin: 'B016ZPB7QE', quantity:1}];

//Sample Pedigree ASIN's
//B00008GKAV
//B016ZPB7QE
//B0029NR4LO


exports.addToCart = function(req, res) {

	amazonModel.cartCreate(getItemsObj(items));
}
//amazonModel.cartCreate(getItemsObj(items));

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
}