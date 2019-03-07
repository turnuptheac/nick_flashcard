angular.module('app')
.controller('RootCtrl', [
    '$scope',
    '$state',
    RootCtrl
    ]);

function RootCtrl($scope, $state) {
    $scope.state = $state;
}
