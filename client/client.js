var app = angular.module('sunDog', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
          templateUrl: 'views/landing.html',
          controller: 'landingPage'
      })
      .when('/signup', {
          templateUrl: 'views/signup.html',
          controller: 'signup',
          controllerAs: 'signup'
      })
      .when('/account', {
          templateUrl: 'views/account.html',
          controller: 'account'
      });

    $locationProvider.html5Mode(true);
}]);

app.controller('landingPage', ['$scope', 'zipCodeService', function($scope, zipCodeService){
    $scope.zipCodeKeyPress = zipCodeService.keyPress;
    $scope.zipCode = zipCodeService.data;
}]);

app.controller('signup', ['signUpService', function(signUpService){
    this.data = signUpService.data;
    this.signUp = signUpService.signUp;
    this.next = signUpService.next;
    this.agencyAgreement = signUpService.agencyAgreement;
    this.dataPrivacyAgreement = signUpService.dataPrivacyAgreement;

}]);

app.controller('account', ['$scope', function($scope){}]);

app.factory('zipCodeService', ['$http', '$location', function($http, $location){
    var data = {};

    var keyPress = function(){
      if(data.input.length==5){

          //send zip code to server, get utility name back
          $http.post('/zipCode', data).then(function(response){
            //make response available to controllers
            data.response = true;  //so client knows whether response received
            data.utility = response.data.name; //utility associated with client zip code
            data.isNSP = response.data.isNSP; //boolean whether client is NSP or not

            //if utility is NSP, send user to sign up form
            if(data.isNSP) $location.path('/signup');

          })
      }
    }
    return {
      keyPress: keyPress,
      data: data
    }
}]);

app.factory('signUpService', ['$http', '$location', function($http, $location){
    var data = {
      //set status indicators of which step in sign up form is completed
      signUpCompleted: false,
      nextCompleted: false,
      agencyAgreementCompleted: false,
      dataAgreementCompleted: false
    };

    var signUp = function(){
      data.signUpError = '';
      console.log('email address is', data.emailAddress);
      
      if(validatePassword(data.password) && validateEmail(data.emailAddress)){
        data.signUpCompleted = true;
        console.log('signed up!');
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

    var next = function(){
      data.nextCompleted = true;
      console.log('next!');
    }

    var agencyAgreement = function(){
      data.agencyAgreementCompleted = true;
      console.log('signed agency!');
    }

    var dataPrivacyAgreement = function(){
      data.dataAgreementCompleted = true;
      console.log('signed data privacy!');
    }

    return {
      signUp: signUp,
      next: next,
      agencyAgreement: agencyAgreement,
      dataPrivacyAgreement: dataPrivacyAgreement,
      data: data
    }
}]);

var validatePassword = function(password){
  if(password.length >= 7){
    return true;
  } else {
    return false;
  }
}

var validateEmail = function(email) {
    var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(emailformat)){
      return true;
    } else {
      return false;
    }
}
