var express = require('express');
var router = express.Router();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/restaurantdb";
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var Redis = require('redis');
var RedisClient = Redis.createClient();

//============RESTAURANTS=======================
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

router.get('/:restaurant_id', function (req, res, next) {
    var restaurantId = req.params.restaurant_id;
    var redisKey = "Restaurant#" + restaurantId;
    try {
            RedisClient.get(redisKey, function(err, redisResponse) {
            // reply is null when the key is missing 
            console.log(redisResponse);
            if(!err && redisResponse){
                res.status(200).send(JSON.parse(redisResponse));
            }
            else{
            mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurantQuery = {'_id': new mongodb.ObjectID(restaurantId)};
            coll.find(restaurantQuery).toArray(function(err, result){
                
                if (result){
                    var size = result.length;
                    if(size>0){
                        console.log('Restaurant fetched');
                        res.status(200).send(result);
                    }
                    else{
                        console.log('Failed to fetch Restaurant');
                        res.status(404).send(result);
                    }
                }
                else{
                    console.log('Failed to fetch Restaurant');
                    res.status(404).send(result);
                }
                
                });
            });
        }
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

//====================MENUS=======================
router.post('/:restaurant_id/menu', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;
        console.log(req.body);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurant = {'_id': new mongodb.ObjectID(restaurantId)};
            var menuItem = {$push:req.body};

            coll.update(restaurant, menuItem, function(err, result) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Menu Added');
                    res.status(201).json(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});

router.get('/:restaurant_id/menu', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;

        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurant = {'_id': new mongodb.ObjectID(restaurantId)};
            var menuItems = { 'menus': 1, '_id':0 };

            coll.find(restaurant, menuItems).toArray(function(err, result){
                if (result){
                    console.log('Menus fetched');
                    res.status(200).send(result);
                }
                else{
                    console.log('Failed to fetch menus');
                    res.status(400).send(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});

router.get('/:restaurant_id/menu/:menutype', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;
        menu_type = (req.params.menutype).toLowerCase();
        console.log(menu_type);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurant = {'_id': new mongodb.ObjectID(restaurantId)};
            var type = { 'menus': { $elemMatch: { 'menu_type': menu_type } } }
            // var type = {};
            var menuItems = { 'menus': 1, '_id':0 };

            coll.find(restaurant, type, menuItems).toArray(function(err, result){
                if (result){
                    var size = result.length;
                    if(size>0){
                        console.log('Menus fetched');
                        res.status(200).send(result);
                    }
                    else{
                        console.log('Failed to fetch menus');
                        res.status(400).send(result);
                    }
                }
                else{
                    console.log('Failed to fetch menus');
                    res.status(400).send(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});


router.delete('/:restaurant_id/menu/:menutype', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;
        menuType = (req.params.menutype).toLowerCase();
        console.log(menuType);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            coll.update({'_id': new mongodb.ObjectID(restaurantId)},{$pull:{'menus':{'menu_type':menuType}}}, function(err, result){
                if(err){
                    console.log(err);
                    res.status(400).send(result);
                }
                else {
                    console.log('Menu Deleted');
                    res.status(200).send(result);

                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});


//====================MENUITEMS=======================
router.post('/:restaurant_id/menu/:menutype/menuitem', function (req, res, next) {
    try {
        var restaurantId = req.params.restaurant_id;
        var menu_type = req.params.menutype;
        console.log(req.body);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurant = {'_id': new mongodb.ObjectID(restaurantId), 'menus': { $elemMatch: { 'menu_type': menu_type } }};
            // var type = { 'menus': { $elemMatch: { 'menu_type': menu_type } } }
            var menuItem = req.body;

            coll.update(restaurant,{$push:{'menus.$.menu_items':menuItem}}, function(err, result){
                if(err){
                    console.log(err);
                    res.status(400).send(result);
                }
                else {
                    console.log('MenuItem Added');
                    res.status(201).send(result);

                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});

router.get('/:restaurant_id/menu/:menutype/menuitem', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;
        menu_type = (req.params.menutype).toLowerCase();
        console.log(menu_type);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            var restaurant = {'_id': new mongodb.ObjectID(restaurantId)};
            var type = { 'menus': { $elemMatch: { 'menu_type': menu_type } } }
            // var type = {};
            var menuItems = { 'menus': 1, '_id':0 };

            coll.find(restaurant, type, menuItems).toArray(function(err, result){
                if (result){
                    console.log('MenuItems fetched');
                    var size = result.length;
                    var response = result[0].menus[0].menu_items
                    if(size>0){
                        res.status(200).send(response);
                    }
                    else{
                        res.status(200).send(result);
                    }
                }
                else{
                    console.log('Failed to fetch menu items');
                    res.status(400).send(result);
                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});


router.delete('/:restaurant_id/menu/:menutype/menuitem/:itemname', function (req, res, next) {
    try {
        restaurantId = req.params.restaurant_id;
        menu_type = (req.params.menutype).toLowerCase();
        item_name = (req.params.itemname).toLowerCase();
        console.log(restaurantId + " " + menu_type + " " + item_name);
        console.log(menu_type);
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('restaurants');
            coll.update({'_id': new mongodb.ObjectID(restaurantId), 'menus.menu_type':menu_type},{$pull:{'menus.$.menu_items':{'item_name':item_name}}}, function(err, result){
                if(err){
                    console.log(err);
                    res.status(400).send(result);
                }
                else {
                    console.log('Menuitem Deleted');
                    res.status(200).send(result);

                }
            });
        });
    }
    catch (e){
        console.log(e);
    }
});


module.exports = router;