angular.module('user_service', [])
	.factory('User', function($http){
		var user_factory = {};
		
		userFactory.get = function(id){
			return $http.get('/api/users/' + id);
		};

		userFactory.all = function() {
			return $http.get('/api/users');
		};

		userFactory.create = function(user_data){
			return $http.post('/api/users/' + id, user_data);
		};

		userFactory.delete = function(id) {
			return $http.delete('/api/users/' + id);
		};

		return user_factory;
	});