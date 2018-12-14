var app = angular.module("myapp", []);
var address = "";
var thiz = this;
var index = 0;
app.controller("ctrl", function($scope, $http){
    thiz.address = document.getElementById('address').innerHTML;
    $scope.list =[];
    $scope.address = thiz.address;
    $scope.getListTransaction = function(){
        var data = {
            address : thiz.address,
            index : thiz.index
        };
        $http({
            method : 'POST',
            url : 'history',
            data : data
        }).then(function(response){
           
            if(response.data.length == 0){
                alert("got all transaction of user");
            }else{
            $scope.list = $scope.list.concat(response.data);
            thiz.index = thiz.index + response.data.length;
            }
        });
    }
    


})