export default class TaskFinderCtrl {

  constructor($scope, $log, $timeout, jiraIssueService) {
    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.logedIn = false;
    this.invalid = false; //set the flag to show error label for invalid ticket numbers
    this.invalidTicketIDs = []; //show the ids that does not match any jira issue
    this.hideFinishedSubtasks = false; //hide subtasks that are resolved or closed in stories.
    this.issueNumbers = '';
    this.taskColor = '1E90FF';
    this.subtaskColor = 'AC74FF';
    this.epicColor = 'FFB51F';
    this.bugColor = 'FF7E6B';


    this.$scope.$watch('logedIn', (newValue, oldValue) => {
      this.logedIn = eval(newValue);
    });
  }

  getCardConfig(task) {
    let cardType = task.fields.issuetype.name;
    let color = this.taskColor;
    let type = 'Story';

    switch (cardType.toLowerCase()) {
      case 'story':
        color = this.taskColor;
        type = 'Story';
        break;
      case 'sub-task':
        color = this.subtaskColor;
        type = 'Sub-task';
        break;
      case 'epic':
        type = 'Epic';
        color = this.epicColor;
        break;
      case 'bug':
        type = 'Bug';
        color = this.bugColor;
        break;
    }

    return { color, type };
  };

  /**
   * Calls the service that retrieve jira issues from JIRA and populates the array of tickets to
   * be print
   */
  findJiraIssues() {
    this.invalid = false;
    this.invalidTicketIDs = [];
    this.$scope.tasks = [];
    //TODO send grab this icon in the link fn and attach it to the scope
    let loadingIconTasks = angular.element('body').find('.loading-icon--task-finder');

    loadingIconTasks.show();

    let issueNumbers = this.issueNumbers.trim() ? this.issueNumbers.trim().split(',') : [];
    let issueServicesFinished = 0;

    if (issueNumbers.length) {
      angular.forEach(issueNumbers, (issueNumber) => {
        issueNumber = issueNumber.trim();
        this.jiraIssueService.getIssue(this.$scope.jiraUser, issueNumber).then((data) => {
          if (data.status == "success") {
            this.$scope.tasks.push(data);
          } else {
            this.invalidTicketIDs.push(issueNumber);
            this.$log.warn(`Cannot retrieve the issue data for id: ${issueNumber}`);
          }
        }, (error) => {
          this.invalidTicketIDs.push(issueNumber);
          this.$log.log(error);
        }).finally(() => {
          issueServicesFinished += 1;
          if (issueServicesFinished == issueNumbers.length) {
            loadingIconTasks.hide();
            if (this.invalidTicketIDs.length) {
              this.invalid = true;
            }
          }
        });
      });
    } else {
      this.invalid = true;
      loadingIconTasks.hide();
    }

  }

}