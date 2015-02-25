var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var router = express.Router();

var tokenSecret = 'iloveyou';

router.post('/authenticate', function(req, res){
    console.log("test");
    console.log(req.body);
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user){
        if(err) throw err;
        if(!user){
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if(user){
            var validPassword = user.isValidPassword(req.body.password);
            if(!validPassword){
                res.json({
                    success: false,
                    message: 'Authenticate failed. Wrong username or password.'
                });
            } else {
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                },
                tokenSecret, {
                    expiresInMinutes: 1440 //Expires in 24 hours(maybe this should be set in config?)
                });

                res.json({
                    success: true,
                    message: 'Here is your token! Enjoy the Que',
                    token: token
                });
            }
        }
    });
});

/* GET home page. */
router.use(function(req, res, next){

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, tokenSecret, function(err, decoded){
            if(err){
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.get('/', function(req, res, next) {
  res.render('api', { title: 'API overview' });
});

router.get('/test', function(req, res){
  res.json({ message: 'Welcome to the Que API!' });
});

router.get('/me', function(req, res){
    res.send(req.decoded);
})

router.route('/users')
    .post(function(req, res){
        var user = new User();

        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        
        user.save(function(err) {
            if (err){
                //duplicate
                if(err.code == 11000)
                    return  res.json({ 
                                success:false, 
                                message: 'A user with that username allready exist'
                            });
                else
                    return res.send(err);
            }

            res.json({ message: "User created!" });
            console.log("User created");
        });
    })

    .get(function(req, res){
        User.find(function(err, users){
                if(err) res.send(err);
                res.json(users);
        });
    });

router.route('/users/:user_id')
    .get(function(req,res){
        console.log(req.params.user_id);
        User.findById(req.params.user_id, function(err, user){
            if (err) res.send(err);
            res.json(user)
        });
    })
    .put(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if(err) res.send(err);
            if(req.body.name) user.name = req.body.name;
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.password = req.body.password;

            user.save(function(err){
                if(err) res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })
    .delete(function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if(err) res.send(err);
            res.json({ message: 'Successfully deleted'});
        });
    });

module.exports = router;
