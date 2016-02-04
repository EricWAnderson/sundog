var express = require('express');
var router = express.Router();

var User = require('../../models/users');

router.post('/register', function(request, response){
    console.log('hit the register! request.body is ', request.body);
    User.create({
      email: request.body.emailAddress,
      password: request.body.password
    }, function(err, post){
      if(err) {
        next(err);
      } else {
        response.send(post);
      }
    });
});

router.post('/account', function(request, response){
    console.log('hit the account post! request.body._id is ', request.body._id);
    User.findById(request.body._id, function(err, userToUpdate){
      if(err) console.log(err);
      userToUpdate.first_name = request.body.firstName;
      userToUpdate.last_name = request.body.lastName;
      userToUpdate.xcel_account = request.body.xcelAccountNumber;
      userToUpdate.xcel_premise = request.body.xcelPremiseNumber;
      userToUpdate.xcel_street = request.body.xcelServiceAddress;
      userToUpdate.xcel_city = request.body.xcelCity;
      userToUpdate.electric_usage = request.body.electricUsage;

      userToUpdate.save(function(err){
        if (err) {
          console.log(err);
        } else {
          console.log('hurray the stuff posted to MONGOD');
        }
      });
    })
});

router.post('/agencyAgreement', function(request, response){
    console.log('hit the agency agreement post! request.body is ', request.body);
});

router.post('/dataAgreement', function(request, response){
    console.log('hit the data agreement post! request.body is ', request.body);
});

module.exports = router;
