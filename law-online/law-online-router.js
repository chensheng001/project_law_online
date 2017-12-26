/**
 * Created by xieiqng on 2017/6/23.
 */
angular.module('lawOnline')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            // 个人中心（个人）
            .state('personalCenter', {
                url: '/personalCenter',
                views: {
                    'main': {
                        template: '<ion-nav-view name="pc"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 个人中心列表
            .state('personalCenter.index', {
                url: '/index',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/personal-center.html',
                        controller: 'personalCenter'
                    }
                }
            })
            // 加入律师
            .state('personalCenter.applyJoinLawyer', {
                url: '/applyJoinLawyer',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/applyJoinLawyer.html',
                        controller: 'personalCenter'
                    }
                }
            })
            // 企业机构认证
            .state('personalCenter.orgIdentify', {
                url: '/orgIdentify',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/orgIdentify.html',
                        controller: 'personalCenter'
                    }
                }
            })
            // 充值
            .state('personalCenter.recharge', {
                url: '/recharge',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/recharge.html',
                        controller: 'personalCenter'
                    }
                }
            })
            // 积分商城
            .state('personalCenter.scoreMail', {
                url: '/scoreMail',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/scoreMail.html',
                        controller: 'personalCenter'
                    }
                }
            })
            //我的信息
            .state('personalCenter.myInformation', {
                url: '/myInformation',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/my-information/form.html',
                        controller: 'personalCenter'
                    }
                }
            })
            //我的订单
            .state('myOrder', {
                url: '/myOrder',
                views: {
                    'main': {
                        template: '<ion-nav-view name="myOrder"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('myOrder.index', {
                url: '/index',
                views: {
                    'myOrder': {
                        templateUrl: 'personal-center/my-orders/list.html',
                        controller: 'myOrder'
                    }
                }
            })
            .state('myOrder.details', {
                url: '/details',
                views: {
                    'myOrder': {
                        templateUrl: 'personal-center/my-orders/details.html',
                        controller: 'myOrder'
                    }
                }
            })
            .state('myOrder.judge', {
                url: '/judge',
                views: {
                    'myOrder': {
                        templateUrl: 'personal-center/my-orders/serviceJudge.html',
                        controller: 'myOrder'
                    }
                }
            })

            //我的会员套餐
            .state('myVipPackage', {
                url: '/myVipPackage',
                views: {
                    'main': {
                        template: '<ion-nav-view name="myVipPackage"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('myVipPackage.index', {
                url: '/index',
                views: {
                    'myVipPackage': {
                        templateUrl: 'personal-center/my-vipPackage/list.html',
                        controller: 'myVipPackage'
                    }
                }
            })
            .state('myVipPackage.details', {
                url: '/details',
                views: {
                    'myVipPackage': {
                        templateUrl: 'personal-center/my-vipPackage/details.html',
                        controller: 'myVipPackage'
                    }
                }
            })

            //我的诉讼
            .state('myLawsuit', {
                url: '/myLawsuit',
                views: {
                    'main': {
                        template: '<ion-nav-view name="myLawsuit"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('myLawsuit.index', {
                url: '/index',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/list.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.details', {
                url: '/details',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/details.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.reply', {
                url: '/reply',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/consultReply.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.consignPay', {
                url: '/consignPay',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/consignPay.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.suitProgress', {
                url: '/suitProgress',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/suitProgress.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.myData', {
                url: '/myData',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/myData.html',
                        controller: 'myLawsuit'
                    }
                }
            })
            .state('myLawsuit.lawyerData', {
                url: '/lawyerData',
                views: {
                    'myLawsuit': {
                        templateUrl: 'personal-center/my-lawsuit/lawyerData.html',
                        controller: 'myLawsuit'
                    }
                }
            })




            // 最新资讯
            .state('latestInformation', {
                url: '/latestInformation',
                views: {
                    'main': {
                        template: '<ion-nav-view name="latestInformation"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('latestInformation.index', {
                url: '/index',
                views: {
                    'latestInformation': {
                        templateUrl: 'latestInformation/list.html',
                        controller: 'latestInformation'
                    }
                }
            })
            // 详情
            .state('latestInformation.details', {
                url: '/details',
                views: {
                    'latestInformation': {
                        templateUrl: 'latestInformation/details.html',
                        controller: 'latestInformation'
                    }
                }
            })





            // 登录（个人）
            .state('personalCenter.personalLogin', {
                url: '/personalLogin',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/personallogin/personal-login.html',
                        controller: 'personalLogin'
                    }
                }
            })

            // 注册（个人）
            .state('personalCenter.personalRegist', {
                url: '/personalRegist',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/personalregist/personalregist.html',
                        controller: 'personalRegist'
                    }
                }
            })

            // 我听过的问题（个人）
            .state('personalCenter.heardIssue', {
                url: '/heardIssue',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/heard-issue/heard-issue.html',
                        controller: 'heardIssue'
                    }
                }
            })
            // 案件列表（个人）
            .state('personalCenter.caseList', {
                url: '/caseList',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/case-list/case-list.html',
                        controller: 'caseList'
                    }
                }
            })
            // 关于平台（个人）
            .state('personalCenter.aboutPlatform', {
                url: '/aboutPlatform',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/about-platform/about-platform.html',
                        controller: 'aboutPlatform'
                    }
                }
            })
            // 设置（个人）
            .state('personalCenter.setting', {
                url: '/setting',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/setting/setting.html',
                        controller: 'personalSetting'
                    }
                }
            })



            // 个人中心
            //
            // 律师
            .state('lawyerCenter', {
                url: '/lawyerCenter',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lc"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 登录（律师）
            .state('lawyerCenter.login', {
                url: '/lawyerLogin',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/personallogin/personal-login.html',
                        controller: 'lawyerLogin'
                    }
                }
            })
            // 注册（律师）
            .state('lawyerCenter.regist', {
                url: '/lawyerRegist',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/personalregist/personalregist.html',
                        controller: 'lawyerRegist'
                    }
                }
            })
            // 我的个人中心（律师）
            .state('lawyerCenter.centerList', {
                url: '/centerList',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/lawyer-center.html',
                        controller: 'lawyerCenter'
                    }
                }
            })
            // 我的资料（律师）
            .state('lawyerCenter.myInfo', {
                url: '/myInfo',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/my-information/my-information.html',
                        controller:'lawyerInfo'
                    }
                }
            })
            // 过往案例（律师）
            .state('lawyerCenter.pastCase', {
                url: '/pastCase',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/pastCase/pastCase.html',
                        controller: 'lawyerPastCase'
                    }
                }
            })
            // 我的订单（律师）
            .state('lawyerCenter.lawyerOrders', {
                url: '/orders',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/my-orders/my-orders.html',
                        controller: 'lawyerOrders'
                    }
                }
            })
            // 我的钱包（律师）
            .state('lawyerCenter.myWallet', {
                url: '/myWallet',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/my-wallet/my-wallet.html',
                        controller: 'myWallet'
                    }
                }
            })
            .state('lawyerCenter.caseList', {
                url: '/caseList',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/case-list/case-list.html',
                        controller: 'lawyerCaseList'
                    }
                }
            })
            // 我的代办（律师）
            .state('lawyerCenter.lawyerAgency', {
                url: '/lawyerAgency',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/my-agency/my-orders.html',
                        controller: 'lawyerAgency'
                    }
                }
            })
            // 关于平台（律师）
            .state('lawyerCenter.aboutPlatform', {
                url: '/aboutPlatform',
                views: {
                    'lc': {
                        templateUrl: 'personal-center/about-platform/about-platform.html',
                        controller: 'lawyerAboutPlatform'
                    }
                }
            })
            // 设置（律师）
            .state('lawyerCenter.setting', {
                url: '/setting',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/setting/setting.html',
                        controller:'lawyerSetting'
                    }
                }
            })

            // 个人中心结束


            // 预约咨询模块
            .state('consult', {
                url: '/consult',
                views: {
                    'main': {
                        template: '<ion-nav-view name="consult"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 预约咨询主页面
            .state('consult.index', {
                url: '/index',
                views: {
                    'consult': {
                        templateUrl: 'consult/consult.html',
                        controller: 'consultIndex'
                    },
                }
            })
            // 律师详情
            .state('consult.details', {
                url: '/index/:id',
                views: {
                    'consult': {
                        templateUrl: 'consult/consult-details/consult-details.html',
                        controller: 'consultDetails'
                    }

                }
            })
            // 过往案例列表
            .state('consult.pastCaseList', {
                url: '/pastCaseList/:id',
                views: {
                    'consult': {
                        templateUrl: 'consult/past-case-list/past-case-list.html',
                        controller: 'pastCaseList'
                    }
                }
            })
            // 预约咨询模块结束


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

            // 产品服务模块开始
            .state('proService', {
                url: '/proService',
                views: {
                    'main': {
                        template: '<ion-nav-view name="product"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 产品服务
            .state('proService.menu', {
                url: '/menu',
                views: {
                    'product': {
                        templateUrl: 'product-service/download-menu.html',
                        controller: 'proServiceMenu'
                    }
                }
            })
            // 合同下载
            .state('proService.download', {
                url: '/download',
                views: {
                    'product': {
                        templateUrl: 'product-service/download/download.html',
                        controller: 'download'
                    }
                }
            })
            // 产品服务
            .state('proService.product', {
                url: '/product/:id',
                views: {
                    'product': {
                        templateUrl: 'product-service/product/product-detail.html',
                        controller: 'productDetail'
                    }
                }
            })

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


            // 委托代办
            .state('concierge', {
                url: '/concierge',
                views: {
                    'main': {
                        template: '<ion-nav-view name="concierge"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('concierge.list', {
                url: '/list',
                views: {
                    'concierge': {
                        templateUrl: 'concierge/concierge.html',
                        controller: 'concierge'
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
            .state('aboutUs.contribution', {
                url: '/contribution',
                views: {
                    'about': {
                        templateUrl: 'about-us/contribution.html',
                    }
                }
            })
            .state('aboutUs.spread', {
                url: '/spread',
                views: {
                    'about': {
                        templateUrl: 'about-us/spread.html',
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

    });