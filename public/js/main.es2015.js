import JiraIssueService from './services/jiraIssueServices';
import LoadingIconCtrl from './directives/loading-icon/loading-icon.component';
import PdfExporterCtrl from './directives/pdf-exporter/pdf-exporter.component';
import LoginCtrl from './directives/login/login.component';

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
    controller : PdfExporterCtrl
  };
});
angular.module('printjira').directive('login', () => {
  return {
    restrict : 'E',
    scope : {
    },
    templateUrl : '/js/directives/login/login.html',
    controller : LoginCtrl
  };
});