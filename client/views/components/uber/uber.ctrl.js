// ADDED R.S
angular
    .module('savor.uber', [])
    .controller('uberController', uberController);

function uberController($http, $scope, uber, $rootScope) {
    $scope.testValue = 'Confirms uberController is connected with uber.tpl.html!';

    $scope.loading = true;
    $scope.orderUberRide = uber.orderUberRide;

    // get user location and load products list
    uber.getUberProducts(function(productsList) {
        $scope.loading = false;
        $scope.restaurantLocationObj = $rootScope.restaurantLocationObj;
        $scope.userLocationObj = $rootScope.userLocationObj;
        $scope.products = productsList;
    });
}; 
