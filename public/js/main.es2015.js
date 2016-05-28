import JiraIssueService from './services/jiraIssueServices.es2015';
import LoadingIconCtrl from './directives/loading-icon/loading-icon.component.es2015';
import LoginCtrl from './directives/login/login.component.es2015';
import TaskFinder from './directives/task-finder/task-finder.component.es2015';
import PdfExporterCtrl from './directives/pdf-exporter/pdf-exporter.component.es2015';
import MainCtrl from './controllers/mainController';

angular.module('printjira', []);
angular.module('printjira').service('jiraIssueService', JiraIssueService);
angular.module('printjira').directive('loadingIcon', () => {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/loading-icon/loading-icon.html',
    controller: LoadingIconCtrl
  };
});
angular.module('printjira').directive('pdfExporter', () => {
  return {
    restrict : 'E',
    scope : {
      tasks : '@',
      taskColor : '@',
      subtaskColor : '@',
      logedIn : '@'
    },
    templateUrl : '/js/directives/pdf-exporter/pdf-exporter.html',
    controller : PdfExporterCtrl,
    controllerAs : 'pdfExporterCtrl'
  };
});
angular.module('printjira').directive('login', () => {
  return {
    restrict : 'E',
    templateUrl : '/js/directives/login/login.html',
    controller : LoginCtrl,
    controllerAs : 'loginCtrl',
    scope : {
      logedIn : '=',
      jiraUser : '=',
      tasks : '='
    }
  };
});
angular.module('printjira').directive('taskFinder', () => new TaskFinder);
angular.module('printjira').controller('mainController', MainCtrl);