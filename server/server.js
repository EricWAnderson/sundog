var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Routes
var index = require('./routes/index');
var zipCode = require('./routes/zipCode');
var signUp = require('./routes/signUp');

var app = express();

// MongoDB stuff
var mongoURI = 'mongodb://localhost:27017/sundog_users';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) {
    console.log('mongodb connection error:', err);
});
MongoDB.once('open', function() {
    console.log('mongodb connection open!');
});

// Configure middleware and routes
app.use(bodyParser.json());
app.use(express.static('server/public'));
app.use('/zipCode', zipCode);
app.use('/signUp', signUp);
app.use('/', index);

var server = app.listen(3000, function(){
   var port = server.address().port;
   console.log('listening on port', port);
});
