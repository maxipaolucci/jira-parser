import JiraIssueService from './services/jiraIssueServices.es2015';
import LoadingIcon from './directives/loading-icon/loading-icon.component.es2015';
import Login from './directives/login/login.component.es2015';
import TaskFinder from './directives/task-finder/task-finder.component.es2015';
import PdfExporter from './directives/pdf-exporter/pdf-exporter.component.es2015';
import MainCtrl from './controllers/main.controller.es2015';

angular.module('printjira', []);
angular.module('printjira').service('jiraIssueService', JiraIssueService);
angular.module('printjira').directive('loadingIcon', () => new LoadingIcon);
angular.module('printjira').directive('pdfExporter', () => new PdfExporter);
angular.module('printjira').directive('login', () => new Login);
angular.module('printjira').directive('taskFinder', () => new TaskFinder);
angular.module('printjira').controller('mainController', MainCtrl);

//TODO add boostrap
//TODO use default parameters in required functions
//TODO update loading icon to a more fancy one
//TODO add fields where we are extracting data from json as constants in the code to make it easy to change if required
//TODO add status labels
//TODO implement a method to add custom spacing between rows to avoid cutting tasks in pdf
