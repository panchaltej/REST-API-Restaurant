var supertest = require("supertest");
var should = require("should");
var mongodb = require('mongodb');

var server = supertest.agent("http://localhost:3001");

var restaurant_id = "5a7d17842d5f946fca8a23c8";

// Test Cases for Restaurant API
describe("Test Cases: Restaurant APIs",function(){

  it("POST should create new restaurant in restaurantdb and respond 201",function(done){

    var restaurant = {
        "name" : "McDonald's",
        "location": "San Jose",
        "cuisines": ["Snacks", "Burgers"],
        "ratings": "4",
        "phone_number": "+1-408-429-0627",
        "avg_cost": "20",
        "menus":[
            {
                "menu_type": "sandwiches",
                "menu_items": [
                    {
                        "item_name": "Veggie Burger",
                        "item_price": "9",
                        "desc": "Veg Sandwich"
                    },
                    {
                        "item_name": "Cheeseburger",
                        "item_price": "12",
                        "desc": "Sandwich"
                    }
                    
                ]
            },
            {
                "menu_type": "drinks",
                "menu_items": [
                    {
                        "item_name": "Coke",
                        "item_price": "3",
                        "desc": "Soft Drink"
                    },
                    {
                        "item_name": "Sprite",
                        "item_price": "3",
                        "desc": "Soft Drink"
                    }
                    
                ]
            }
        ]
    };

    server
    .post("/restaurants")
    .send(restaurant)
    .expect("Content-type",/json/)
    .expect(201) // THis is HTTP response
    .end(function(err,res){      
        //restaurant_id = res._id;
        res.status.should.equal(201);
        res.body.should.be.a.Object;
        done();
    });
  });


  it("GET should return restaurant's info as a JSON",function(done){
    
    server
    .get("/restaurants/" + restaurant_id)
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.be.a.Object;
      done();
    });
    
  });

  it("GET should return 404 Not Found, restaurant_id is wrong",function(done){
    
    server
    .get("/restaurants/5a7d126e6d51e7682d0cfa67")
    .expect("Content-type",/json/)
    .expect(404) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
    
  });
});


// Test Cases for Menus API
describe("Test Cases: Menu APIs",function(){

    it("POST should add new menu to restaurants' menu list and respond 201",function(done){
  
        var menu = {"menus":
        {
            "menu_type": "cookies",
            "menu_items": [
                {
                    "item_name": "Choco chips",
                    "item_price": "1",
                    "desc": "cookie"
                },
                {
                    "item_name": "almonds",
                    "item_price": "2",
                    "desc": "almond cookie"
                }
            ]
        }
    };
  
      server
      .post("/restaurants/" + restaurant_id +"/menu")
      .send(menu)
      .expect("Content-type",/json/)
      .expect(201) // THis is HTTP response
      .end(function(err,res){      
        res.status.should.equal(201);
        res.body.should.be.a.Object;
        done();
      });
    });
  
    it("GET should return menu as JSON",function(done){
      
      server
      .get("/restaurants/" + restaurant_id + "/menu/drinks")
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.should.be.a.Object;
        done();
      });
      
    });
  
    
});
  
  




// Test Cases for Menuitem APIs
describe("Test Cases: Menu Items APIs",function(){

    it("POST should add new menuitem to restaurants given menu in database and respond 201 OK",function(done){
  
    var menu_item = {
        "item_name": "Fanta",
        "item_price": "2",
        "desc": "Fanta"
    };
  
        server
        .post("/restaurants/" + restaurant_id + "/menu/drinks/menuitem")
        .send(menu_item)
        .expect("Content-type",/json/)
        .expect(201) // THis is HTTP response
        .end(function(err,res){      
        res.status.should.equal(201);
        res.body.should.be.a.Object;
        done();
    });
});

  
it("GET should return all menuitems for a menu",function(done){
    
    server
    .get("/restaurants/" + restaurant_id + "/menu/drinks/menuitem")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
    res.status.should.equal(200);
    res.body.should.be.a.Array;
    done();
    });
    
});

});


describe("Test Cases: DELETE APIs for Restaurant, Menu, MenuItem",function(){

    it("DELETE should return 200 OK, when deleting menuitem with Menuitem name",function(done){
      
        server
        .delete("/restaurants/" + restaurant_id + "/menu/cookies/menuitem/chocochip")
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);      
          done();
        });
        
      });

    it("DELETE should return 200 OK, when deleting menu with Menu name",function(done){
      
        server
        .delete("/restaurants/" + restaurant_id + "/menu/cookies")
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);      
          done();
        });
        
      });

      it("DELETE should return 200 OK, while deleting restaurant with it's id",function(done){        
        server
        .delete("/restaurants/" + restaurant_id)
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);      
          done();
        });
        
      });

  });
