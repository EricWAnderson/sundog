var express = require('express');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Mongo models
var User = require('../models/users');

// Routes
var index = require('./routes/index');
var zipCode = require('./routes/zipCode');
var signUp = require('./routes/signUp');
var account = require('./routes/account');

var app = express();

// MongoDB stuff
var mongoURI = 'ds059195.mongolab.com:59195/sundog';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) {
    console.log('mongodb connection error:', err);
});
MongoDB.once('open', function() {
    console.log('mongodb connection open!');
});

// Configure middleware and routes

app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('server/public'));
app.use('/account', account);
app.use('/zipCode', zipCode);
app.use('/signUp', signUp);
app.use('/', index);

// Passport

passport.serializeUser(function(user, done){
  //place ID on session so we can get user back
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  //get user object to request.user
  User.findById(id, function(err, user){
    if(err){
      done(err);
    } else {
      done(null, user); //request.user
    }
  });
});

passport.use('local', new localStrategy({passReqToCallback: true, usernameField: 'emailAddress'},
    function(req, email, password, done){

            //connect to db and check password
            User.findOne({email: email}, function(err, user){
                if(err){
                   console.log(err);
                }

                if(!user){
                    done(null, false);
                }

                user.comparePassword(password, function(err, isMatch){
                    if(err){
                       console.log(err);
                    }
                    if(isMatch){
                        done(null, user);  //success
                    } else {
                        done(null, false);  //fail
                    }
                });

            });

}));

// Initiate server

var server = app.listen(process.env.PORT || 3000, function(){
   var port = server.address().port;
   console.log('listening on port', port);
});
