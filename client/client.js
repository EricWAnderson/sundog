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

app.controller('landingPage', ['$scope', 'zipCodeChecker', function($scope, $location, zipCodeChecker){
    $scope.zipCodeKeyPress = zipCodeChecker.zipCodeKeyPress;
}]);

app.controller('signup', ['$scope', function($scope){}]);
app.controller('account', ['$scope', function($scope){}]);

app.factory('zipCodeChecker', ['$http', function($http){
    var data = {}
    var counter = 0;

    var zipCodeKeyPress = function(){
      counter++;
      console.log(counter);
    }

    return {
      zipCodeKeyPress: zipCodeKeyPress,
      data: data
    }
}]);
