var app = angular.module('sunDog', ['ngRoute', 'socialLinks']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
          templateUrl: 'views/landing.html',
          controller: 'landingPage',
          controllerAs: 'land'
      })
      .when('/signup', {
          templateUrl: 'views/signup.html',
          controller: 'signup',
          controllerAs: 'signup'
      })
      .when('/account', {
          templateUrl: 'views/account.html',
          controller: 'account',
          controllerAs: 'account'
      });

    $locationProvider.html5Mode(true);
}]);

app.controller('landingPage', ['zipCodeService', 'signUpService', '$http', '$location', function(zipCodeService, signUpService, $http, $location){
    this.zipCodeKeyPress = zipCodeService.keyPress;
    this.zipCode = zipCodeService.data;
    this.showLogin = function(){
      this.loginStatus = true;
    };
    // this.user = {};
    this.loginFail = false;

    //checks login credentials and redirects to /account if authenticated
    this.login = function(){
      $http.post('/', this.user).then(function(response){
        if(response.data._id){
          $location.path('/account');
        } else {
          alert(response.data);
        }
      })
    };

    this.reserveSpot = signUpService.reserveSpot;

}]);

//makes signUpService functionality/data available on page
app.controller('signup', ['signUpService', function(signUpService){
    this.data = signUpService.data;
    this.signUp = signUpService.signUp;
    this.next = signUpService.next;
    this.agencyAgreement = signUpService.agencyAgreement;
    this.dataPrivacyAgreement = signUpService.dataPrivacyAgreement;
}]);

//makes accountService functionality/data availalbe on page, and retrieves User
app.controller('account', ['accountService', function(accountService){
    this.data = accountService.data;
    this.save = accountService.save;
    this.logout = accountService.logout;
    this.savedStatus = accountService.savedStatus;
    accountService.getUser();

    //initiate initial state of account form
    this.emailShow = true;
    this.passwordShow = true;
    this.firstNameShow = true;
    this.lastNameShow = true;
    this.accountShow = true;
    this.premiseShow = true;
    this.streetShow = true;
    this.cityShow = true;
    this.usageShow = true;

}]);

//after 5 numbers entered, checks zip code vs API, returns utility
app.factory('zipCodeService', ['$http', '$location', function($http, $location){
    var data = {};

    var keyPress = function(){
      if(data.input.length==5){
          data.showSpinner = true;

          //send zip code to server, get utility name back
          $http.post('/zipCode', data).then(function(response){
            //make response available to controllers
            data.showSpinner = false;
            data.response = true;  //so client knows whether response received
            data.utility = response.data.name; //utility associated with client zip code
            data.isNSP = response.data.isNSP; //boolean whether client is NSP or not

          })
      }
    }
    return {
      keyPress: keyPress,
      data: data
    }
}]);

//provides get user and update user functionality
app.factory('accountService', ['$http', '$location', function($http, $location){
    var data = {};

    data.status = 'Please edit any information below as needed';

    var getUser = function(){
      $http.get('/account/data').then(function(response){
          data.user = response.data[0];
      })
    };

    var save = function(){
      $http.put('account/update', data).then(function(response){
        if(response.status == 200){
          data._id = response.data._id;
          data.savedStatus = 'changes saved successfully!';
        }
      })
    }

    var logout = function(){
      $http.get('/logout').then(function(response){
        $location.path('/');
      })
    }

    return {
      save: save,
      logout: logout,
      getUser: getUser,
      data: data
    }
}])

//captures sign up information and posts to database
app.factory('signUpService', ['$http', '$location', function($http, $location){
    var data = {
      status: 'Join Sun Dog and sign up for solar today!',
      //set status indicators of which step in sign up form is completed
      signUpCompleted: false,
      nextCompleted: false,
      agencyAgreementCompleted: false,
      dataAgreementCompleted: false
    };

    var reserveSpot = function(){
        if(validateEmail(this.user.emailAddress)){
          //register to server
          $http.post('signUp/register', this.user).then(function(response){
            if(response.status == 200){
              data.emailAddress = response.data.email;
              data._id = response.data._id;
              $location.path('/signup');
            }
          })
        } else {
            console.log('email invalid');
        }
    };

    //called on step 1 button click
    var signUp = function(){
      data.signUpError = '';
      
      if(validatePassword(data.password) && validateEmail(data.emailAddress)){
        data.signUpCompleted = true;

        //register to server
        $http.post('signUp/addPassword', data).then(function(response){
          if(response.status == 200){
            data._id = response.data._id;
            data.status = 'Registration successful';
          }
        })

      } else {
        if(!validatePassword(data.password)){
          data.signUpError = 'Password invalid. ';
        }
        if(!validateEmail(data.emailAddress)){
          data.signUpError += 'Email invalid.';
        }
        console.log('nope');
      }

    }

    //called on step 2 button click
    var next = function(){
      //send data to server
      $http.post('/signUp/account', data).then(function(response){
        if(response.status == 200){
          data.status = 'You\'re all set';
        }
      })

      data.nextCompleted = true;  //used to reset the view
    }

    //called on step 3 button click
    var agencyAgreement = function(){
      if(data.agencyAgreed){
        $http.post('/signUp/agency', data).then(function(response){
          if(response.status == 200){
            data.status = 'You\'re all set';
          }
        })

        //initialize next step in view
        data.agencyAgreementCompleted = true;
        data.status = 'Data Privacy Agreement';
      } else {
        data.status = 'Please check the box to continue';
      }
    }

    //called on step 4 button click
    var dataPrivacyAgreement = function(){
      if(data.dataAgreed) {
        $http.post('/signUp/data', data).then(function(response){
          if(response.status == 200){
            data.status = 'You\'re all set';
          }
        })
        //initialize next step in view
        data.dataAgreementCompleted = true;
        data.status = 'arf arf!';

      } else {
        data.status = 'Please check the box to continue';
      }
    }

    return {
      reserveSpot: reserveSpot,
      signUp: signUp,
      next: next,
      agencyAgreement: agencyAgreement,
      dataPrivacyAgreement: dataPrivacyAgreement,
      data: data
    }
}]);

//checks whether password meets parameters
var validatePassword = function(password){
  if(password.length >= 7){
    return true;
  } else {
    return false;
  }
}

//checks whether email matches xyz@xyz.com format
var validateEmail = function(email) {
    var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(emailformat)){
      return true;
    } else {
      return false;
    }
}
