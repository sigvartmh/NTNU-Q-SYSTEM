var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('I am dashboard!');
});

router.get('/users', function(req,res){
   res.send("I show all the users!"); 
});

router.param('name', function(req, res, next, name){
    console.log("doing name validation on " + name);
    req.name = name;
    next();
});

router.get('/users/:name', function(req, res){
    res.send("Hello " + req.params.name + '!')
});

module.exports = router;
