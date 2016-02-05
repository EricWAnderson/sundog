var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/account', failureRedirect: '/failure'
}));

module.exports = router;
