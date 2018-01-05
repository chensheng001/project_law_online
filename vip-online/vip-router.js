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
                        templateUrl: 'mutual-assistance-of-enterprises/commentEdit.html',
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
            .state('vip.lawVideoInfo',{
                url: '/lawVideoInfo',
                views: {
                    'pc': {
                        templateUrl: 'law-video/info.html',
                        controller: 'lawVideoInfoCtrl'
                    }
                }
            })
            .state('vip.lawVideoComment',{
                url: '/lawVideoComment',
                views: {
                    'pc': {
                        templateUrl: 'law-video/commentEdit.html',
                        controller: 'lawVideoCommentCtrl'
                    }
                }
            })

            // 会员论坛
            .state('vip.bbs',{
                url: '/bbs',
                views: {
                    'pc': {
                        templateUrl: 'vip-bbs/homepage.html',
                        controller: 'bbsCtrl'
                    }
                }
            })
            .state('vip.bbsList',{
                url: '/bbsList',
                views: {
                    'pc': {
                        templateUrl: 'vip-bbs/bbsList.html',
                        controller: 'bbsListCtrl'
                    }
                }
            })
            .state('vip.bbsListInfo',{
                url: '/bbsListInfo',
                views: {
                    'pc': {
                        templateUrl: 'vip-bbs/bbsListInfo.html',
                        controller: 'bbsListInfoCtrl'
                    }
                }
            })
            .state('vip.bbsListInfoComment',{
                url: '/bbsListInfoComment',
                views: {
                    'pc': {
                        templateUrl: 'vip-bbs/CommentEdit.html',
                        controller: 'bbsListInfoCommentCtrl'
                    }
                }
            })

            // 会员论坛 -个人中心
            .state('vip.bbsUserCenter',{
                url: '/bbsUserCenter',
                views: {
                    'pc': {
                        templateUrl: 'user-center/homepage.html',
                        controller: 'bbsUserCenterCtrl'
                    }
                }
            })
            .state('vip.bbsNewInfo',{
                url: '/bbsNewInfo',
                views: {
                    'pc': {
                        templateUrl: 'user-center/new-personal-information.html',
                        controller: 'bbsNewInfoCtrl'
                    }
                }
            })
            .state('vip.post',{
                url: '/post',
                views: {
                    'pc': {
                        templateUrl: 'user-center/post.html',
                        controller: 'postCtrl'
                    }
                }
            })
            .state('vip.myBbsList',{
                url: '/myBbsList',
                views: {
                    'pc': {
                        templateUrl: 'user-center/myBbsList.html',
                        controller: 'myBbsListCtrl'
                    }
                }
            })
            .state('vip.myBbsListInfo',{
                url: '/myBbsListInfo',
                views: {
                    'pc': {
                        templateUrl: 'user-center/myBbsListInfo.html',
                        controller: 'myBbsListInfoCtrl'
                    }
                }
            })
            .state('vip.myBbsListInfoComment',{
                url: '/myBbsListInfoComment',
                views: {
                    'pc': {
                        templateUrl: 'user-center/CommentEdit.html',
                        controller: 'myBbsListInfoCommentCtrl'
                    }
                }
            })






    });