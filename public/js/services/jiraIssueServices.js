angular.module('printjira').service('jiraIssueService',function ($http, $q) {

    var host = 'http://localhost:3000/';

    this.getIssue = function (issueNumber) {
        var deferred = $q.defer();
        var url = host + 'findIssue/' + issueNumber;
        $http.get(url)
            .success(function(data){
                deferred.resolve(data);
            }).error(function(){
            deferred.reject('There was an error trying to retrieve the isssue number: ');
        });
        return deferred.promise;
    };

    this.login = function (user, pass) {
        var deferred = $q.defer();
        var url = host + 'login';
        var datas = {
                username: user,
                password: pass
            };
        $http.post(url, datas)
          .success(function(data){
              deferred.resolve(data);
          }).error(function(){
            deferred.reject('There was an error trying login: ');
        });
        return deferred.promise;
    };
});