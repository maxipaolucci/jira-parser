class JiraIssueService {

  constructor($http, $q, $timeout) {
    this.HOST = 'http://localhost:3000';
    this.$http = $http;
    this.$q = $q;
    this.$timeout = $timeout;
  }


  getIssue(username, issueNumber) {
    let deferred = this.$q.defer();
    let url = `${this.HOST}/findIssue/${username}/${issueNumber}`;

    //this.$timeout(() => {
    this.$http.get(url).success((data) => {
      deferred.resolve(data);
    }).error((error) => {
      deferred.reject(`There was an error trying to retrieve the issue number: ${issueNumber}`);
    });
    //}, 2000);

    return deferred.promise;
  }

  login(user, pass) {
    let deferred = this.$q.defer();
    let url = `${this.HOST}/login`;
    let loginData = {
      username: user,
      password: pass
    };

    //this.$timeout(() => {
    this.$http.post(url, loginData).success((data) => {
      deferred.resolve(data);
    }).error((error) => {
      deferred.reject(`There was an error trying login: ${error}`);
    });
    //}, 2000);

    return deferred.promise;
  }

  logout(username) {
    let deferred = this.$q.defer();
    let url = `${this.HOST}/logout/${username}`;

    this.$http.get(url).success((data) => {
      deferred.resolve(data);
    }).error((error) => {
      deferred.reject(`There was an error trying to do logout:${error}`);
    });

    return deferred.promise;
  }
}

angular.module('printjira').service('jiraIssueService', JiraIssueService);