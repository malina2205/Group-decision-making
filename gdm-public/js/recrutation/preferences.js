/**
* Controller
*/
angular.module('GDMApp').controller('PreferencesCtrl', 
  function PreferencesCtrl($scope, $location, $localStorage, $routeParams, authService, dataService) {
	'use strict';

    /*$scope.init = function(){
        authService.me()
            .success(function(jsonData){
                $scope.id = $routeParams.id;
            });
    }*/

    $scope.init = function(){
        authService.me();
        //var expertId = $routeParams.expertId;
        //var recruitmentId = $routeParams.recruitmentId;
        var prefId = $routeParams.id;
        dataService.getPreferencesById(prefId)
          .success(function(jsonData){
            console.log(jsonData);
            $scope.preferences = jsonData;

              dataService.getRecruitment(jsonData.decision)
              .success(function(jsonData, statusCode){
                  $scope.recruitment = jsonData;
                  console.log(jsonData);
                  matchPairs();
                  console.log($scope.pairs);
              });
          });     
    };


    var matchPairs = function(){
      $scope.pairs = [];
      var length = $scope.recruitment.candidates.length;
      for(var i=0; i<length; i++){
        for(var j=i+1; j<length; j++){
          var rate2;
          if ($scope.preferences !==undefined && $scope.preferences.matrix!==undefined){
            if($scope.preferences.matrix[j]!=undefined){
              rate2 = $scope.preferences.matrix[j][i];              
            }
            else{
              rate2 = 0.5;
            }
          }
          else{
            rate2 = 0.5;
          }
          var pair = {
            row: i,
            column: j,
            candidate1: $scope.recruitment.candidates[i],
            candidate2: $scope.recruitment.candidates[j],
            rate: rate2*100
          }
          $scope.pairs.push(pair);
        }
      }
    }

    var createMatrix = function(){
      var matrix = new Array();
      for (var i = 0; i < $scope.recruitment.candidates.length; i++) {
        matrix[i] = new Array();
      }
      for(var it=0; it<$scope.pairs.length; it++){
        var i = $scope.pairs[it].row;
        var j = $scope.pairs[it].column;

        var rate = $scope.pairs[it].rate;
        matrix[i][i] = 0;
        matrix[j][j] = 0;
        matrix[i][j] = (100 - rate)/100;
        matrix[j][i] = rate/100;
      }
      return matrix;
    }

    $scope.save = function(id){
      var data = {
        matrix: createMatrix(),
        status: "done"
      }
      dataService.updatePreferences($routeParams.id, data)
        .success(function(jsonData, statusCode){
          $location.path("recrutation/"+$scope.preferences.decision);
        })
        //$location.path("/decision/"+id);
    }

    $scope.back = function(){
        $location.path("recrutation/"+$scope.preferences.decision);
    }
});