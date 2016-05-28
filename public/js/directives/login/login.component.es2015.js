import LoginCtrl from './login.controller.es2015';

export default class Login {
  constructor() {
    this.restrict = 'E';
    this.templateUrl = '/js/directives/login/login.html';
    this.controller = LoginCtrl;
    this.controllerAs = 'loginCtrl';
    this.scope = {
      logedIn : '=',
      jiraUser : '=',
      tasks : '='
    };
  }
}