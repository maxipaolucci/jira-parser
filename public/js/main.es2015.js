import JiraIssueService from './services/jiraIssueServices';
import LoadingIconCtrl from './directives/loading-icon/loading-icon.component';
import LoginCtrl from './directives/login/login.component';
import TaskFinderCtrl from './directives/task-finder/task-finder.component';
import PdfExporterCtrl from './directives/pdf-exporter/pdf-exporter.component';
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
angular.module('printjira').directive('taskFinder', () => {
  return {
    restrict : 'E',
    templateUrl : '/js/directives/task-finder/task-finder.html',
    controller : TaskFinderCtrl,
    controllerAs : 'taskFinderCtrl',
    scope : {
      logedIn : '@',
      jiraUser : '@',
      tasks : '='
    }
  };
});
angular.module('printjira').controller('mainController', MainCtrl);