angular.module('printjira').controller('mainController', function($scope) {
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.tasks = [];
});