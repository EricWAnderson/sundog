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

app.factory('zipCode', ['$http', function($http){
    var data = {}

    var keyPress = function(){
      if(data.input.length==5){
          $http.post('/zipCode', data).then(function(response){
            console.log(response);
          })
      }
    }

    return {
      keyPress: keyPress,
      data: data
    }
}]);
