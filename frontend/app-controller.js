function appController($scope, $http) {
    /*$http directive is used to communicate ot the server */
    $scope.data = {}
    //$scope.response = {}
 
    $scope.send = function () {
        console.log("inside click");
        console.log($scope.data.textdata);
         
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/',
            data: $scope.data,
            withCredentials: false,
            processData: false
        })
        posting.success(function (response) {
            console.log(response);
            $scope.bikes_data = response.bikes
        });
    }
};