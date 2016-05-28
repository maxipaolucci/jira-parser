export default class LoginCtrl {

  constructor($scope, $log, jiraIssueService) {
    this.jiraIssueService = jiraIssueService;
    this.$log = $log;
    this.$scope = $scope;
    this.jiraPass = ''; //passworrd is a local variable of this ocmponent, the user come in the scope
  }

  /**
   * Call the login service in the server sending login data to create a connection with jira in the
   * backend
   */
  login() {
    let loadingIconLogin = angular.element('body').find('.loading-icon--login');
    loadingIconLogin.show();

    this.jiraIssueService.login(this.$scope.jiraUser, this.jiraPass).then((data) => {
      if (data.status == 'success' && data.name == this.$scope.jiraUser) {
        this.$scope.logedIn = true;
      } else {
        this.$log.warn('Cannot login: the service return with an error or different username than the requested');
        this.$scope.logedIn = false;
      }
    }, (error) => {
      this.$log.error(error);
      this.$scope.logedIn = false;
    }).finally(() => {
      loadingIconLogin.hide();
    });
  }

  /**
   * Call the logout service in the server and disconnect the current session with jira server
   */
  logout() {
    this.jiraIssueService.logout(this.$scope.jiraUser).then((data) => {
      if (data.status == 'success') {
        //do something
      } else {
        this.$log.warn('Cannot logout properly, the response is not success');
      }
    }, (error) => {
      this.$log.error(error);
    }).finally(() => {
      this.jiraPass = '';
      this.$scope.jiraUser = '';
      this.$scope.logedIn = false;
      this.$scope.tasks = [];
    });
  }

}