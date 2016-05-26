(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jiraIssueServices = require('./services/jiraIssueServices');

var _jiraIssueServices2 = _interopRequireDefault(_jiraIssueServices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('printjira', []);
angular.module('printjira').service('jiraIssueService', _jiraIssueServices2.default);

},{"./services/jiraIssueServices":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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

},{}]},{},[1]);
