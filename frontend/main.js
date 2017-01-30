var appModule = angular.module('appModule', ['ngCookies']);

appModule.controller('appController', function($scope, $http, $cookieStore) {

    $scope.send = function (sort_by) {
        var sort;
        $scope.show_table = false;

        // TODO: Could probably be optimised
        if (typeof $cookieStore.get('sort_by') === 'undefined') {
            if (typeof sort_by !== 'undefined') {
                $cookieStore.put('sort_by', sort_by);
            }
        } else {
            if (typeof sort_by === 'undefined') {
                sort_by = $cookieStore.get('sort_by');
            } else {
                $cookieStore.put('sort_by', sort_by);
            }
        }
        // Do POST request for bikes 
        (typeof sort_by === 'undefined') ? sort = {} : sort = {"sort_by": sort_by};
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/',
            data: sort,
            withCredentials: false,
            processData: false
        });
        posting.success(function (response) {
            $scope.show_table = true;
            $scope.bikes_data = response.bikes;
        });
    }
    $scope.add_result = "Bikes operations";

    $scope.submitForm = function (action, dt) {
        console.log("In submitForm");
        
        (typeof action === 'undefined') ? action = 'add' : {};
        (typeof dt === 'undefined') ? dt = $scope.data : {};
        var user_obj = normaliseInput(dt),
            result_box = angular.element( document.querySelector( '#result_box' ) );
        var posting = $http({
            method: 'POST',
            url: 'http://localhost:3000/api/bikes/'+action+'/',
            data: user_obj,
            withCredentials: false,
            processData: false
        });
        posting.success(function (response) {
            if (typeof response.errors !== "undefined") {
                $scope.add_result = response.message;
                result_box.addClass('alert alert-danger');
            } else {
                result_box.html( "Saved bike: "+response.bike.name);

                result_box.addClass('alert alert-success');
                try {
                    $scope.$parent.send();
                } catch (err) {
                    $scope.send();
                }
            }
        });
        posting.error(function(err, response){
            $scope.add_result = err.message;
            result_box.addClass('alert alert-danger');
        });
    };
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




