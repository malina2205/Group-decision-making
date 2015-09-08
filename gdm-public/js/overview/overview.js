/**
* Controller: OverviewCtrl
*/
angular.module('GDMApp').controller('OverviewCtrl', 
  function OverviewCtrl($scope, $location, $http, $localStorage, authService, dataService) {
	'use strict';

    $scope.init = function(){
        authService.me()
          .success(function(data, code){
            $scope.me = data;
          });
        //var user = authService.getCurrentUser();
          if($localStorage.id){
            var id = $localStorage.id;
            dataService.getRecruitments(id)
              .success(function(jsonData, statusCode){
                  $scope.recruitments = jsonData;
                  console.log("pobrane: ", $scope.recruitments);
                  console.log(jsonData.data)
                  
              })
              .error(function(jsonData, statusCode){
                  if(statusCode===403){
                    $location.path('/login');
                  }
                  $scope.recruitments = [];
              });
        }
        else{
          $location.path('/login');
        }
    };

    $scope.newDecision = function(){
        $location.path('/addDecision');
    };

    $scope.remove = function (elem) {
        //dataService.removeRecruitment(elem._id);
        dataService.getRecruitment(elem._id)
          .success(function(recruitment, statusCode){
            var array = recruitment.experts;
            for(var i=0; i<array.length; i++){
              if(array[i]._id==$scope.me._id){
                var ex = array.splice(i, 1);
              }
            }
            if(array.length > 0 ){
              var data = {experts: array}
              dataService.updateRecruitment(recruitment._id, data)
                .success(function(){
                  console.log("aaaaaaaaaaaaaaaaaaa",ex);
                    afterRemoving(ex[0].preferences)
                    //$scope.init();
                });
            }
            else{
              dataService.removeRecruitment(elem._id)
              .success(function(){
                    $scope.init();
                });
            }
          })
    };

    var afterRemoving = function(prefId){
      dataService.removePreferences(prefId);
      $scope.init();
    }

});
