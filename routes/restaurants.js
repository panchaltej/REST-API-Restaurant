var express = require('express');
var router = express.Router();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/restaurantdb";
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;


router.post('/', function (req, res, next) {
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var document = req.body;
            coll.insert(document, function(err, result) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Restaurant Added');
                    res.status(201).json(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});

router.get('/', function (req, res, next) {
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            coll.find().toArray(function(err, result){
                if (result){
                        console.log('Restaurants fetched');
                        res.status(200).send(result);
                    }
                });
        });
    }
    catch (e){
        console.log(e);
    }
});

router.delete('/:restaurant_id', function (req, res, next) {
    try {
        var restaurantId = req.params.restaurant_id;
        console.log(restaurantId);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');

            var removeQuery = {'_id': new mongodb.ObjectID(restaurantId)};
            console.log(removeQuery);
            coll.deleteOne(removeQuery, function(err, result) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Restaurant Removed');
                    res.status(200).json(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});




module.exports = router;