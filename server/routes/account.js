var express = require('express');
var User = require('../../models/users');

var router = express.Router();

router.get('/', function(request, response){
  response.send(request.user);
});

router.get('/data', function(request, response){
  // grab User's current data and return to client
  console.log('request.user._id is ', request.user._id);
  User.find({_id: request.user._id}, function(err, userData){
    if (err) {
      console.log(err);
    } else {
      response.send(userData);
    }
  });
});

module.exports = router;
