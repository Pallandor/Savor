var restaurantController = require('./../db/controllers');
var Uber = require('node-uber')
var uberConfig = require( __dirname + '/../config.js').api.uber;
var uber = new Uber(uberConfig); 

module.exports = {

    loginUber: function(req,res){
        var login_url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
        debugger; 
        res.redirect(login_url);
    },

    finalizeUberAuthorization: function(req, res) {
        // current uber session stores access token for subsequent requests
        uber.authorization({
            authorization_code: req.query.code
        }, function(err, access_token, refresh_token) {
            if (err) {
                console.error(err);
            } else {
                // use access token as a flag for now. 
                // res.redirect('https://savor-it-staging.herokuapp.com/#/?accessToken=' + access_token); 
                res.redirect('http://localhost:4000/#/?accessToken=' + access_token); 
            }
        });
    },

    getUberProducts: function(request,response){
        // should ordinarily use accessToken sent from user. But will cheat for now
        // and use uber lib's stored access token. 
        uber.products.getAllForLocation(request.body.latitude, request.body.longitude, function(err, res) {
            if (err) {
                console.error(err);
                response.send('Error in getUberProducts handler @ /api/uberproducts'); 
            } else {
                response.json(res);
            }
        });
    },

    // getUberETA: function(req,res,next){
    //     uber.estimates.getETAForLocation(request.body.latitude, request.body.longitude, function (err, res) {
    //       if (err) console.error(err);
    //       else console.log(res);
    //     });
    // },

    orderUberRide: function(request,response,next){
        uber.requests.create({
          "product_id": request.body.product_id,
          "start_latitude": request.body.start_latitude,
          "start_longitude": request.body.start_longitude,
          "end_latitude": requqest.body.end_latitude,
          "end_longitude": request.body.end_longitude
        }, function (err, res) {
          if (err) console.error(err);
          else console.log(res);
        });
    },


    //function not being used
    getRestaurantsByUser: function(req, res) {
        var id = req.params.id;
        restaurantController.fetchAllById(id, function(restaurant) {
            res.status(200).json(restaurant);
        });
    },

    getRestaurants: function(req, res) {
        restaurantController.fetchAll(function(restaurants) {
            res.status(200).json(restaurants);
        });
    },
    //function not being used
    getOneRestaurant: function(req, res) {
        var id = req.params.id;
        restaurantController.fetchOne(id, function(restaurant) {
            res.status(200).json(restaurant);
        });
    },

    addRestaurant: function(req, res) {
        console.log("req.body: ", req.body);
        var restaurant = req.body;
        restaurantController.addRestaurantReview(restaurant, function(newRestaurant) {
            res.status(201).json(newRestaurant);
        });
    },
    //function not being used
    updateRestaurantInfo: function(req, res) {
        var id = req.params.id;
        var newProperties = req.body;
        restaurantController.updateOne(id, newProperties, function(updatedRestaurant) {
            res.status(200).json(updatedRestaurant);
        });
    },
    //function not being used
    deleteRestaurant: function(req, res) {
        var id = req.params.id;
        restaurantController.deleteOne(id, function(deleted) {
            res.status(200).json(deleted);
        });
    },
    queryRestaurant: function(req, res) {
      var data = req.body;
      restaurantController.queryRestaurant(data, function(list) {
        res.status(200).json(list);
      });
    }
};
