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

router.post('/agency', function(request, response){
    console.log('hit the agency post! request.body._id is ', request.body._id);
    User.findById(request.body._id, function(err, userToUpdate){
      if(err) console.log(err);
      userToUpdate.agency_signed = request.body.agencyAgreed;
      userToUpdate.agency_timestamp = new Date().toString();
      userToUpdate.agency_ip = request.ip;

      //update agency agreement boolean if all info received
      if (userToUpdate.agency_signed && userToUpdate.agency_timestamp && userToUpdate.agency_ip){
        userToUpdate.agency_agreement_completed = true;
      }

      userToUpdate.save(function(err){
        if (err) {
          console.log(err);
        } else {
          console.log('hurray the agency stuff posted to MONGOD');
        }
      });
    })
});

router.post('/data', function(request, response){
    console.log('hit the data post! request.body._id is ', request.body._id);
    User.findById(request.body._id, function(err, userToUpdate){
      if(err) console.log(err);
      userToUpdate.data_privacy_signed = request.body.dataAgreed;
      userToUpdate.data_privacy_timestamp = new Date().toString();
      userToUpdate.data_privacy_ip = request.ip;

      //update agency agreement boolean if all info received
      if (userToUpdate.data_privacy_signed && userToUpdate.data_privacy_timestamp && userToUpdate.data_privacy_ip){
        userToUpdate.data_privacy_completed = true;
      }

      userToUpdate.save(function(err){
        if (err) {
          console.log(err);
        } else {
          console.log('hurray the data stuff posted to MONGOD');
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
