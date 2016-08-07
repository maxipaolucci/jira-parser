export default class PdfExporterCtrl {

  constructor($scope) {
    this.pdfDocDef = null;
    this.tasksArray = [];
    this.$scope = $scope;
    this.logedIn = false;
    this.hideFinishedSubtasks = false;

    this.$scope.$watch('logedIn', (newValue, oldValue) => {
      this.logedIn = eval(newValue);
    });

    this.$scope.$watch('hideFinishedSubtasks', (newValue, oldValue) => {
      this.pdfDocDef = null;
      this.hideFinishedSubtasks = eval(newValue);
    });

    this.$scope.$watch('tasks', (newValue, oldValue) => {
      this.pdfDocDef = null;
      this.tasksArray = JSON.parse(newValue);
    });

    this.$scope.$watchGroup(['taskColor', 'subtaskColor', 'bugColor', 'epicColor'], (newValue, oldValue) => {
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
    let pdfTasksDocDef = [];
    angular.forEach(this.tasksArray, (task) => {
      //Create PDF definition for Task
      pdfTasksDocDef.push(this._generateTaskDocDef(task, null));

      //Create PDF definition foreach subtask of the previous task
      if (task.fields.subtasks) {
        let pdfSubTaskPairDocDef = { columns: [] }; //each row in the page gonna contain 2 subtasks

        for (let i = 0; i < task.fields.subtasks.length; i++) {
          let subtask = task.fields.subtasks[i];

          if (pdfSubTaskPairDocDef.columns.length < 2) {
            if (this.hideFinishedSubtasks && (subtask.fields.status.name.toLowerCase() == 'resolved' || subtask.fields.status.name.toLowerCase() == 'closed')) {
              //do nothing (the task must be hidden because it status is resolver or closed and is selected hide finished subtasks option)
            } else {
              pdfSubTaskPairDocDef.columns.push(this._generateTaskDocDef(subtask, task));
            }
          }

          if (pdfSubTaskPairDocDef.columns.length == 2) {
            pdfTasksDocDef.push(pdfSubTaskPairDocDef);
            pdfSubTaskPairDocDef = { columns: [] }; //reset the pair object
          }
        }

        //whether after the loop execution there is one remaining task in the Pair then add it to the definition
        if (pdfSubTaskPairDocDef.columns.length) {
          pdfTasksDocDef.push(pdfSubTaskPairDocDef);
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
        epicTableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 22,
          color: '#fff',
          fillColor: '#' + this.$scope.epicColor
        },
        taskTableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 22,
          color: '#fff',
          fillColor: '#' + this.$scope.taskColor
        },
        subtaskTableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 18,
          color: '#fff',
          fillColor: '#' + this.$scope.subtaskColor
        },
        bugTableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 18,
          color: '#fff',
          fillColor: '#' + this.$scope.bugColor
        },
        taskTableSummary: {
          fontSize: 20
        },
        subtaskTableSummary: {
          fontSize: 16,
          bold: true
        },
        epicTableSummary: {
          fontSize: 20,
          bold: true
        },
        bugTableSummary: {
          fontSize: 16,
          bold: true
        },
        taskTableFooter: {
          fontSize: 14,
          fillColor: '#efefef',
          alignment: 'right'
        }
      }
    };
  }

  /**
   * Generates the doc definition to export tasks table to PDF
   * @param JSON task . The task to render
   * @param JSON parentTask . Null if this task has not got a parent, a json object(the parent task) if it is a subtask.
   * @returns {{style: string, table: {widths: number[], body: *[]}}}
   */
  _generateTaskDocDef(task, parentTask) {
    const TASK_TABLE_WIDTH = 320;
    const SUBTASK_TABLE_WIDTH = 200;
    const CARD_TYPE = {
      'Story' : {
        tableWidth : TASK_TABLE_WIDTH,
        stylePrefix: 'task',
        title: 'Story'
      },
      'Epic' : {
        tableWidth : TASK_TABLE_WIDTH,
        stylePrefix: 'epic',
        title: 'Epic'
      },
      'Sub-task' : {
        tableWidth : SUBTASK_TABLE_WIDTH,
        stylePrefix: 'subtask',
        title: 'Sub-task'
      },
      'Bug' : {
        tableWidth : SUBTASK_TABLE_WIDTH,
        stylePrefix: 'bug',
        title: 'Bug'
      }
    };

    let cardType = CARD_TYPE[task.fields.issuetype.name];
    let key = parentTask ? parentTask.key : task.key;
    let summary = parentTask ? `${task.key}: ${task.fields.summary}` : task.fields.summary;
    let body = [ [{text: `${cardType.title}: ${key}`, style: `${cardType.stylePrefix}TableHeader` }], [{text: summary, style: `${cardType.stylePrefix}TableSummary` }] ];

    if (!parentTask && cardType.stylePrefix == 'task' && task.fields.customfield_10004) {
      body.push([{text: `${task.fields.customfield_10004} points`, style: `${cardType.stylePrefix}TableFooter` }]);
    }

    return {
      style: 'taskTable',
      table: {
        widths: [cardType.tableWidth],
        body: body
      }
    };
  }

}