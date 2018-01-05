/**
 * Created by xieiqng on 2017/6/23.
 */
angular.module('fxOnline')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider

            // 用户查询
            .state('queryUser', {
                url: '/queryUser',
                views: {
                    'main': {
                        template: '<ion-nav-view name="queryUser"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('queryUser.index', {
                url: '/index',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/index.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })

            //详情
            .state('queryUser.details', {
                url: '/details',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/details.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })
            //通知交流
            .state('queryUser.communication', {
                url: '/communication',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/communication.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })
            //办案进展
            .state('queryUser.caseSpeed', {
                url: '/caseSpeed',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/caseSpeed.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })
            //添加进展
            .state('queryUser.addCaseSpeed', {
                url: '/addCaseSpeed',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/addCaseSpeed.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })
            //相关资料
            .state('queryUser.relateData', {
                url: '/relateData',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/relateData.html',
                        controller: 'queryUserCtrl'
                    }
                }
            })

            // 丰信办公
            .state('fxOfficial', {
                url: '/fxOfficial',
                views: {
                    'main': {
                        template: '<ion-nav-view name="fxOfficial"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('fxOfficial.index', {
                url: '/index',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/index.html',
                        controller: 'fxOfficialCtrl'
                    }
                }
            })

            // 关于我们
            .state('aboutUs', {
                url: '/aboutUs',
                views: {
                    'main': {
                        template: '<ion-nav-view name="about"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('aboutUs.about', {
                url: '/about',
                views: {
                    'about': {
                        templateUrl: 'about-us/about-us.html',
                    }
                }
            })

            // 投稿合作
            .state('contribution', {
                url: '/contribution',
                views: {
                    'main': {
                        template: '<ion-nav-view name="contribution"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('contribution.index', {
                url: '/index',
                views: {
                    'contribution': {
                        templateUrl: 'about-us/contribution.html',
                    }
                }
            })

    });