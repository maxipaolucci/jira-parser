/**
 * Created by mpaoluc on 17/05/16.
 */
angular.module('printjira', [])
    .controller('mainController', function($scope, $log, jiraIssueService) {
        $scope.welcome = 'maxi';
        jiraIssueService.getIssue(null).then(function(data) {
            if (data) {
                $scope.welcome = data;
            } else {
                $log.log('(loadMorePosts()) Cannot retrive the posts data');
            }
        }, function (data) {
            $log.log(data);
        });
    });