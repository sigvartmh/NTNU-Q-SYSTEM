var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the login form');
});

router.post('/', function(req, res){
    console.log('processing');
    res.send('processing the login form!');
});

module.exports = router;
