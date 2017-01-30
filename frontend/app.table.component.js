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
		};
		$scope.submitParentForm = function(data) {
				console.log("Modified data:  ")
				console.log(data)
				$scope.$parent.submitForm('update', data);
		};

		$scope.delete = function(id){
			console.log("submitted id: "+id)
			result_box = angular.element( document.querySelector( '#result_box' ) );
			var posting = $http({
					method: 'POST',
					url: 'http://localhost:3000/api/bikes/delete/',
					data: {id:id},
					withCredentials: false,
					processData: false
			})
			posting.success(function (response) {
					if (typeof response.errors !== "undefined") {
					    result_box.html( response.message );
					} else {
					    result_box.html(response.response);
					    result_box.addClass('alert alert-danger');
					    console.log(response);
					    $scope.$parent.send();
					}
			});
			posting.error(function(err, response){
					$scope.add_result = "eee: "+err.message;
			})

		}
	}
};
});
