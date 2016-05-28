'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _taskFinderController = require('./task-finder.controller.es2015');

var _taskFinderController2 = _interopRequireDefault(_taskFinderController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskFinder = function () {
  function TaskFinder() {
    _classCallCheck(this, TaskFinder);

    this.restrict = 'E';
    this.templateUrl = '/js/directives/task-finder/task-finder.html';
    this.controller = _taskFinderController2.default;
    this.controllerAs = 'taskFinderCtrl';
    this.scope = {
      logedIn: '@',
      jiraUser: '@',
      tasks: '='
    };
  }

  _createClass(TaskFinder, [{
    key: 'link',
    value: function link(scope, element, attrs) {
      var initializeColorPickers = function initializeColorPickers() {
        var taskColorPicker = element.find('.task-color').get(0);
        var subtaskColorPicker = element.find('.subtask-color').get(0);

        new jscolor(taskColorPicker);
        new jscolor(subtaskColorPicker);
      };

      initializeColorPickers();
    }
  }]);

  return TaskFinder;
}();

exports.default = TaskFinder;