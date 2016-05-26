angular.module('printjira').directive('pdfExporter', () => {
  return {
    restrict: 'E',
    scope: {
      tasks : '@',
      taskColor : '@',
      subtaskColor : '@',
      logedIn : '@'
    },
    templateUrl: '/js/directives/pdf-exporter/pdf-exporter.html',
    controller($scope){
      let vm = this;
      vm.pdfDocDef = null;
      vm.tasksArray = [];

      $scope.$watch('tasks', function handleTasksChange(newValue, oldValue) {
        vm.pdfDocDef = null;
        vm.tasksArray = [];
        vm.tasksArray = JSON.parse(newValue);
      });
      /**
       * Handles openPdf btn
       */
      $scope.openPdf = function() {
        if (!vm.pdfDocDef) {
          vm.generatesPdfDefinition();
        }
        pdfMake.createPdf(vm.pdfDocDef).open();
      };

      /**
       * Handles printPdf btn
       */
      $scope.printPdf = function() {
        if (!vm.pdfDocDef) {
          vm.generatesPdfDefinition();
        }
        pdfMake.createPdf(vm.pdfDocDef).print();
      };

      /**
       * Handles savePdf btn
       */
      $scope.downloadPdf = function() {
        if (!vm.pdfDocDef) {
          vm.generatesPdfDefinition();
        }
        pdfMake.createPdf(vm.pdfDocDef).download('tasks.pdf');
      };

      /**
       * Generates a pdf definition for the tasks in the vm.tasksArrays array and cache the result in vm.pdfDocDef
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
        angular.forEach(vm.tasksArray, function (task) {
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
    }
  };
});
