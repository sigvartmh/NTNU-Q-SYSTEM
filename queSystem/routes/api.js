var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.use(function(req, res, next){
    console.log("somebody came to our app!");
    next();
});

router.get('/', function(req, res, next) {
  res.render('api', { title: 'API overview' });
});

router.get('/test', function(req, res){
  res.json({ message: 'Welcome to the Que API!' });
});

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
