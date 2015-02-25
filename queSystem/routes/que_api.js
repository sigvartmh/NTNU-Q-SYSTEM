var express = require('express');
var jwt = require('jsonwebtoken');
var Que = require('../models/que');

var router = express.Router();
var tokenSecret = 'iloveyou';

/* Authenticate. */
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

router.route('/')
    .post(function(req, res){
        console.log(req.decoded.username);

        var que = new Que();

        que.message = req.body.message;
        que.date = new Date();
        que.location = req.body.location;
        que._owner = req.decoded.username; //TODO: maybe use objectId?

        que.save(function(err) {
            if (err){
                //check duplicate
                if(err.code == 11000){
                    return  res.json({
                                success:false, 
                                message: 'A Que item with that username allready exist'
                            });
                }
                else
                    return res.send(err);
            }

            res.json({ message: "Request added to the que!" });
        });
    })
    .get(function(req, res){
        Que.find({})
            .sort({'date': 'asc'})
            .exec(function(err, que){
                if(err) res.send(err);
                res.json(que);
        });
    })
    //FIX ME: Maybe do deletion and put with req.params.que_id.
    .put(function(req, res){
        Que.find({_owner : req.decoded.username},function(err, queId){
            Que.findById(queId[0]._id, function(err, que){ //TODO: Check if it can be done differently
                if(err) res.send(err);
                if(req.body.message) que.message = req.body.message;
                if(req.body.location) que.location = req.body.location;

                que.save(function(err){
                    if(err) res.send(err);
                    res.json({ message: 'Que info updated!' });
                });
            });
        });
    })
    .delete(function(req, res){
        Que.remove({
            _owner: req.decoded.username
        }, function(err, que_item) {
            if(err) res.send(err);
            if(que_item != 0){
                res.json({
                    success: true,
                    message: 'Successfully deleted',
                    deleted: que_item
                });
            }else{
                res.json({
                    success: false,
                    message: 'Nothing deleted',
                    deleted: que_item
                });
            }
        });
    });

module.exports = router;