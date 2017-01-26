var appModule = angular.module('appModule', [])
appModule.controller('appController', function($scope, $http) {


 $scope.send = function () {
        console.log("inside click");
        $scope.bikes_data = {};
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/',
            //data: $scope.data,
            withCredentials: false,
            processData: false
        })
        posting.success(function (response) {
            console.log(response);
            $scope.bikes_data = response.bikes
        });
    }

 $scope.data = {};
 $scope.submitForm = function () {
        console.log("in submit form");
        $scope.bikes_data = {};
        $scope.add_result = {};
        //console.log($scope.data.name)
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/add/',
            data: $scope.data,
            withCredentials: false,
            processData: false
        })
        posting.success(function (response) {
            console.log(response);
            if (typeof response.errors !== "undefined") {
                $scope.add_result = response.message;
            } else {
                $scope.add_result = "passed!";
            }
        });
        posting.error(function(err, response){
            console.log("ciao")
            $scope.add_result = "eee: "+err.message;
        })
    }
});

/*appModule.directive("addBikeForm", function() {
    return {
        template : "<h1>Made by a directive!</h1>"
    };
});*/



