var app = angular.module('sunDog', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
          templateUrl: 'views/landing.html',
          controller: 'landingPage'
      })
      .when('/signup', {
          templateUrl: 'views/signup.html',
          controller: 'signup'
      })
      .when('/account', {
          templateUrl: 'views/account.html',
          controller: 'account'
      });

    $locationProvider.html5Mode(true);
}]);

app.controller('landingPage', ['$scope', 'zipCode', function($scope, zipCode){
    $scope.zipCodeKeyPress = zipCode.keyPress;
    $scope.zipCode = zipCode.data;
}]);

app.controller('signup', ['$scope', function($scope){}]);
app.controller('account', ['$scope', function($scope){}]);

app.factory('zipCode', ['$http', '$location', function($http, $location){
    var data = {};

    var keyPress = function(){
      if(data.input.length==5){
          $http.post('/zipCode', data).then(function(response){
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
