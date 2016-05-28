export default class TaskFinderCtrl {

  constructor($scope, $log, $timeout, jiraIssueService) {
    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.logedIn = false;
    this.issueNumbers = 'ATG-5971';
    this.taskColor = '1E90FF';
    this.subtaskColor = 'AC74FF';

    this.$scope.$watch('logedIn', (newValue, oldValue) => {
      this.logedIn = eval(newValue);
    });

    this.initializeColorPickers();
  }

  initializeColorPickers() {
    let taskColorPicker = angular.element('body').find('.task-color').get(0);
    let subtaskColorPicker = angular.element('body').find('.subtask-color').get(0);

    new jscolor(taskColorPicker);
    new jscolor(subtaskColorPicker);
  }

  /**
   * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
   * be print
   */
  findJiraIssues() {
    this.$scope.tasks = [];
    let loadingIconTasks = angular.element('body').find('.loading-icon--tasks');

    loadingIconTasks.show();

    let issueNumbers = this.issueNumbers.split(',');
    let issueServicesFinished = 0;

    angular.forEach(issueNumbers, (issueNumber) => {
      issueNumber = issueNumber.trim();
      this.jiraIssueService.getIssue(this.$scope.jiraUser, issueNumber).then((data) => {
        if (data.status == "success") {
          this.$scope.tasks.push(data);
        } else {
          this.$log.warn(`Cannot retrieve the issue data for id: ${issueNumber}`);
        }
      }, (error) => {
        this.$log.log(error);
      }).finally(() => {
        issueServicesFinished += 1;
        if (issueServicesFinished == issueNumbers.length) {
          loadingIconTasks.hide();
        }
      });
    });
  }

}