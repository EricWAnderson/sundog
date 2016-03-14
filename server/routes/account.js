var express = require('express');
var User = require('../../models/users');

var router = express.Router();

router.get('/', function(request, response){
  response.send(request.user);
});

router.get('/data', function(request, response){
  // grab User's current data and return to client
  User.findById(request.user._id, function(err, userData){
    if (err) {
      console.log(err);
    } else {
      response.send(userData);
    }
  });
});

router.put('/update', function(request, response){
  User.findById(request.user._id, function(err, userData){
    if (err) {
      console.log(err);
    } else {
      //prepare new userData to save
      userData.email = request.body.user.email;
      userData.first_name = request.body.user.first_name;
      userData.last_name = request.body.user.last_name;
      userData.xcel_account = request.body.user.xcel_account;
      userData.xcel_city = request.body.user.xcel_city;
      userData.xcel_street = request.body.user.xcel_street;
      userData.xcel_premise = request.body.user.xcel_premise;
      userData.electric_usage = request.body.user.electric_usage;

      //save new userData
      userData.save(function(err){
        if (err) {
          console.log(err);
        } else {
          response.send(userData);
        }
      });
    }
  });
});

module.exports = router;
