/**
* Controller
*/
angular.module('GDMApp').controller('RecruitmentCtrl', 
  function RecruitmentCtrl($scope, $location, $routeParams, $localStorage, authService, dataService) {
	'use strict';
$scope.myHTML =
     'I am an <code>HTML</code>string with ' +
     '<a href="#">links!</a> and other <em>stuff</em>';
    $scope.init = function(){
        $scope.preferences = [];
        $scope.recruitment = [];
        $scope.myid = $localStorage.id;
        var myid = $localStorage.id;
        var recruitmentId = $routeParams.id; 
        dataService.getRecruitment(recruitmentId)
          .success(function(jsonData, statusCode){
              $scope.recruitment = jsonData;
              console.log(jsonData);
          })
          .error(function(jsonData, statusCode){
              if(statusCode===403){
                $location.path('/login');
              }
              $scope.recruitment = {};
          });

          dataService.getRecruitmentPreferences(recruitmentId)
            .success(function(preferences){
                $scope.preferences = preferences;
            });
    };
   
    $scope.gotoPreferences = function(id){
        //var recruitmentId = $routeParams.id;
        //$location.search({expertId: id, recruitmentId: recruitmentId}).path('/userprefs');
        console.log(id);
        $location.path('/userprefs/'+id);
    };

    $scope.getPreferencesStatus = function(expert){
        var result;
        for(var i=0; i<$scope.preferences.length; i++){
          var pref = $scope.preferences[i];
          if(pref.expert == expert._id){
              return pref.status;
            }
        }
        return result;
    };

    $scope.checkDecision = function(){
      $location.path('/decision/'+$routeParams.id);
    }

    $scope.edit= function(){
      $location.path('/edit/'+$routeParams.id);
    }

/*
    $scope.getExpertStatus = function(expert){
         var expertId = expert._id;
         var result;
         var lolFunction = function(pref){
            if(pref.expert == expertId){
              result = pref.status;
            }
         }
         $scope.recruitment.preferences.forEach(lolFunction);
         return result;
    };
    */
});