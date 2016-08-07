import PdfExporterCtrl from './pdf-exporter.controller.es2015';

export default class PdfExporter {
  constructor() {
    this.restrict = 'E';
    this.templateUrl = '/js/directives/pdf-exporter/pdf-exporter.html';
    this.controller = PdfExporterCtrl;
    this.controllerAs = 'pdfExporterCtrl';
    this.scope = {
      tasks : '@',
      taskColor : '@',
      subtaskColor : '@',
      bugColor : '@',
      epicColor : '@',
      logedIn : '@',
      hideFinishedSubtasks : '@'
    };
  }
}