export default class TaskFinderCtrl {

  constructor($scope, $log, $timeout, jiraIssueService) {
    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.logedIn = false;
    this.issueNumbers = '';
    this.taskColor = '1E90FF';
    this.subtaskColor = 'AC74FF';

    this.$scope.$watch('logedIn', (newValue, oldValue) => {
      this.logedIn = eval(newValue);
    });
  }

  

  /**
   * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
   * be print
   */
  findJiraIssues() {
    this.$scope.tasks = [];
    //TODO send grab this icon in the link fn and attach it to the scope
    let loadingIconTasks = angular.element('body').find('.loading-icon--task-finder');

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