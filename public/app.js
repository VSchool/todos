var app = angular.module("TodoApp", ["ngRoute", "TodoApp.Auth"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "components/home/home.html"
        })
        .when("/todo", {
            templateUrl: "components/todos/todos.html",
            controller: "TodoController"
        })
        .when("/profile", {
            templateUrl: "components/profile/profile.html",
            controller: "ProfileController"
        })
        .otherwise({
            redirectTo: "/"
        });
});
