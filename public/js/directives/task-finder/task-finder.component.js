'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskFinderCtrl = function () {
  function TaskFinderCtrl($scope, $log, $timeout, jiraIssueService) {
    var _this = this;

    _classCallCheck(this, TaskFinderCtrl);

    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.logedIn = false;
    this.issueNumbers = 'ATG-5971';
    this.taskColor = '1E90FF';
    this.subtaskColor = '1E90FF';

    this.$scope.$watch('logedIn', function (newValue, oldValue) {
      _this.logedIn = eval(newValue);
    });

    this.initializeColorPickers();
  }

  _createClass(TaskFinderCtrl, [{
    key: 'initializeColorPickers',
    value: function initializeColorPickers() {
      var taskColorPicker = angular.element('body').find('.task-color').get(0);
      var subtaskColorPicker = angular.element('body').find('.subtask-color').get(0);

      new jscolor(taskColorPicker);
      new jscolor(subtaskColorPicker);
    }

    /**
     * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
     * be print
     */

  }, {
    key: 'findJiraIssues',
    value: function findJiraIssues() {
      var _this2 = this;

      this.$scope.tasks = [];
      var loadingIconTasks = angular.element('body').find('.loading-icon--tasks');

      loadingIconTasks.show();

      var issueNumbers = this.issueNumbers.split(',');
      var issueServicesFinished = 0;

      angular.forEach(issueNumbers, function (issueNumber) {
        issueNumber = issueNumber.trim();
        _this2.jiraIssueService.getIssue(_this2.$scope.jiraUser, issueNumber).then(function (data) {
          if (data.status == "success") {
            _this2.$scope.tasks.push(data);
          } else {
            _this2.$log.warn('Cannot retrieve the issue data for id: ' + issueNumber);
          }
        }, function (error) {
          _this2.$log.log(error);
        }).finally(function () {
          issueServicesFinished += 1;
          if (issueServicesFinished == issueNumbers.length) {
            loadingIconTasks.hide();
          }
        });
      });
    }
  }]);

  return TaskFinderCtrl;
}();

exports.default = TaskFinderCtrl;