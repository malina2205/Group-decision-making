angular.module('GDMApp').factory('authService', function authFactory ($rootScope, $http, $location, $localStorage) {
    'use strict';
    //var exports = {};
    var currentUser = {};

    function changeUser(user) {
        //angular.extend(currentUser, user);
        currentUser = user;
        //console.log("***",currentUser,typeof(currentUser),currentUser.id, typeof(currentUser.id))
    }


    //exports.me();
    var url2 = "http://localhost:5000"
    var url = "https://gdm-api.herokuapp.com"
    return {
        register: function (data) {
            return $http.post(url+'/users', data);
        },
    
        login: function (data) {
        return $http.post(url+ '/authorization', data)
            .success(function(jsonData, statusCode){
                console.log('Request was successful!', statusCode);
                $localStorage.token = jsonData.token;
                $localStorage.id = jsonData.user._id;
                changeUser({id: jsonData.user._id});
            })
            .error(function(jsonData, statusCode){
                $location.path('login');
                console.log('There was an error!', statusCode);
            });
        },

        logout: function(success) {
            changeUser({});
            delete $localStorage.token;
            delete $localStorage.id;
            success();
        },

        me:function() {
        return $http.get(url+'/api/users/'+$localStorage.id)
            .success(function(jsonData, statusCode){
                console.log('Request was successful!', statusCode);
             //   changeUser({id: jsonData._id});
             //   $rootScope.$emit('loginEvent', true);
                $rootScope.logged = true;
                console.log("rootscope logged", $rootScope.logged)
            })
            .error(function(jsonData, statusCode){
                $location.path('login');
               // $rootScope.$emit('loginEvent', false);
                $rootScope.logged = false;
                console.log('There was an error!', statusCode);
            });
        },

        getCurrentUser: function() {
            console.log("authService: getCurrentUser", currentUser, currentUser.id, typeof(currentUser.id))
            return $localStorage.id;
        }
    }
});
