/**
* Controller
*/
angular.module('GDMApp').controller('LoginCtrl', function LoginCtrl($rootScope, $scope, $location, $localStorage, $http, authService) {
	'use strict';

    $scope.init = function(){
        $scope.loginFailure = false;
        //$scope.authorized();
    }

    /*/not used!
    $scope.authorized = function(){
        var user = authService.currentUserId();
        console.log("auth " + user)
        if(user != undefined){
            return true;
        }
        return false;
    }
    */



    $scope.login = function(){
    	var user = {
    		email: $scope.email,
    		password: $scope.password
    	}
    	authService.login(user).
		  success(function(jsonData, status) {
		    $location.path('/overview');
            console.log("emit - login");
            $scope.$emit('loginEvent', true);
		  }).
		  error(function(jsonData, status) {
		    $scope.loginFailure = true;
            //console.log("login failed ", jsonData.data);
            console.log("emit - logout");
            $scope.$emit('loginEvent', false);
		  });

    };
    $scope.logout = function(){
        console.log('logout');
        authService.logout(function(){
            $location.path('/login');
        });
        //$scope.logged=false;
        console.log("emit - logout");
        $scope.$emit('loginEvent', false);
    };

    $scope.register = function(){
        var user = {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password
        }

//        $http.post('/users', user)
	authService.register(user)
            .success(function(jsonData, status) {
                $scope.login();
            })
            .error(function(jsonData, status) {
                $scope.exist = true;
                console.log("register failed ", jsonData.data);
            });
    }; 
    
    $scope.gotoRegisterPage = function(){
        $location.path('/register');
    };

});


angular.module('GDMApp').controller('AppController', 
    function AppController($rootScope, $scope, $location, $localStorage, $http, authService) {
    'use strict';

    //$scope.logged=true;
    $scope.$on('loginEvent', function(event, data) {
        console.log("on ", data); 
        $rootScope.logged = data;
    });

});
