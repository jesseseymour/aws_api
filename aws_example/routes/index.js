var app = require('../app');
var express = require('express');
var router = express.Router();
var amazon = require('../controllers/amazonController');

/* GET home page. */
/*router.get('/', function(req, res){
	var items = amazon.listItems();
	//console.log(items);
	//res.render('index', {items: JSON.stringify(items)});
});*/
router.get('/', amazon.listItems);


/* add to cart page */
router.post('/add', amazon.addToCart);

/* get cart page */
router.get('/cart', amazon.showCart);

/* update cart page */
router.post('/update', amazon.updateCart);

/*if (req.cookies.cartId) {
  //amazon.getCart();
  res.send("has cart");
} else {
  res.cookie('cartId', 'example', {maxAge: 10000}).send("no cart");
}*/




module.exports = router;