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
      let storyColorPicker = element.find('.story-color').get(0);
      let taskColorPicker = element.find('.task-color').get(0);
      let subtaskColorPicker = element.find('.subtask-color').get(0);
      let epicColorPicker = element.find('.epic-color').get(0);
      let bugColorPicker = element.find('.bug-color').get(0);

      new jscolor(storyColorPicker);
      new jscolor(taskColorPicker);
      new jscolor(subtaskColorPicker);
      new jscolor(epicColorPicker);
      new jscolor(bugColorPicker);
    };

    initializeColorPickers();
  }
}