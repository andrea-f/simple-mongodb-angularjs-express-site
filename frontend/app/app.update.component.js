angular.module('appModule').directive('updateDirective', function() {
	return {
		replace:true,
		restrict: 'EA',
		templateUrl:'/views/update.view.html',
		scope: {
			bike: '=',
			submitForm: '&'
		},
		controller: function($scope, $http) {
			console.log("In updateDirective....")
			$scope.data = {};
			$scope.data.name = $scope.bike.name;
			$scope.data.description = $scope.bike.description;
			$scope.data.class = $scope.bike.class.join();
			$scope.data.image = $scope.bike.image.large;
			
			$scope.submitParentForm = function() {
				console.log("In nested directive")
				console.log($scope.data)
				$scope.$parent.submitParentForm($scope.data)
			}
			
		}
	};
});
