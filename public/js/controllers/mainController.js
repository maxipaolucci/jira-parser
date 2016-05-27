angular.module('printjira').controller('mainController', function($scope, $log, $timeout, jiraIssueService) {
    var vm = this;

    $scope.issueNumbers = 'ATG-5971';
    $scope.taskColor = '1E90FF';
    $scope.subtaskColor = '1E90FF';
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.tasks = [];

    /**
     * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
     * be print
     */
    $scope.findJiraIssues = function () {
      $scope.tasks = [];
      var loadingIconTasks = angular.element('body').find('.loading-icon--tasks');

      loadingIconTasks.show();

      var issueNumbers = $scope.issueNumbers.split(',');
      var issueServicesFinished = 0;

      angular.forEach(issueNumbers, function(issueNumber) {
        issueNumber = issueNumber.trim();
        jiraIssueService.getIssue($scope.jiraUser, issueNumber).then(function(data) {
          if (data.status == "success") {
            $scope.tasks.push(data);
          } else {
            $log.warn(' Cannot retrieve the issue data for id: ' + issueNumber);
          }
        }, function (error) {
          $log.log(error);
        }).finally(function() {
          issueServicesFinished += 1;
          if (issueServicesFinished == issueNumbers.length) {
            loadingIconTasks.hide();
          }
        });
      });
    };

    
});