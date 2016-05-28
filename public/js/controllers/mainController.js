angular.module('printjira').controller('mainController', function($scope, $log, $timeout, jiraIssueService) {
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.tasks = [];
});