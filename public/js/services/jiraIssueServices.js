angular.module('printjira').service('jiraIssueService',function ($http, $q, $timeout) {

    var host = 'http://localhost:3000/';

    this.getIssue = function (issueNumber) {
        var deferred = $q.defer();
        var url = host + 'findIssue/' + issueNumber;

        $timeout(function() {
        $http.get(url)
            .success(function(data){
                deferred.resolve(data);
            }).error(function(){
            deferred.reject('There was an error trying to retrieve the isssue number: ' + issueNumber);
        });
        }, 2000);

        return deferred.promise;
    };

    this.login = function (user, pass) {
        var deferred = $q.defer();
        var url = host + 'login';
        var datas = {
          username: user,
          password: pass
        };

        //$timeout(function() {
        $http.post(url, datas)
          .success(function(data){
            deferred.resolve(data);
          }).error(function(error){
          deferred.reject('There was an error trying login: ' + error);
        });
        //}, 2000);

        return deferred.promise;
    };

    this.logout = function (user, pass) {
        var deferred = $q.defer();
        var url = host + 'logout';

        $http.get(url)
            .success(function(data){
                deferred.resolve(data);
            }).error(function(){
                deferred.reject('There was an error trying to do logout.');
            });
        return deferred.promise;
    };
});