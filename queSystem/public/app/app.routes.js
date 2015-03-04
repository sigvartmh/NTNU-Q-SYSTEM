angular.module('app_routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		});
	$locationProvider.html5Mode(true);
})