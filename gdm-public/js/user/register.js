/**
* Controller
*/
//NOT USED
angular.module('GDMApp').controller('RegisterCtrl', function RegisterCtrl($scope, $location, $localStorage, $http) {
	'use strict';
    $scope.exist = false;
    console.log("REGISTER Controller");
    $scope.register = function(){
        var user = {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password
        }
        console.log("REGISTER Controller");
        $http.post('/users', user)
            .success(function(jsonData, status) {
                $location.path('/overview');
               // console.log("+++",jsonData.data.token);
                $localStorage.token = jsonData.data.token;
            })
            .error(function(jsonData, status) {
            	$scope.exist = true;
                console.log("register failed ", jsonData.data);
            });
    }; 
});