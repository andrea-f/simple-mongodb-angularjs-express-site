angular.module('appModule').directive('itemDirective',function(){
return {
	replace:true,
	restrict: 'EA',
	templateUrl:'/views/results.view.html',
	scope: {
	    bikesData:'=',
	    bikes_data: '=',
	    send: '&'
	},
	controller:function($scope,$http){
		$scope.sendToParent = function(sort_by) {
			$scope.$parent.send(sort_by);
		}
		$scope.delete = function(id){
			console.log("submitted id: "+id)

			var posting = $http({
					method: 'POST',
					url: 'http://localhost:3000/api/bikes/delete/',
					data: {id:id},
					withCredentials: false,
					processData: false
			})
			posting.success(function (response) {
					if (typeof response.errors !== "undefined") {
					    $scope.add_result = response.message;
					} else {
					    $scope.$parent.add_result = "deleted bike: "+response;
					    console.log(response);
					    $scope.$parent.send();
					}
			});
			posting.error(function(err, response){
					console.log("ciao")
					$scope.add_result = "eee: "+err.message;
			})

		}
	}
};
});
