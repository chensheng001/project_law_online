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
            .state('queryUser.login', {
                url: '/login',
                views: {
                    'queryUser': {
                        templateUrl: 'query-user/login.html',
                        controller: 'queryUserCtrl'
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
                        templateUrl: 'fxOfficial/login.html',
                        controller: 'fxOfficialCtrl'
                    }
                }
            })
            .state('fxOfficial.homepage', {
                url: '/homepage',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/homepage.html',
                        controller: 'homepageCtrl'
                    }
                }
            })
            /*丰信办公--日常管理*/
            .state('fxOfficial.calendaring', {
                url: '/calendaring',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/calendaring.html',
                        controller: 'calendaringCtrl'
                    }
                }
            })
            .state('fxOfficial.calendaringInfo', {
                url: '/calendaringInfo',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/calendaringInfo.html',
                        controller: 'calendaringInfoCtrl'
                    }
                }
            })
            .state('fxOfficial.meetingSummary', {
                url: '/meetingSummary',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/meeting-summary.html',
                        controller: 'meetingSummaryCtrl'
                    }
                }
            })
            .state('fxOfficial.addMeetingSummary', {
                url: '/addMeetingSummary',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/meeting-summary-add.html',
                        controller: 'addMeetingSummaryCtrl'
                    }
                }
            })
            .state('fxOfficial.meetingSummaryInfo', {
                url: '/meetingSummaryInfo',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/meeting-summary-info.html',
                        controller: 'meetingSummaryInfoCtrl'
                    }
                }
            })

            .state('fxOfficial.companySeal', {
                url: '/companySeal',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/company-seal.html',
                        controller: 'companySealCtrl'
                    }
                }
            })
            .state('fxOfficial.addCompanySeal', {
                url: '/addCompanySeal',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/company-seal-add.html',
                        controller: 'addCompanySealCtrl'
                    }
                }
            })
            .state('fxOfficial.companySealInfo', {
                url: '/companySealInfo',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/company-seal-info.html',
                        controller: 'acompanySealInfoCtrl'
                    }
                }
            })

            .state('fxOfficial.customer', {
                url: '/customer',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/customer.html',
                        controller: 'customerCtrl'
                    }
                }
            })
            .state('fxOfficial.customerInfo', {
                url: '/customerInfo',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/customer-info.html',
                        controller: 'customerInfoCtrl'
                    }
                }
            })
            .state('fxOfficial.addCustomerInfo', {
                url: '/addCustomerInfo',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/daily-management/customer-add.html',
                        controller: 'addCustomerInfoCtrl'
                    }
                }
            })

            /*丰信办公--档案管理-非诉建档*/
            .state('fxOfficial.unLawFile', {
                url: '/unLawFile',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/unLawFile.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('fxOfficial.unLawFileDetails', {
                url: '/unLawFileDetails',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/details.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('unLawFile', {
                url: '/unLawFile',
                views: {
                    'main': {
                        template: '<ion-nav-view name="unLawFile"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('unLawFile.communication', {
                url: '/communication',
                views: {
                    'unLawFile': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/communication.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('unLawFile.caseSpeed', {
                url: '/caseSpeed',
                views: {
                    'unLawFile': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/caseSpeed.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('unLawFile.addCaseSpeed', {
                url: '/addCaseSpeed',
                views: {
                    'unLawFile': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/addCaseSpeed.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('unLawFile.relateData', {
                url: '/relateData',
                views: {
                    'unLawFile': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/relateData.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            .state('unLawFile.principalCommunication', {
                url: '/principalCommunication',
                views: {
                    'unLawFile': {
                        templateUrl: 'fxOfficial/file-management/unLawFile/principalCommunication.html',
                        controller: 'unLawFileCtrl'
                    }
                }
            })
            /*丰信办公--档案管理-非诉审核*/
            .state('fxOfficial.unLawCheck', {
                url: '/unLawCheck',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/unLawCheck.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            .state('fxOfficial.unLawCheckDetails', {
                url: '/unLawCheckDetails',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/details.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            .state('unLawCheck', {
                url: '/unLawCheck',
                views: {
                    'main': {
                        template: '<ion-nav-view name="unLawCheck"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('unLawCheck.communication', {
                url: '/communication',
                views: {
                    'unLawCheck': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/communication.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            .state('unLawCheck.caseSpeed', {
                url: '/caseSpeed',
                views: {
                    'unLawCheck': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/caseSpeed.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            .state('unLawCheck.addCaseSpeed', {
                url: '/addCaseSpeed',
                views: {
                    'unLawCheck': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/addCaseSpeed.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            .state('unLawCheck.relateData', {
                url: '/relateData',
                views: {
                    'unLawCheck': {
                        templateUrl: 'fxOfficial/file-management/unLawCheck/relateData.html',
                        controller: 'unLawCheckCtrl'
                    }
                }
            })
            /*丰信办公--档案管理-诉讼建档*/
            .state('fxOfficial.lawFile', {
                url: '/lawFile',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/lawFile/lawFile.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('fxOfficial.lawFileDetails', {
                url: '/lawFileDetails',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/lawFile/details.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('lawFile', {
                url: '/lawFile',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lawFile"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('lawFile.communication', {
                url: '/communication',
                views: {
                    'lawFile': {
                        templateUrl: 'fxOfficial/file-management/lawFile/communication.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('lawFile.caseSpeed', {
                url: '/caseSpeed',
                views: {
                    'lawFile': {
                        templateUrl: 'fxOfficial/file-management/lawFile/caseSpeed.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('lawFile.addCaseSpeed', {
                url: '/addCaseSpeed',
                views: {
                    'lawFile': {
                        templateUrl: 'fxOfficial/file-management/lawFile/addCaseSpeed.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('lawFile.relateData', {
                url: '/relateData',
                views: {
                    'lawFile': {
                        templateUrl: 'fxOfficial/file-management/lawFile/relateData.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            .state('lawFile.uploadLawCase', {
                url: '/uploadLawCase',
                views: {
                    'lawFile': {
                        templateUrl: 'fxOfficial/file-management/lawFile/uploadLawCase.html',
                        controller: 'lawFileCtrl'
                    }
                }
            })
            /*丰信办公--档案管理-诉讼审核*/
            .state('fxOfficial.lawCheck', {
                url: '/lawCheck',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/lawCheck.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            .state('fxOfficial.lawCheckDetails', {
                url: '/lawCheckDetails',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/details.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            .state('lawCheck', {
                url: '/lawCheck',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lawCheck"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('lawCheck.communication', {
                url: '/communication',
                views: {
                    'lawCheck': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/communication.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            .state('lawCheck.caseSpeed', {
                url: '/caseSpeed',
                views: {
                    'lawCheck': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/caseSpeed.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            .state('lawCheck.addCaseSpeed', {
                url: '/addCaseSpeed',
                views: {
                    'lawCheck': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/addCaseSpeed.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            .state('lawCheck.relateData', {
                url: '/relateData',
                views: {
                    'lawCheck': {
                        templateUrl: 'fxOfficial/file-management/lawCheck/relateData.html',
                        controller: 'lawCheckCtrl'
                    }
                }
            })
            /*丰信办公--档案管理-档案大事记*/
            .state('fxOfficial.fileMemorabilia', {
                url: '/fileMemorabilia',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/fileMemorabilia/index.html',
                        controller: 'fileMemorabiliaCtrl'
                    }
                }
            })
            .state('fileMemorabilia', {
                url: '/fileMemorabilia',
                views: {
                    'fxOfficial': {
                        template: '<ion-nav-view name="fileMemorabilia"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('fileMemorabilia.details', {
                url: '/details',
                views: {
                    'fxOfficial': {
                        templateUrl: 'fxOfficial/file-management/fileMemorabilia/details.html',
                        controller: 'fileMemorabiliaCtrl'
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