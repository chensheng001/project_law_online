/**
 * Created by xieiqng on 2017/6/23.
 */
lawApp = angular.module('fxOnline', ['ionic']);

// 验证码指令
lawApp.directive('checkcode', function ($interval) {
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        template: '<button class="button button-balanced button-block button-small" ng-disabled="disable">{{content}}</button>',
        link: function (scope, elements, attrs) {
            var time = 60;
            scope.content = '验证码';
            elements.bind('click', function () {
                scope.getCode().then(function (res) {
                    if (res > 0) {
                        scope.disable = true
                        scope.content = time
                        var timer = $interval(timercallback, 1000)
                    }
                    function timercallback() {
                        if (time > 0) {
                            time--
                            scope.disable = true
                            scope.content = time
                        }
                        else {
                            scope.disable = false
                            scope.content = '验证码'
                            $interval.cancel(timer);
                            return time = 60
                        }
                    }
                })


            })
        }
    }
});

lawApp.controller('MyCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
})
    //用户查询
    .controller('queryUserCtrl', function ($rootScope, $scope, $ionicModal, $state) {

    })

    //用户查询
    .controller('fxOfficialCtrl', function ($rootScope, $scope, $ionicModal, $state) {

    })
;




