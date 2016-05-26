'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JiraIssueService = function () {
  function JiraIssueService($http, $q, $timeout) {
    _classCallCheck(this, JiraIssueService);

    this.HOST = 'http://localhost:3000';
    this.$http = $http;
    this.$q = $q;
    this.$timeout = $timeout;
  }

  _createClass(JiraIssueService, [{
    key: 'getIssue',
    value: function getIssue(username, issueNumber) {
      var deferred = this.$q.defer();
      var url = this.HOST + '/findIssue/' + username + '/' + issueNumber;

      //this.$timeout(() => {
      this.$http.get(url).success(function (data) {
        deferred.resolve(data);
      }).error(function (error) {
        deferred.reject('There was an error trying to retrieve the issue number: ' + issueNumber);
      });
      //}, 2000);

      return deferred.promise;
    }
  }, {
    key: 'login',
    value: function login(user, pass) {
      var deferred = this.$q.defer();
      var url = this.HOST + '/login';
      var loginData = {
        username: user,
        password: pass
      };

      //this.$timeout(() => {
      this.$http.post(url, loginData).success(function (data) {
        deferred.resolve(data);
      }).error(function (error) {
        deferred.reject('There was an error trying login: ' + error);
      });
      //}, 2000);

      return deferred.promise;
    }
  }, {
    key: 'logout',
    value: function logout(username) {
      var deferred = this.$q.defer();
      var url = this.HOST + '/logout/' + username;

      this.$http.get(url).success(function (data) {
        deferred.resolve(data);
      }).error(function (error) {
        deferred.reject('There was an error trying to do logout:' + error);
      });

      return deferred.promise;
    }
  }]);

  return JiraIssueService;
}();

exports.default = JiraIssueService;