var app = angular.module("myapp", []);
app.controller("ctrl", function ($scope, $http) {
    $scope.sendcoin = function () {
        var dataadd = { address: $scope.address, amount: $scope.amount };
        if (!isNaN($scope.address) && $scope.amount != null) {
            $http({
                method: 'POST',
                url: '/admin/sendcoinbase',
                data: dataadd,
            }).then(function (response) {
                console.log(response);
                $scope.address = null;
                $scope.amount = null;
                if (response.status == 200) {
                    alert('sended coin');
                }
                else {
                    alert('sendcoin error please check your feild');
                }
            });
            $scope.warning = null;
        }
        else {
            alert('input error ');
        }
    };
});
