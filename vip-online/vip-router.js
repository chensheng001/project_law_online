/**
 * Created by xieiqng on 2017/6/23.
 */
angular.module('vipApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            //会员在线
            .state('vip',{
                url: '/vip',
                views: {
                    'main': {
                        template: '<ion-nav-view name="pc"></ion-nav-view>',
                        abstract: true
                    }
                }
            })

            //企业互助
            .state('vip.enterpriseHelp',{
                url: '/enterpriseHelp',
                views: {
                    'pc': {
                        templateUrl: 'mutual-assistance-of-enterprises/homepage.html',
                        controller: 'enterpriseHelpCtrl'
                    }
                }
            })
            .state('vip.enterpriseHelpInfo',{
                url: '/enterpriseHelpInfo',
                views: {
                    'pc': {
                        templateUrl: 'mutual-assistance-of-enterprises/info.html',
                        controller: 'enterpriseHelpInfoCtrl'
                    }
                }
            })
            .state('vip.agentAccount',{
                url: '/agentAccount',
                views: {
                    'pc': {
                        templateUrl: 'mutual-assistance-of-enterprises/agentAccount.html',
                        controller: 'agentAccountCtrl'
                    }
                }
            })
            .state('vip.agentAccountEdit',{
                url: '/agentAccountEdit',
                views: {
                    'pc': {
                        templateUrl: 'mutual-assistance-of-enterprises/agentAccountEdit.html',
                        controller: 'agentAccountEditCtrl'
                    }
                }
            })

            //会员活动
            .state('vip.activity',{
                url: '/activityIndex',
                views: {
                    'pc': {
                        templateUrl: 'vip-activity/homepage.html',
                        controller: 'activityIndexCtrl'
                    }
                }
            })
            .state('vip.activityInfo',{
                url: '/activityInfo',
                views: {
                    'pc': {
                        templateUrl: 'vip-activity/info.html',
                        controller: 'activityInfoCtrl'
                    }
                }
            })

            // 普法视频
            .state('vip.lawVideo',{
                url: '/lawVideoIndex',
                views: {
                    'pc': {
                        templateUrl: 'law-video/homepage.html',
                        controller: 'lawVideoCtrl'
                    }
                }
            })


    });