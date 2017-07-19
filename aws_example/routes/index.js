var app = require('../app');
var express = require('express');
var router = express.Router();
var amazon = require('../controllers/amazonController');

/* GET home page. */
router.get('/', function(req, res){
	amazon.addToCart();
	res.send("hello world")
});




module.exports = router;