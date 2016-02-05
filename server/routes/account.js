var express = require('express');

var router = express.Router();

router.get('/', function(request, response){
  console.log(request.user);
  response.send(request.user);
});

module.exports = router;
