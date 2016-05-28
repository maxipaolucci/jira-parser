export default class MainCtrl {

  constructor($scope) {
    $scope.logedIn = false;
    $scope.jiraUser = '';
    $scope.tasks = [];
  }
}