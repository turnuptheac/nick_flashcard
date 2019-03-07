DEV = {
	VERSION: 'v20190302.4'
};

var origin = window.origin ? window.origin : window.location.origin;

if (origin.indexOf('//localhost:') !== -1 || origin.indexOf('192.168.1.') !== -1) {
	REST_URL = 'http://localhost:8555/api';
} else {
	REST_URL = 'http://shortform-demo-api.zenimus.com/api';
}
console.log('REST_URL: ', REST_URL);

angular.module('app', [
		'ui.router',
		'ui.bootstrap',
		'ngAnimate'
	])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
		.state('root', {
			abstract: true,
			templateUrl: 'views/root.html',
			controller: 'RootCtrl'
		})
		.state('root.play', {
			url: '/',
			templateUrl: 'views/play.html',
			controller: 'PlayCtrl'
		})
		.state('root.settings', {
			url: '/settings',
			templateUrl: 'views/settings.html',
			controller: 'SettingsCtrl'
		})
		;

	$urlRouterProvider.otherwise('/settings');

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: true
	});
}])

.run(['$rootScope', '$transitions', '$state', function($rootScope, $transitions, $state) {
	$rootScope.VERSION = DEV.VERSION;
}]);



