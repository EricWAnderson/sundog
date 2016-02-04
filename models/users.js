var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    xcel_account: Number,
    xcel_premise: Number,
    xcel_street: String,
    xcel_city: String,
    electric_usage: Number,
    agency_signed: Boolean,
    agency_timestamp: Date,
    agency_ip: String,
    data_privacy_signed: Boolean,
    data_privacy_timestamp: Date,
    data_privacy_ip: String,
    sign_up_completed: Boolean,
    account_info_completed: Boolean,
    agency_agreement_completed: Boolean,
    data_privacy_completed: Boolean
});

UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    })
  });
});

UserSchema.methods.comparePassword = function(submittedPassword, callBack){
  bcrypt.compare(submittedPassword, this.password, function(err, isMatch){
    if(err) {
      return callBack(err);
    }
    callBack(null, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
