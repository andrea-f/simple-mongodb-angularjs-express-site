var appModule = angular.module('appModule', []);

appModule.controller('appController', function($scope, $http) {

    $scope.send = function (sort_by) {
        console.log("inside click");
        var sort;
        $scope.bikes_data = {};
        $scope.show_table = false;
        (typeof sort_by === 'undefined') ? sort = {} : sort = {"sort_by": sort_by};
        console.log(sort)
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/',
            data: sort,
            withCredentials: false,
            processData: false
        })
        posting.success(function (response) {
            console.log(response);
            $scope.show_table = true;
            $scope.bikes_data = response.bikes;
        });
    }

    $scope.data = {};

    $scope.submitForm = function () {
        $scope.bikes_data = {};
        $scope.add_result = {};
        var user_obj = normaliseInput($scope.data),
            result_box = angular.element( document.querySelector( '#result_box' ) );
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/add/',
            data: user_obj,
            withCredentials: false,
            processData: false
        })
        posting.success(function (response) {
            if (typeof response.errors !== "undefined") {
                $scope.add_result = response.message;
                result_box.addClass('alert alert-danger');
            } else {
                $scope.add_result = "Saved bike: "+response.bike.name;
                result_box.addClass('alert alert-success');
                $scope.send();
            }
        });
        posting.error(function(err, response){
            $scope.add_result = err.message;
            result_box.addClass('alert alert-danger');
        })
    };

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
                $scope.add_result = "deleted bike: "+response;
                console.log(response);
                $scope.send();
            }
        });
        posting.error(function(err, response){
            console.log("ciao")
            $scope.add_result = "eee: "+err.message;
        })

    }
});



/*
 * Flattens input so it matches with what the API is expecting.
 */
function normaliseInput(data) {
    var user_obj = {};
    for (var key in data) {
        if ((typeof data[key] !== 'undefined') && (data[key].length > 0)) {
            if ("image" === key) {
                user_obj[key] = {}
                user_obj[key].large = data[key];
                user_obj[key].thumb = data[key];
            } else {
                user_obj[key] = data[key];
            }
        }
    }
    return user_obj;
}




