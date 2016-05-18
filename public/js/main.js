angular.module('printjira', [])
  .controller('mainController', function($scope, $log, jiraIssueService) {
    $scope.issueNumbers = 'ATG-5971';
    $scope.taskColor = '1E90FF';
    $scope.subtaskColor = '1E90FF';
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
          if (data.status == "success") {
            $scope.tasks.push(data);
          } else {
            $log.warn(' Cannot retrieve the issue data for id: ' + issueNumber);
          }
        }, function (error) {
          $log.log(error);
        });
      });
    };
    
    $scope.login = function () {
      jiraIssueService.login($scope.jiraUser, $scope.jiraPass).then(function(data) {
        if (data.status == 'success' && data.name == $scope.jiraUser) {
          $scope.logedIn = true;
        } else {
          $log.warn('Cannot login: the service return with an error or different username than the requested');
          $scope.logedIn = false;
        }
      }, function (error) {
        $log.error(error);
        $scope.logedIn = false;
      });
    };

    $scope.logout = function () {
      jiraIssueService.logout().then(function(data) {
        if (data.status == 'success') {
          $scope.logedIn = false;
        } else {
          $log.warn('Cannot logout properly, the response is not success');
          $scope.logedIn = false;
        }
      }, function (error) {
        $log.error(error);
        $scope.logedIn = false;
      }).finally(function() {
        $scope.jiraPass = '';
        $scope.jiraUser = '';
      });
    };
  });