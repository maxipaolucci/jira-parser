'use strict';

angular.module('printjira').directive('loadingIcon', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/loading-icon/loading-icon.html',
    controller: function controller($scope) {}
  };
});