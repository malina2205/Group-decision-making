/**
* Controller
*/
angular.module('GDMApp').controller('DecisionCtrl', 
  function DecisionCtrl($scope, $location, $routeParams, authService, dataService) {
	'use strict';

    $scope.init = function(){
        authService.me();
        var recruitmentId = $routeParams.id;
        $scope.decisions = {};
        $scope.decisions.winners = [];
        $scope.compromise;
        //$scope.decisionResponse;
        dataService.getRecruitment(recruitmentId)
          .success(function(jsonData){
            //$scope.preferences = jsonData;
            $scope.recruitment = jsonData;
          });
        dataService.getDecision(recruitmentId)
          .success(function(jsonData){
            //$scope.preferences = jsonData;
            console.log(jsonData)
            $scope.decisionResponse = jsonData;
            var decisionsPositions = jsonData.decisions;
            var listLength = decisionsPositions.length;
            if(listLength==1){
              $scope.compromise = true;
            }
            else{
              $scope.compromise = false;
            }
            for(var i=0; i<listLength; i++){
              var index = decisionsPositions[i];
              $scope.decisions.winners.push($scope.recruitment.candidates[index]);
            }
            $scope.decisions.rhasz = jsonData.Rhasz;
            
          });

        
    };

    $scope.back = function(){
      $location.path("/recrutation/"+$routeParams.id);
    }

    function loadChart(){
      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});
     
      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table, 
      // instantiates the pie chart, passes in the data and
      // draws it.
    }
      function drawChart() {

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      console.log("-======================-",$scope.decisionResponse)
      data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
      ]);

      // Set chart options
      var options = {'title':'How Much Pizza I Ate Last Night',
                     'width':400,
                     'height':300};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

});