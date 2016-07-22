var app = angular.module('myApp', ['ui.router']);

app.factory('AuthService', [function() {
    debugger;
    return {
        isAuthenticated: false,
        username: ''
    };
}]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "views/home.html",
            controller: "HomeCtrl",
            authenticate: true
        })
        .state("login", {
            url: "/login",
            templateUrl: "views/login.html",
            controller: "LoginCtrl",
            authenticate: false
        })
        .state("home.grids", {
            url: "/grids",
            templateUrl: "views/partial/par-grids.html",
            controller: "HomeCtrl",
            authenticate: true
        })
        .state("home.profile", {
            url: "/profile",
            templateUrl: "views/partial/par-profile.html",
            controller: "HomeCtrl",
            authenticate: true
        })
        /*.state("home.logout", {
            url: "/login",
            templateUrl: "views/login.html",
            controller: "LoginCtrl",
            authenticate: false
        })*/;
        // Send to login if the URL was not found
        $urlRouterProvider.otherwise("/login");
}]);

app.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        debugger;
        if (toState.authenticate && !AuthService.isAuthenticated){
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault(); 
        }
    });
  });

app.controller('LoginCtrl', function($scope, $http, $location, $state, AuthService) {
    $scope.formUserData = {};

    // when submitting the add form, send the text to the node API
    $scope.loginUser = function() {
        $http.post('/api/login', $scope.formUserData)
            .success(function(data) {
                debugger;
                var resp = data;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
                AuthService.isAuthenticated = true;
                $state.go('home');
            })
            .error(function(data) {
                debugger;
                console.log('Error: ' + data);
                AuthService.isAuthenticated = false;
                $state.go('login');
            });
    };
});

app.controller('HomeCtrl', function($scope, $http, $location, $state, AuthService) {
    $scope.logout = function() {
        AuthService.isAuthenticated = false;
        $state.go('login');
    }
});