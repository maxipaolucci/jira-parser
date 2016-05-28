import TaskFinderCtrl from './task-finder.controller.es2015';

export default class TaskFinder {
  constructor() {
    this.restrict = 'E';
    this.templateUrl = '/js/directives/task-finder/task-finder.html';
    this.controller = TaskFinderCtrl;
    this.controllerAs = 'taskFinderCtrl';
    this.scope = {
      logedIn : '@',
      jiraUser : '@',
      tasks : '='
    };
  }

  link(scope, element, attrs) {
    let initializeColorPickers = () => {
      let taskColorPicker = element.find('.task-color').get(0);
      let subtaskColorPicker = element.find('.subtask-color').get(0);

      new jscolor(taskColorPicker);
      new jscolor(subtaskColorPicker);
    };

    initializeColorPickers();
  }
}