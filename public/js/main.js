/**
 * Created by mpaoluc on 17/05/16.
 */
angular.module('printjira', [])
    .controller('mainController', function($scope, $log, jiraIssueService) {
        $scope.issueNumber = 'ATG-5971';
        $scope.subtasks = [];

        $scope.findJiraIssue = function () {
          $scope.subtasks = [];
          jiraIssueService.getIssue($scope.issueNumber).then(function(data) {
            if (data) {
              $scope.subtasks = data.fields.subtasks;
            } else {
              $log.log('(loadMorePosts()) Cannot retrive the posts data');
            }
          }, function (data) {
            $log.log(data);
          });
        }

    });