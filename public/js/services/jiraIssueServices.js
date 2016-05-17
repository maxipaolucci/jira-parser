angular.module('printjira').service('jiraIssueService',function ($http, $q) {
    
    this.getIssue = function (issueNumber) {
        var deferred = $q.defer();
        var url = 'http://localhost:3000/mock';
        $http.get(url)
            .success(function(data){
                deferred.resolve(data);
            }).error(function(){
            deferred.reject('There was an error trying to retrieve the isssue number: ');
        });
        return deferred.promise;
    };
});