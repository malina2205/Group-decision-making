 "use strict";

/*We need to manually start angular as we need to
wait for the google charting libs to be ready  
google.setOnLoadCallback(function () {  
    angular.bootstrap(document.body, ['GDMApp']);
});
google.load('visualization', '1', {packages: ['corechart']});


*/

angular.module('GDMApp', ['ngRoute','ui.bootstrap','ngStorage', 'ngSanitize', 'ngWig', 'google-chart']).config(['$routeProvider', function ( $routeProvider) {
	'use strict';
	// configure urls
	$routeProvider
	// inbox route
	.when('/overview', {
		templateUrl: 'js/overview/overview.html',
		controller: 'OverviewCtrl' // map js to html scope
	})
    .when('/addDecision', {
		templateUrl: 'js/recrutation/add.html',
		controller: 'AddRecrutationCtrl' // map js to html scope
	})
    .when('/recrutation/:id', {
		templateUrl: 'js/recrutation/preview.html',
		controller: 'RecruitmentCtrl' // map js to html scope
	})
	.when('/login', {
		templateUrl: 'js/user/login.html',
		controller: 'LoginCtrl', // map js to html scope
	})
   .when('/register', {
		templateUrl: 'js/user/register.html',
		controller: 'LoginCtrl',
	})
    .when('/userprefs/:id', {
		templateUrl: 'js/recrutation/preferences.html',
		controller: 'PreferencesCtrl', 
	})
	.when('/decision/:id', {
		templateUrl: 'js/recrutation/decision.html',
		controller: 'DecisionCtrl' // map js to html scope
	})
	.when('/edit/:id', {
		templateUrl: 'js/recrutation/add.html',
		controller: 'AddRecrutationCtrl' // map js to html scope
	})
	/*.when('/view/:param', {
		templateUrl: 'src/preview/preview.html',
		controller: 'PreviewCtrl', 
	})
	.when('/config', {
		templateUrl: 'src/configuration/configuration.html',
		controller: 'ConfigurationCtrl', 
	})*/
	.otherwise({ // default
		redirectTo: '/overview'
	});
}]);

angular.module('GDMApp').config(['$httpProvider', function($httpProvider) {


    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    	
                return {
                    'request': function (config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.authorization = $localStorage.token;
                        	console.log("TOKEN ", config.headers.authorization)
                            
                        }
                        return config;
                    },
                    'responseError': function(response) {
                        if(response.status === 401 || response.status === 403) {
                            //$location.path('/login');
                        }
                        return $q.reject(response);
                    }
                };
            }]);
}]);
