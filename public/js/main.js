/**
 * Created by mpaoluc on 17/05/16.
 */
angular.module('printjira', [])
  .controller('mainController', function($scope, $log, jiraIssueService) {
    $scope.issueNumbers = 'ATG-5971';
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.jiraPass = '';
    $scope.tasks = [];
    
    $scope.findJiraIssues = function () {
      $scope.tasks = [];

      var issueNumbers = $scope.issueNumbers.split(',');
      angular.forEach(issueNumbers, function(issueNumber) {
        issueNumber = issueNumber.trim();
        jiraIssueService.getIssue(issueNumber).then(function(data) {
          if (data) {
            $scope.tasks.push(data);
          } else {
            $log.log(' Cannot retrieve the issue data for id: ' + issueNumber);
          }
        }, function (data) {
          $log.log(data);
        });
      });


    };
    
    $scope.login = function () {
      jiraIssueService.login($scope.jiraUser, $scope.jiraPass).then(function(data) {
        if (data == 'OK') {
          $log.log(data);
          $scope.logedIn = true;
        } else {
          $log.log('Cannot login');
          $scope.logedIn = false;
        }
      }, function (data) {
        $log.log(data);
        $log.log('Cannot login');
        $scope.logedIn = false;
      });
    };

    $scope.logout = function () {
      jiraIssueService.logout().then(function(data) {
        if (data == 'OK') {
          $log.log(data);
          $scope.logedIn = false;
        } else {
          $log.log('Cannot logout properly, the response is not OK');
          $scope.logedIn = false;
        }
      }, function (data) {
        $log.log(data);
        $log.log('Cannot logout properly, the service failed');
        $scope.logedIn = false;
      }).finally(function() {
        $scope.jiraPass = '';
        $scope.jiraUser = '';
      });
    };
  });