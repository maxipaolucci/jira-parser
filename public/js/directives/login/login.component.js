'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginCtrl = function () {
  function LoginCtrl($scope, $log, jiraIssueService) {
    _classCallCheck(this, LoginCtrl);

    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.jiraPass = ''; //passworrd is a local variable of this ocmponent, the user come in the scope
  }

  /**
   * Call the login service in the server sending login data to create a connection with jira in the
   * backend
   */


  _createClass(LoginCtrl, [{
    key: 'login',
    value: function login() {
      var _this = this;

      var loadingIconLogin = angular.element('body').find('.loading-icon--login');
      loadingIconLogin.show();

      this.jiraIssueService.login(this.$scope.jiraUser, this.jiraPass).then(function (data) {
        if (data.status == 'success' && data.name == _this.$scope.jiraUser) {
          _this.$scope.logedIn = true;
        } else {
          _this.$log.warn('Cannot login: the service return with an error or different username than the requested');
          _this.$scope.logedIn = false;
        }
      }, function (error) {
        _this.$log.error(error);
        _this.$scope.logedIn = false;
      }).finally(function () {
        loadingIconLogin.hide();
      });
    }

    /**
     * Call the logout service in the server and disconnect the current session with jira server
     */

  }, {
    key: 'logout',
    value: function logout() {
      var _this2 = this;

      this.jiraIssueService.logout(this.$scope.jiraUser).then(function (data) {
        if (data.status == 'success') {
          //do something
        } else {
            _this2.$log.warn('Cannot logout properly, the response is not success');
          }
      }, function (error) {
        _this2.$log.error(error);
      }).finally(function () {
        _this2.jiraPass = '';
        _this2.$scope.jiraUser = '';
        _this2.$scope.logedIn = false;
        _this2.$scope.tasks = [];
      });
    }
  }]);

  return LoginCtrl;
}();

exports.default = LoginCtrl;