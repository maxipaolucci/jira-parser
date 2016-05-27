(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var LoadingIconCtrl = function LoadingIconCtrl($scope) {
  _classCallCheck(this, LoadingIconCtrl);

  this.$scope = $scope;
};

exports.default = LoadingIconCtrl;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var LoginCtrl = function LoginCtrl($scope) {
  _classCallCheck(this, LoginCtrl);
};

exports.default = LoginCtrl;

},{}],3:[function(require,module,exports){
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

var PdfExporterCtrl = function () {
  function PdfExporterCtrl($scope) {
    var _this = this;

    _classCallCheck(this, PdfExporterCtrl);

    this.pdfDocDef = null;
    this.tasksArray = [];
    this.$scope = $scope;

    this.$scope.$watch('tasks', function (newValue, oldValue) {
      _this.pdfDocDef = null;
      _this.tasksArray = [];
      _this.tasksArray = JSON.parse(newValue);
    });

    /**
     * Handles openPdf btn
     */
    this.$scope.openPdf = function () {
      if (!_this.pdfDocDef) {
        _this._generatesPdfDefinition();
      }
      pdfMake.createPdf(_this.pdfDocDef).open();
    };

    /**
     * Handles printPdf btn
     */
    this.$scope.printPdf = function () {
      if (!_this.pdfDocDef) {
        _this._generatesPdfDefinition();
      }
      pdfMake.createPdf(_this.pdfDocDef).print();
    };

    /**
     * Handles savePdf btn
     */
    this.$scope.downloadPdf = function () {
      if (!_this.pdfDocDef) {
        _this._generatesPdfDefinition();
      }
      pdfMake.createPdf(_this.pdfDocDef).download('tasks.pdf');
    };
  }

  /**
   * Generates a pdf definition for the tasks in the vm.tasksArrays array and cache the result in vm.pdfDocDef
   */

  _createClass(PdfExporterCtrl, [{
    key: '_generatesPdfDefinition',
    value: function _generatesPdfDefinition() {
      var _this2 = this;

      var pdfTasksDocDef = [];
      angular.forEach(this.tasksArray, function (task) {
        //Create PDF definition for Task
        pdfTasksDocDef.push(_this2._generateTaskDocDef(task, null, 'task', 280));

        //Create PDF definition foreach subtask of the previous task
        if (task.fields.subtasks) {
          for (var i = 0; i < task.fields.subtasks.length; i += 2) {
            var subtask = task.fields.subtasks[i];
            var subtask2 = i + 1 < task.fields.subtasks.length ? task.fields.subtasks[i + 1] : null;

            var pdfSubTaskDocDef = {
              columns: [_this2._generateTaskDocDef(subtask, task, 'subtask', 175)]
            };

            if (subtask2) {
              pdfSubTaskDocDef.columns.push(_this2._generateTaskDocDef(subtask2, task, 'subtask', 175));
            }

            pdfTasksDocDef.push(pdfSubTaskDocDef);
          }
        }
      });

      this.pdfDocDef = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [20, 50, 20, 50],

        content: pdfTasksDocDef,
        styles: {
          taskTable: {
            margin: [0, 5, 0, 15]
          },
          taskTableHeader: {
            alignment: 'center',
            bold: true,
            fontSize: 16,
            color: '#fff',
            fillColor: '#' + this.$scope.taskColor
          },
          taskTableSummary: {
            fontSize: 14
          },
          subtaskTableHeader: {
            alignment: 'center',
            bold: true,
            fontSize: 14,
            color: '#fff',
            fillColor: '#' + this.$scope.subtaskColor
          },
          subtaskTableSummary: {
            fontSize: 12
          }
        }
      };
    }

    /**
     * Generates the doc definition to export tasks table to PDF
     * @param JSON task . The task to render
     * @param JSON parentTask . Null if this task has not got a parent, a json object(the parent task) if it is a subtask.
     * @param String type . This could be 'task' or 'subtask' representing the type of task to render
     * @param int tableWidth . The width of the table in px
     * @returns {{style: string, table: {widths: number[], body: *[]}}}
     */

  }, {
    key: '_generateTaskDocDef',
    value: function _generateTaskDocDef(task, parentTask, type, tableWidth) {
      var key = parentTask ? parentTask.key : task.key;
      var summary = parentTask ? task.key + ': ' + task.fields.summary : task.fields.summary;

      return {
        style: 'taskTable',
        table: {
          widths: [tableWidth],
          body: [[{ text: key, style: type + 'TableHeader' }], [{ text: summary, style: type + 'TableSummary' }]]
        }
      };
    }
  }]);

  return PdfExporterCtrl;
}();

exports.default = PdfExporterCtrl;

},{}],4:[function(require,module,exports){
'use strict';

var _jiraIssueServices = require('./services/jiraIssueServices');

var _jiraIssueServices2 = _interopRequireDefault(_jiraIssueServices);

var _loadingIcon = require('./directives/loading-icon/loading-icon.component');

var _loadingIcon2 = _interopRequireDefault(_loadingIcon);

var _pdfExporter = require('./directives/pdf-exporter/pdf-exporter.component');

var _pdfExporter2 = _interopRequireDefault(_pdfExporter);

var _login = require('./directives/login/login.component');

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('printjira', []);
angular.module('printjira').service('jiraIssueService', _jiraIssueServices2.default);
angular.module('printjira').directive('loadingIcon', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/loading-icon/loading-icon.html',
    controller: _loadingIcon2.default
  };
});
angular.module('printjira').directive('pdfExporter', function () {
  return {
    restrict: 'E',
    scope: {
      tasks: '@',
      taskColor: '@',
      subtaskColor: '@',
      logedIn: '@'
    },
    templateUrl: '/js/directives/pdf-exporter/pdf-exporter.html',
    controller: _pdfExporter2.default
  };
});
angular.module('printjira').directive('login', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/login/login.html',
    controller: _login2.default
  };
});

},{"./directives/loading-icon/loading-icon.component":1,"./directives/login/login.component":2,"./directives/pdf-exporter/pdf-exporter.component":3,"./services/jiraIssueServices":5}],5:[function(require,module,exports){
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

},{}]},{},[4]);
