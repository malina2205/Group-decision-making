/**
* Controller
*/
angular.module('GDMApp')
    .controller('AddRecrutationCtrl', 
        function AddRecrutationCtrl($scope, $location, $routeParams, $modal, authService, dataService) {
        'use strict';



    $scope.init = function(){
        $scope.edit = false;
        authService.me()
            .success(function(jsonData){
                $scope.recruitmentId = $routeParams.id; 
                if($scope.recruitmentId != undefined){
                    $scope.edit = true;
                    dataService.getRecruitment($scope.recruitmentId)
                        .success(function(json){
                            $scope.recruitment = json;
                        })
                        .error(function(json){
                            $location.path("/overview");
                        })
                }
                else{
                    $scope.recruitment = {
                        title: "",
                        description: "",
                        date: new Date(),
                        experts: [],
                        candidates: [],
                        status: "open"
                    }

                    $scope.preferences = [];
                    $scope.me = jsonData;
                    addNewExpert($scope.me);
                }
            });

    }

    var addNewExpert = function(expert){
        $scope.recruitment.experts.push(expert);
        console.log("experts:", $scope.recruitment.experts)
    }


    $scope.remove = function (array, elem) {
        var index = array.indexOf(elem);
        if (index > -1) {
          array.splice(index, 1);
        }
    }

    $scope.addRecruitment = function(){
        var recruitment = $scope.recruitment;
        if($scope.edit){
            dataService.updateRecruitment($scope.recruitmentId, recruitment)
                .success(function(jsonData, status){
                    console.log(recruitment)
                    $location.path("/preview/"+$scope.recruitmentId);
                })
                .error(function(jsonData, status) {
                    //$scope.loginFailure = true;
                    console.log("adding failed ", jsonData.data);
                });
        }
        else{
            console.log(recruitment);
            dataService.addRecruitment(recruitment).
                success(function(jsonData, status) {
                    //$localStorage.token = jsonData.data.token;
                    var recruitmentId = jsonData._id;

                    jsonData.experts.forEach(function(expert){
                        var expertId = expert._id;
                        var newPreferences = {
                                recruitment: recruitmentId,
                                expert: expertId,
                                status: "empty",
                                preferences: []
                            }
                        console.log(newPreferences);
                        console.log("type", typeof(newPreferences.expert), typeof(newPreferences.recruitment))
                        //dataService.addPreferences(newPreferences);
                    });

                    $location.path("/overview");
                }).
                error(function(jsonData, status) {
                    //$scope.loginFailure = true;
                    console.log("adding failed ", jsonData.data);
                });
        }
    }

    $scope.cancel = function (){
        $location.path("/overview");
    }

    $scope.addExpert = function (expert) {
        var modalInstance = $modal.open({
            templateUrl: 'js/recrutation/expertModal.html',
            controller: 'ModalExpertCtrl',
            resolve: {
                index: function () {
                    return $scope.recruitment.experts.indexOf(expert);
                },
                expert: function () {
                    return expert;
                }
            }
        });

        modalInstance.result.then(function (args) {
            $scope.recruitment.status = "open";
            var index = args[0];
            var expert = args[1];
            if(index<0){
                addNewExpert(expert);                
            }
            else{
                $scope.recruitment.experts[index] = expert;
            }
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });
  };
    
    $scope.editCandidate = function (candidate) {
        var modalInstance = $modal.open({
            templateUrl: 'js/recrutation/candidateModal.html',
            controller: 'ModalCandidateCtrl',
            resolve: {
                index: function () {
                    return $scope.recruitment.candidates.indexOf(candidate);
                },
                candidate: function () {
                    return candidate;
            }
            }
        });

        modalInstance.result.then(function (args) {
            $scope.recruitment.status = "open";
            var index = args[0];
            var candidate = args[1];
            if(index<0){
                $scope.recruitment.candidates.push(candidate);                
            }
            else{
                $scope.candidates[index] = candidate;
            }
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });
  };

    $scope.editExpert = function (expert) {
        if(expert._id == $scope.me._id){
            return null;
        }
        var modalInstance = $modal.open({
            templateUrl: 'js/recrutation/expertModal.html',
            controller: 'ModalExpertCtrl',
            resolve: {
                index: function () {
                    return $scope.recruitment.experts.indexOf(expert);
                },
                expert: function () {
                    return expert;
                }
            }
        });

        modalInstance.result.then(function (args) {
            console.log("zmienia");
            var index = args[0];
            var expert = args[1];
            if(index<0){
                $scope.expert.push(expert);                
            }
            else{
                $scope.recruitment.experts[index] = expert;
            }
        }, function () {
           console.log('Modal dismissed at: ' + new Date());
        });
  };
});


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
angular.module('GDMApp').controller('ModalCandidateCtrl', function ($scope, $modalInstance, index, candidate) {
    $scope.index = index;
    $scope.candidate = candidate;
    $scope.ok = function () { 
      $modalInstance.close([$scope.index, $scope.candidate]);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('GDMApp').controller('ModalExpertCtrl', function ($scope, $modalInstance, dataService, index, expert) {
    $scope.index = index;
    $scope.newexpert = expert;
    $scope.notFound = false;

    $scope.ok = function () { 
      console.log("modal: " ,$scope.newexpert.email);
      dataService.getUserByEmail($scope.newexpert.email)
        .success(function(jsonData){
            $scope.newexpert = jsonData[0];
            $modalInstance.close([$scope.index, $scope.newexpert]);
        })
        .error(function(){
            $scope.notFound = true;
        })

      //$modalInstance.close([$scope.index, $scope.expert]);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
