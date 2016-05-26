class LoadingIconCtrl {
  constructor($scope) {
    this.$scope = $scope;
  }
}

angular.module('printjira').directive('loadingIcon', () => {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/loading-icon/loading-icon.html',
    controller: LoadingIconCtrl
  };
});
