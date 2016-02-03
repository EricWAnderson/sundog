var express = require('express');
var request = require('request');
var router = express.Router();

router.post('/', function(req, res){
    var zipCode = req.body.input;
    var api = 'https://api.data.gov/nrel/utility_rates/v3.json?address=' + zipCode + '&api_key=K5GXLvLHFExMVcEk99Hz6n1Ts9RtsoYgRY9rpMb2';

    request(api, function(error, response, body){
      if (!error && response.statusCode == 200){
        var utility = JSON.parse(body);
        res.send(utility.outputs.utility_name);
      }
    })
});

module.exports = router;
