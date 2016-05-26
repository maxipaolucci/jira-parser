'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadingIconCtrl = function LoadingIconCtrl($scope) {
  _classCallCheck(this, LoadingIconCtrl);

  this.$scope = $scope;
};

angular.module('printjira').directive('loadingIcon', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/directives/loading-icon/loading-icon.html',
    controller: LoadingIconCtrl
  };
});