var app = angular.module("myapp", []);
app.controller("ctrl", function($scope, $http){
    $scope.list =[];
    $scope.getListTransaction = function(){
        $http({
            method : 'GET',
            url : 'latestblock',
            data : []
        }).then(function(response){
            console.log(response.data);
            $scope.list = $scope.list.concat(response.data);
        });
    }
    $scope.showinfor= function(x){
        $scope.z = $scope.list[x];
    }
})