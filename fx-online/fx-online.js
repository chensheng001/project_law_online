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

lawApp.controller('MyCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal,$state) {
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
    $scope.jump=function(e){
        $state.go(e);
    }

})
    //用户查询
    .controller('queryUserCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.login=function(){
            $state.go("queryUser.index");
        }
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
    })

    //封信办公 登录页
    .controller('fxOfficialCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.login=function(){
            $state.go("fxOfficial.homepage");
        }
    })
    //封信办公 主页
    .controller('homepageCtrl', function ($rootScope, $scope, $ionicModal, $state) {})

    .controller('calendaringCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('calendaringInfoCtrl', function ($rootScope, $scope, $ionicModal, $state) {})

    .controller('meetingSummaryCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('addMeetingSummaryCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('meetingSummaryInfoCtrl', function ($rootScope, $scope, $ionicModal, $state) {})

    .controller('companySealCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('addCompanySealCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('acompanySealInfoCtrl', function ($rootScope, $scope, $ionicModal, $state) {})

    .controller('customerCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('customerInfoCtrl', function ($rootScope, $scope, $ionicModal, $state) {})
    .controller('addCustomerInfoCtrl', function ($rootScope, $scope, $ionicModal, $state) {})

    //档案管理
    //非诉建档
    .controller('unLawFileCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
    })
    //非诉审核
    .controller('unLawCheckCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
    })
    //诉讼建档
    .controller('lawFileCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
        $scope.cases=[{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"},{title:"案件已经结束了" +
        "",content:"gg"}];
        $scope.getDetails=function(){
            $state.go("lawFile.fileMemorabiliaDetails");
        }
        $scope.list=["sss","ssszz",'dddd'];
        $scope.item={
            title:"标题",
            type:"dddd",
            content:"水利水电流水的"
        }
    })
    //诉讼审核
    .controller('lawCheckCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
    })
    //档案大事记
    .controller('fileMemorabiliaCtrl', function ($rootScope, $scope, $ionicModal, $state) {
        $scope.cases=[{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"},{title:"案件已经结束了" +
        "",content:"gg"}];
        $scope.getDetails=function(){
            $state.go("fileMemorabilia.details");
        }
    })
;




