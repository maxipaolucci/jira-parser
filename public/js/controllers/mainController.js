
angular.module('printjira').controller('mainController', function($scope, $log, $timeout, jiraIssueService) {
    var vm = this;
    vm.pdfDocDef = null;

    $scope.issueNumbers = 'ATG-5971';
    $scope.taskColor = '1E90FF';
    $scope.subtaskColor = '1E90FF';
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.jiraPass = '';
    $scope.tasks = [];

    $scope.$watch('tasks', function handleTasksChange(newValue, oldValue) {
      vm.pdfDocDef = null;
      console.log('changed');
    });
    /**
     * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
     * be print
     */
    $scope.findJiraIssues = function () {
      $scope.tasks = [];
      var loadingIconTasks = angular.element('body').find('.loading-icon--tasks');

      loadingIconTasks.show();

      var issueNumbers = $scope.issueNumbers.split(',');
      var issueServicesFinished = 0;

      angular.forEach(issueNumbers, function(issueNumber) {
        issueNumber = issueNumber.trim();
        jiraIssueService.getIssue($scope.jiraUser, issueNumber).then(function(data) {
          if (data.status == "success") {
            $scope.tasks.push(data);
          } else {
            $log.warn(' Cannot retrieve the issue data for id: ' + issueNumber);
          }
        }, function (error) {
          $log.log(error);
        }).finally(function() {
          issueServicesFinished += 1;
          if (issueServicesFinished == issueNumbers.length) {
            loadingIconTasks.hide();
          }
        });
      });
    };

    /**
     * Call the login service in the server sending login data to create a connection with jira in the
     * backend
     */
    $scope.login = function () {
      var loadingIconLogin = angular.element('body').find('.loading-icon--login');
      loadingIconLogin.show();
      
      jiraIssueService.login($scope.jiraUser, $scope.jiraPass).then(function(data) {
        if (data.status == 'success' && data.name == $scope.jiraUser) {
          $scope.logedIn = true;
        } else {
          $log.warn('Cannot login: the service return with an error or different username than the requested');
          $scope.logedIn = false;
        }
      }, function (error) {
        $log.error(error);
        $scope.logedIn = false;
      }).finally(function() {
        loadingIconLogin.hide();
      });
    };

    /**
     * Call the logout service in the server and disconnect the current session with jira server
     */
    $scope.logout = function () {
      jiraIssueService.logout($scope.jiraUser).then(function(data) {
        if (data.status == 'success') {
          //do something
        } else {
          $log.warn('Cannot logout properly, the response is not success');
        }
      }, function (error) {
        $log.error(error);
      }).finally(function() {
        $scope.jiraPass = '';
        $scope.jiraUser = '';
        $scope.logedIn = false;
        $scope.tasks = [];
      });
    };

    /**
     * Generates a pdf definition for the tasks in the $scope.tasks array and cache the result in vm.pdfDocDef
     */
    vm.generatesPdfDefinition = function() {

      /**
       * Generates the doc definition to export tasks table to PDF
       * @param JSON task . The task to render
       * @param JSON parentTask . Null if this task has not got a parent, a json object(the parent task) if it is a subtask.
       * @param String type . This could be 'task' or 'subtask' representing the type of task to render
       * @param int tableWidth . The width of the table in px
       * @returns {{style: string, table: {widths: number[], body: *[]}}}
       */
      var generateTaskDocDef = function (task, parentTask, type, tableWidth) {
        var key = parentTask ? parentTask.key : task.key;
        var summary = parentTask ? task.key + ': ' + task.fields.summary : task.fields.summary;

        return {
          style: 'taskTable',
          table: {
            widths: [tableWidth],
            body: [
              [{text: key, style: type + 'TableHeader' }],
              [{text: summary, style: type + 'TableSummary' }]
            ]
          }
        };
      };

      var pdfTasksDocDef = [];
      angular.forEach($scope.tasks, function (task) {
        //Create PDF definition for Task
        pdfTasksDocDef.push(generateTaskDocDef(task, null, 'task', 280));

        //Create PDF definition foreach subtask of the previous task
        if (task.fields.subtasks) {
          for (var i = 0; i < task.fields.subtasks.length; i += 2) {
            var subtask = task.fields.subtasks[i];
            var subtask2 = i + 1 < task.fields.subtasks.length ? task.fields.subtasks[i + 1] : null;

            var pdfSubTaskDocDef = {
              columns: [generateTaskDocDef(subtask, task, 'subtask', 175)]
            };

            if (subtask2) {
              pdfSubTaskDocDef.columns.push(generateTaskDocDef(subtask2, task, 'subtask', 175));
            }
            pdfTasksDocDef.push(pdfSubTaskDocDef);
          }
        }

      });

      vm.pdfDocDef = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 20, 50, 20, 50 ],

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
            fillColor: '#' + $scope.taskColor
          },
          taskTableSummary: {
            fontSize: 14
          },
          subtaskTableHeader: {
            alignment: 'center',
            bold: true,
            fontSize: 14,
            color: '#fff',
            fillColor: '#' + $scope.subtaskColor
          },
          subtaskTableSummary: {
            fontSize: 12
          }
        }
      };
    };

  /**
   * Handles openPdf btn
   */
  $scope.openPdf = function() {
      if (!vm.pdfDocDef) {
        vm.generatesPdfDefinition();
        console.log(1);
      }
      pdfMake.createPdf(vm.pdfDocDef).open();
    };

    /**
     * Handles printPdf btn
     */
    $scope.printPdf = function() {
      if (!vm.pdfDocDef) {
        vm.generatesPdfDefinition();
        console.log(2);
      }
      pdfMake.createPdf(vm.pdfDocDef).print();
    };

    /**
     * Handles savePdf btn
     */
    $scope.downloadPdf = function() {
      if (!vm.pdfDocDef) {
        vm.generatesPdfDefinition();
        console.log(3);
      }
      pdfMake.createPdf(vm.pdfDocDef).download('tasks.pdf');
    };
});