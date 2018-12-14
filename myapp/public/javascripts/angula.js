var app = angular.module("cbk", []);
var i = 0; // index of user list
var ii = 0; // index of block user list
var thiz = this;
var rowindex;
var listuser = [];
var listblockuser = [];
var indexhistory = 0;
var listransaction = [];
app.controller("ctr1", function ($scope, $http, $window) {
    $scope.list = [];
    console.log("i", i);
    $scope.getUser = function () {
        document
            .getElementById("moreblock")
            .setAttribute("style", "display : none");
        document
            .getElementById("moreuser")
            .setAttribute("style", "display : true; color : rgb(76, 76, 238); text-align: center");
        $scope.lock = "Block";
        thiz.listblockuser = [];
        thiz.ii = 0;
        var count = { index: thiz.i };
        $http({
            method: "POST",
            url: "listuser",
            data: count
        }).then(function (response) {
            thiz.i = thiz.i + response.data.length;
            if (thiz.listuser.length < 30) {
                thiz.listuser = thiz.listuser.concat(response.data);
                $scope.list = thiz.listuser;
            }
            else {
                thiz.listuser = response.data;
                $scope.list = thiz.listuser;
            }
        });
    };
    $scope.showinfor = function (x) {
        thiz.rowindex = x;
        $scope.z = $scope.list[x];
        document.getElementById("username").value = $scope.list[x].username;
        document.getElementById("email").value = $scope.list[x].email;
        document.getElementById("address").value = $scope.list[x].address;
        document.getElementById("balance").value = $scope.list[x].balance;
        document.getElementById("privatekey").value = $scope.list[x].privatekey;
    };
    $scope.update = function () {
        var obj = $.param({
            ID: $scope.list[thiz.rowindex]._id,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        });
        console.log("param : ", obj.username);
        $http.put("update?" + obj).then(function (response) {
            if (response.status == 200) {
                alert("update success");
            }
            else {
                alert("update error : ");
                console.log(response);
            }
        });
    };
    //set null for modal tag
    $scope.close = function () {
        thiz.rowindex = 0;
        $scope.z = null;
        document.getElementById("username").value = null;
        document.getElementById("email").value = null;
        document.getElementById("address").value = null;
        document.getElementById("password").value = null;
    };
    $scope.lockfunction = function (x) {
        if ($scope.lock == "Unlock") {
            var obj = $.param({
                ID: $scope.list[x]._id
            });
            $http.put("user/unlock?" + obj).then(function (response) {
                if (response.status == 200) {
                    $scope.list.splice(x, 1);
                    thiz.ii = thiz.ii - 1;
                    alert("unlock success");
                }
                else {
                    alert("unlock error : ");
                    console.log(response);
                }
            });
        }
        else {
            var obj = $.param({
                ID: $scope.list[x]._id
            });
            $http.put("user/block?" + obj).then(function (response) {
                if (response.status == 200) {
                    $scope.list.splice(x, 1);
                    thiz.i = thiz.i - 1;
                    alert("block success");
                }
                else {
                    alert("block error : ");
                    console.log(response);
                }
            });
        }
    };
    //deleteuser
    $scope.deleteUser = function (x) {
        var obj = $.param({
            ID: $scope.list[x]._id
        });
        $http.put("user/delete?" + obj).then(function (response) {
            if (response.status == 200) {
                $scope.list.splice(x, 1);
                if ($scope.lock == "lock") {
                    thiz.i = thiz.i - 1;
                }
                else {
                    thiz.ii = thiz.ii - 1;
                }
                alert("delete success");
            }
            else {
                alert("delete error : ");
                console.log(response);
            }
        });
    };
    $scope.getUserBlock = function () {
        document.getElementById("moreuser").setAttribute("style", "display : none");
        document
            .getElementById("moreblock")
            .setAttribute("style", "display : true; color : rgb(76, 76, 238); text-align: center");
        $scope.lock = "Unlock";
        thiz.listuser = [];
        thiz.i = 0;
        var count = { index: ii };
        $http({
            method: "POST",
            url: "listblockuser",
            data: count
        }).then(function (response) {
            thiz.ii = thiz.ii + response.data.length;
            if (thiz.listblockuser.length < 30) {
                thiz.listblockuser = thiz.listblockuser.concat(response.data);
                $scope.list = thiz.listblockuser;
            }
            else {
                thiz.listblockuser = response.data;
                $scope.list = thiz.listblockuser;
            }
        });
    };
    //get history transaction of user listtran(variable save list transaction)
    $scope.showhistory = function () {
        $window.open('http://localhost:3000/admin/history?address=' + $scope.list[thiz.rowindex].address, '_blank');
    };
});
