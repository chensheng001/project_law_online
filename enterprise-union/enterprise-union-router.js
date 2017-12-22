/**
 * Created by xieiqng on 2017/6/23.
 */
angular.module('becomeMember')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/memberCenter/index');
        $stateProvider
        // 成为会员
            .state('becomeMember', {
                url: '/becomeMember',
                views: {
                    'main': {
                        templateUrl: './become-member/become-member.html',
                        controller: 'becomeMemberCtrl'
                    }
                }
            })
            // 个人会员注册
            .state('personalRegister', {
                url: '/personalRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/persen-member.html',
                        controller: 'personalRegister'
                    }
                }
            })
            // 企业体验会员注册
            .state('experienceRegister', {
                url: '/experienceRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/experience-member.html',
                        controller: 'experienceRegister'
                    }
                }
            })
            // 基础企业会员
            .state('basicsRegister', {
                url: '/basicsRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/basics-member.html',
                        controller: 'basicsRegister'
                    }
                }
            })
            // VIP顾问会员
            .state('vipRegister', {
                url: '/vipRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/vip-member.html',
                        controller: 'vipRegister'
                    }
                }
            })
            // 顾问会员
            .state('adviserRegister', {
                url: '/adviserRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/adviser-member.html',
                        controller: 'adviserRegister'
                    }
                }
            })
            // 机构服务会员
            .state('mechanismRegister', {
                url: '/mechanismRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/mechanism-service-member.html',
                        controller: 'mechanismRegister'
                    }
                }
            })
            // 律师会员
            .state('lawyerRegister', {
                url: '/lawyerRegister',
                views: {
                    'main': {
                        templateUrl: './become-member/popover/lawy-member.html',
                        controller: 'lawyerRegister'
                    }
                }
            })
            // 会员登录
            .state('memberLogin', {
                url: '/memberLogin',
                views: {
                    'main': {
                        templateUrl: './member-login/login.html',
                        cache:false,
                        controller: 'memberLogin'
                    }
                }
            })
            // 会员中心
            // 抽象
            .state('memberCenter', {
                url: '/memberCenter',
                views: {
                    'main': {
                        template: '<ion-nav-view name="memberCenter"> </ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 会员中心index
            .state('memberCenter.index', {
                url: '/index',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/member-center.html',
                        cache:false,
                        controller: 'memberCenter'
                    }
                }
            })
            // 我的资料
            .state('memberCenter.myInfo', {
                url: '/myInfo',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/myInfo/myInfo.html',
                        controller: 'memberMyInfo'
                    }
                }
            })
            // 服务大全
            .state('memberCenter.allService', {
                url: '/allService',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/allService.html',
                        controller: 'allServiceCtrl'
                    }
                }
            })
            // 提问咨询
            .state('memberCenter.questionsConsult', {
                url: '/questionsConsult',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/questions-consult.html',
                        controller: 'questionsConsult'
                    }
                }
            })
            // 电话咨询
            .state('memberCenter.phoneConsult', {
                url: '/phoneConsult',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/phone-consult.html',
                        controller: 'phoneConsult'
                    }
                }
            })
            // 预约会面
            .state('memberCenter.appointmentMeetting', {
                url: '/appointmentMeetting',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/appointment-meetting.html',
                        controller: 'appointmentMeetting'
                    }
                }
            })
            // 合同下载
            .state('memberCenter.download', {
                url: '/download',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/download.html',
                        controller: 'downloadCtrl'
                    }
                }
            })
            // 合同起草
            .state('memberCenter.draftContract', {
                url: '/draftContract',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/draft-contract.html',
                        controller: 'draftContract'
                    }
                }
            })
            // 合同审核
            .state('memberCenter.checkContract', {
                url: '/checkContract',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/check-contract.html',
                        controller: 'checkContract'
                    }
                }
            })
            // 风险体检
            .state('memberCenter.checkWind', {
                url: '/checkWind',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/check-wind.html',
                        controller: 'checkWind'
                    }
                }
            })
            // 通用服务
            .state('memberCenter.normalService', {
                url: '/normalService/:id',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/allService/normal-service.html',
                        controller: 'normalService'
                    }
                }
            })
            // 案件列表（个人）
            .state('memberCenter.caseList', {
                url: '/caseList',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/case-list/case-list.html',
                        controller: 'caseListCtrl'
                    }
                }
            })
            // 我的订单（个人）
            .state('memberCenter.myOrders', {
                url: '/myOrders',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/my-orders/my-orders.html',
                        controller: 'myOrdersCtrl'
                    }
                }
            })
            // 我听过的问题（个人）
            .state('memberCenter.heardIssue', {
                url: '/heardIssue',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/heard-issue/heard-issue.html',
                        controller: 'heardIssueCtrl'
                    }
                }
            })

            // 我的个人律师
            .state('memberCenter.myLawyer', {
                url: '/myLawyer',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/myLawyer/my-Lawyer.html',
                        controller: 'myLawyerCtrl'
                    }
                }
            })

            // 其他需求发布
            .state('memberCenter.demandRelease', {
                url: '/demandRelease',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/demand-release/demand-release.html',
                        controller: 'demandReleaseCtrl'
                    }
                }
            })
            // 发布需求
            .state('memberCenter.releaseFrom', {
                url: '/releaseFrom',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/demand-release/release-from.html',
                        controller: 'releaseFromCtrl'
                    }
                }
            })
            // 我对接的需求
            .state('memberCenter.myDocking', {
                url: '/myDocking',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/demand-release/my-docking.html',
                        controller: 'myDockingCtrl'
                    }
                }
            })
            // 需求对接详情
            .state('memberCenter.dockingDetails', {
                url: '/dockingDetails/:id',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/demand-release/docking-details.html',
                        controller: 'myDockingDetailCtrl'
                    }
                }
            })
            // 购买产品服务
            .state('memberCenter.buyProductService', {
                url: '/buyProductService',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/buy-product-service/buy-product-service.html',
                        controller: 'buyProductServiceCtrl'
                    }
                }
            })
            // 设置
            .state('memberCenter.setting', {
                url: '/setting',
                views: {
                    'memberCenter': {
                        templateUrl: './member-center/setting/setting.html',
                        controller: 'memberCenterSetting'
                    }
                }
            })
            // 律师会员中心
            // 抽象
            .state('lawyerCenter', {
                url: '/lawyerCenter',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lawyerCenter"> </ion-nav-view>',
                        // controller:'becomeMemberCtrl'
                        abstract: true
                    }
                }
            })

            /////////////////////////////////////////////////////////////
            // 会员中心index
            .state('lawyerCenter.index', {
                url: '/index',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/member-center.html',
                        cache:false,
                        controller:'lawyerCenterIndex'
                    }
                }
            })
            // 个人资料
            .state('lawyerCenter.myInfo', {
                url: '/myInfo',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/my-infomation/my-information.html',
                        controller:'lawyerMyInfo'
                    }
                }
            })
            // 案件列表（律师）
            .state('lawyerCenter.caseList', {
                url: '/caseList',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/case-list/case-list.html',
                        controller: 'lawyerCaseListCtrl'
                    }
                }
            })
            // 我的订单（律师）
            .state('lawyerCenter.myOrders', {
                url: '/myOrders',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/my-orders/my-orders.html',
                        controller: 'lawyerOrders'
                    }
                }
            })

            // 我的钱包（律师）
            .state('lawyerCenter.myWallet', {
                url: '/myWallet',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/my-wallet/my-wallet.html',
                        controller: 'myWalletCtrl'
                    }
                }
            })

            // 设置（律师）
            .state('lawyerCenter.setting', {
                url: '/setting',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/setting/setting.html',
                        controller: 'lawyerCenterSetting'
                    }
                }
            })

            // 委托代办
            .state('lawyerCenter.entrustList', {
                url: '/entrustList',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/entrust/entrust-list.html',
                        controller: 'entrustList'
                    }
                }
            })

            // 我的代办（律师）
            .state('lawyerCenter.lawyerEntrust', {
                url: '/lawyerEntrust',
                views: {
                    'lawyerCenter': {
                        templateUrl: './member-center-lawyer/entrust/lawyer-entrust/list.html',
                        controller: 'lawyerEntrust'
                    }
                }
            })
            /////////////////////////////////////


            // 精选分享

            .state('share', {
                url: '/share',
                views: {
                    'main': {
                        template: '<ion-nav-view name="share"></ion-nav-view>'
                    }
                }
            })
            // 日常法典
            .state('share.daily', {
                url: '/daily',
                views: {
                    'share': {
                        templateUrl: 'share/daily/daily.html',
                        controller: 'daily'
                    }
                }
            })
            // 法据观点
            .state('share.lawyerViewPoint', {
                url: '/lawyerViewPoint/:id',
                views: {
                    'share': {
                        templateUrl: 'share/lawyer-viewpoint/lawyer-viewpoint.html',
                        controller: 'lawyerViewPoint'
                    }
                }
            })

            // 分享模块结束


            // 查询助手模块开始
            .state('selectUtil', {
                url: '/selectUtil',
                views: {
                    'main': {
                        template: '<ion-nav-view name="select"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 产品服务
            .state('selectUtil.menu', {
                url: '/menu',
                views: {
                    'select': {
                        templateUrl: 'select-util/select-list.html',
                        controller: 'selectUtils'
                    }
                }
            })
            // 查询助手结束


            // 会员活动
            .state('memberAction', {
                url: '/memberAction',
                views: {
                    'main': {
                        template: '<ion-nav-view name="memberAction"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('memberAction.list', {
                url: '/list',
                views: {
                    'memberAction': {
                        templateUrl: './member-action/memberAction.html',
                        controller: 'memberActionCtrl'
                    }
                }
            })
            .state('memberAction.details', {
                url: '/details/:id',
                views: {
                    'memberAction': {
                        templateUrl: './member-action/member-details.html',
                        controller: 'memberActionDetailsCtrl'
                    }
                }
            })
            // 会员活动

            // 实名精英
            .state('elite', {
                url: '/elite',
                views: {
                    'main': {
                        template: '<ion-nav-view name="elite"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('elite.list', {
                url: '/list',
                views: {
                    'elite': {
                        templateUrl: './elite/eliteList.html',
                        controller: 'eliteCtrl'
                    }
                }
            })

            // 律宝查询
            .state('search', {
                url: '/search',
                views: {
                    'main': {
                        template: '<ion-nav-view name="searchAction"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('search.check', {
                url: '/check',
                views: {
                    'searchAction': {
                        templateUrl: './search/login.html',
                        controller: 'searchLogin'
                    }
                }
            })
            .state('search.list', {
                url: '/list',
                views: {
                    'searchAction': {
                        templateUrl: './search/list.html',
                        controller: 'searchList'
                    }
                }
            })
            .state('search.info', {
                url: '/info/:id/:type',
                views: {
                    'searchAction': {
                        templateUrl: './search/info.html',
                        controller: 'searchInfo'
                    }
                }
            })

    });