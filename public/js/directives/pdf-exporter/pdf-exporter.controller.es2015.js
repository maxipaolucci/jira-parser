export default class PdfExporterCtrl {

  constructor($scope) {
    this.pdfDocDef = null;
    this.tasksArray = [];
    this.$scope = $scope;
    this.logedIn = false;

    this.$scope.$watch('logedIn', (newValue, oldValue) => {
      this.logedIn = eval(newValue);
    });

    this.$scope.$watch('tasks', (newValue, oldValue) => {
      this.pdfDocDef = null;
      this.tasksArray = JSON.parse(newValue);
    });

    this.$scope.$watchGroup(['taskColor', 'subtaskColor'], (newValue, oldValue) => {
      //whenever tasks colors changes then regenerate the doc def with new colors
      this.pdfDocDef = null;
    });
  }

  /**
   * Handles openPdf btn
   */
  openPdf() {
    if (!this.pdfDocDef) {
      this._generatesPdfDefinition();
    }
    pdfMake.createPdf(this.pdfDocDef).open();
  };

  /**
   * Handles printPdf btn
   */
  printPdf() {
    if (!this.pdfDocDef) {
      this._generatesPdfDefinition();
    }
    pdfMake.createPdf(this.pdfDocDef).print();
  };

  /**
   * Handles savePdf btn
   */
  downloadPdf() {
    if (!this.pdfDocDef) {
      this._generatesPdfDefinition();
    }
    pdfMake.createPdf(this.pdfDocDef).download('tasks.pdf');
  };

  /**
   * Generates a pdf definition for the tasks in the vm.tasksArrays array and cache the result in vm.pdfDocDef
   */
  _generatesPdfDefinition() {
    const TASK_TABLE_WIDTH = 320;
    const SUBTASK_TABLE_WIDTH = 200;

    let pdfTasksDocDef = [];
    angular.forEach(this.tasksArray, (task) => {
      //Create PDF definition for Task
      pdfTasksDocDef.push(this._generateTaskDocDef(task, null, 'task', TASK_TABLE_WIDTH));

      //Create PDF definition foreach subtask of the previous task
      if (task.fields.subtasks) {
        for (let i = 0; i < task.fields.subtasks.length; i += 2) {
          let subtask = task.fields.subtasks[i];
          let subtask2 = i + 1 < task.fields.subtasks.length ? task.fields.subtasks[i + 1] : null;

          let pdfSubTaskDocDef = {
            columns: [this._generateTaskDocDef(subtask, task, 'subtask', SUBTASK_TABLE_WIDTH)]
          };

          if (subtask2) {
            pdfSubTaskDocDef.columns.push(this._generateTaskDocDef(subtask2, task, 'subtask', SUBTASK_TABLE_WIDTH));
          }

          pdfTasksDocDef.push(pdfSubTaskDocDef);
        }
      }
    });

    this.pdfDocDef = {
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
          fontSize: 22,
          color: '#fff',
          fillColor: '#' + this.$scope.taskColor
        },
        taskTableSummary: {
          fontSize: 20
        },
        taskTableFooter: {
          fontSize: 14,
          fillColor: '#efefef',
          alignment: 'right'
        },
        subtaskTableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 18,
          color: '#fff',
          fillColor: '#' + this.$scope.subtaskColor
        },
        subtaskTableSummary: {
          fontSize: 16,
          bold: true
        }
      }
    };
  }

  /**
   * Generates the doc definition to export tasks table to PDF
   * @param JSON task . The task to render
   * @param JSON parentTask . Null if this task has not got a parent, a json object(the parent task) if it is a subtask.
   * @param String type . This could be 'task' or 'subtask' representing the type of task to render
   * @param int tableWidth . The width of the table in px
   * @returns {{style: string, table: {widths: number[], body: *[]}}}
   */
  _generateTaskDocDef(task, parentTask, type, tableWidth) {
    let key = parentTask ? parentTask.key : task.key;
    let summary = parentTask ? `${task.key}: ${task.fields.summary}` : task.fields.summary;
    let body = [ [{text: key, style: `${type}TableHeader` }], [{text: summary, style: `${type}TableSummary` }] ];
    if (!parentTask && task.fields.issuetype.name == 'Story' && task.fields.customfield_10004) {
      body.push([{text: `${task.fields.customfield_10004} points`, style: `${type}TableFooter` }]);
    }


    return {
      style: 'taskTable',
      table: {
        widths: [tableWidth],
        body: body
      }
    };
  }

}