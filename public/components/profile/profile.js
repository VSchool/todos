var app = angular.module("TodoApp");

app.controller("ProfileController", ["$scope", "UserService", function ($scope, UserService) {
    $scope.userService = UserService;
    $scope.user = UserService.user;
    $scope.updateUser = function (user) {
        if (user.password === $scope.newPasswordRepeat) {
            UserService.updateUser(user).then(function(data) {
                toastr.success(data.message);
                $scope.newPasswordRepeat = "";
                $scope.user.password = "";
            })
        } else {
            alert("The two passwords didn't match");
        }
    }
}]);