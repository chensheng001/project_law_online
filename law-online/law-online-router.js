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
            //我的资料
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

            // 我听过的问题（个人）
            .state('heardIssue', {
                url: '/heardIssue',
                views: {
                    'main': {
                        template: '<ion-nav-view name="heardIssue"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('heardIssue.index', {
                url: '/index',
                views: {
                    'heardIssue': {
                        templateUrl: 'personal-center/heard-issue/heard-issue.html',
                        controller: 'heardIssue'
                    }
                }
            })
            .state('heardIssue.details', {
                url: '/details',
                views: {
                    'heardIssue': {
                        templateUrl: 'personal-center/heard-issue/heard-issue-details.html',
                        controller: 'heardIssue'
                    }
                }
            })
            //我观看过的视频
            .state('watchedIssue', {
                url: '/watchedIssue',
                views: {
                    'main': {
                        template: '<ion-nav-view name="watchedIssue"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('watchedIssue.index', {
                url: '/index',
                views: {
                    'watchedIssue': {
                        templateUrl: 'personal-center/watched-issue/list.html',
                        controller: 'watchedIssue'
                    }
                }
            })
            .state('watchedIssue.details', {
                url: '/details',
                views: {
                    'watchedIssue': {
                        templateUrl: 'personal-center/watched-issue/details.html',
                        controller: 'watchedIssue'
                    }
                }
            })
            .state('watchedIssue.comment', {
                url: '/comment',
                views: {
                    'watchedIssue': {
                        templateUrl: 'personal-center/watched-issue/commentEdit.html',
                        controller: 'watchedIssue'
                    }
                }
            })
            // 设置
            .state('personalCenter.setting', {
                url: '/setting',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/setting/setting.html',
                        controller: 'personalSetting'
                    }
                }
            })
            // 安全设置
            .state('personalCenter.safeSetting', {
                url: '/safeSetting',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/safeSetting/setting.html',
                        controller: 'personalSetting'
                    }
                }
            })
            // 绑定手机
            .state('personalCenter.bindPhone', {
                url: '/bindPhone',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/safeSetting/bindPhone.html',
                        controller: 'personalSetting'
                    }
                }
            })
            // 我的推荐
            .state('personalCenter.recommend', {
                url: '/recommend',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/recommend/recommend.html',
                        controller: 'myRecommend'
                    }
                }
            })
            // 我的钱包
            .state('personalCenter.myMoney', {
                url: '/myMoney',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myMoney/list.html',
                        controller: 'myMoney'
                    }
                }
            })
            // 我的提现
            .state('personalCenter.withdraw', {
                url: '/withdraw',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myMoney/withdraw.html',
                        controller: 'myMoney'
                    }
                }
            })

            // 我的企业互助
            .state('personalCenter.myEnterpriseHelp', {
                url: '/myEnterpriseHelp',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myEnterpriseHelp/index.html',
                        controller: 'myEnterpriseHelp'
                    }
                }
            })
            .state('personalCenter.applyAccess', {
                url: '/applyAccess',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myEnterpriseHelp/applyAccess.html',
                        controller: 'myEnterpriseHelp'
                    }
                }
            })
            // 产品列表
            .state('personalCenter.ProductList', {
                url: '/ProductList',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myEnterpriseHelp/ProductList.html',
                        controller: 'myEnterpriseHelp'
                    }
                }
            })
            // 产品详情
            .state('personalCenter.productDetails', {
                url: '/productDetails',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myEnterpriseHelp/productDetails.html',
                        controller: 'myEnterpriseHelp'
                    }
                }
            })
            // 添加产品
            .state('personalCenter.addProduct', {
                url: '/addProduct',
                views: {
                    'pc': {
                        templateUrl: 'personal-center/myEnterpriseHelp/addProduct.html',
                        controller: 'myEnterpriseHelp'
                    }
                }
            })



/*-------------------------------------------------------------------------*/

            // 个人中心（律师）
            .state('lawyerCenter', {
                url: '/lawyerCenter',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lc"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            // 个人中心列表
            .state('lawyerCenter.index', {
                url: '/index',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/lawyer-center.html',
                        controller: 'lawyerCenter'
                    }
                }
            })
            //我的主页
            .state('lawyerCenter.myHome', {
                url: '/myHome',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/my-home/index.html',
                        controller: 'lawyerCenter'
                    }
                }
            })
            //我的订单
            .state('lmyOrder', {
                url: '/lmyOrder',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lmyOrder"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('lmyOrder.index', {
                url: '/index',
                views: {
                    'lmyOrder': {
                        templateUrl: 'lawyer-center/my-orders/list.html',
                        controller: 'lmyOrder'
                    }
                }
            })
            .state('lmyOrder.details', {
                url: '/details',
                views: {
                    'lmyOrder': {
                        templateUrl: 'lawyer-center/my-orders/details.html',
                        controller: 'lmyOrder'
                    }
                }
            })
            //我的诉讼
            .state('lmyLawsuit', {
                url: '/lmyLawsuit',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lmyLawsuit"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('lmyLawsuit.index', {
                url: '/index',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/list.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.details', {
                url: '/details',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/details.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.reply', {
                url: '/reply',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/consultReply.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.consignPay', {
                url: '/consignPay',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/consignPay.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.suitProgress', {
                url: '/suitProgress',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/suitProgress.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.addSuitProgress', {
                url: '/addSuitProgress',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/commentEdit.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.myData', {
                url: '/myData',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/myData.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.uploadLawCase', {
                url: '/uploadLawCase',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/uploadLawCase.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            .state('lmyLawsuit.userData', {
                url: '/lawyerData',
                views: {
                    'lmyLawsuit': {
                        templateUrl: 'lawyer-center/my-lawsuit/userData.html',
                        controller: 'lmyLawsuit'
                    }
                }
            })
            //我的普法视频
            .state('lmyLawVideo', {
                url: '/lmyLawVideo',
                views: {
                    'main': {
                        template: '<ion-nav-view name="lmyLawVideo"></ion-nav-view>',
                        abstract: true
                    }
                }
            })
            .state('lmyLawVideo.index', {
                url: '/index',
                views: {
                    'lmyLawVideo': {
                        templateUrl: 'lawyer-center/myLaw-video/list.html',
                        controller: 'lmyLawVideo'
                    }
                }
            })
            .state('lmyLawVideo.details', {
                url: '/details',
                views: {
                    'lmyLawVideo': {
                        templateUrl: 'lawyer-center/myLaw-video/details.html',
                        controller: 'lmyLawVideo'
                    }
                }
            })
            .state('lmyLawVideo.comment', {
                url: '/comment',
                views: {
                    'lmyLawVideo': {
                        templateUrl: 'lawyer-center/myLaw-video/commentEdit.html',
                        controller: 'lmyLawVideo'
                    }
                }
            })
            // 我的钱包
            .state('lawyerCenter.myMoney', {
                url: '/myMoney',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/myMoney/list.html',
                        controller: 'lmyMoney'
                    }
                }
            })
            // 我的提现
            .state('lawyerCenter.withdraw', {
                url: '/withdraw',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/myMoney/withdraw.html',
                        controller: 'lmyMoney'
                    }
                }
            })
            // 设置
            .state('lawyerCenter.setting', {
                url: '/setting',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/setting/setting.html',
                        controller: 'lpersonalSetting'
                    }
                }
            })
            // 安全设置
            .state('lawyerCenter.safeSetting', {
                url: '/safeSetting',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/safeSetting/setting.html',
                        controller: 'lpersonalSetting'
                    }
                }
            })
            // 绑定手机
            .state('lawyerCenter.bindPhone', {
                url: '/bindPhone',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/safeSetting/bindPhone.html',
                        controller: 'lpersonalSetting'
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
            // 我的推荐
            .state('lawyerCenter.promotion', {
                url: '/promotion',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/promotion/index.html',
                        controller: 'promotionCtrl'
                    }
                }
            })
            .state('lawyerCenter.promotionDetails', {
                url: '/promotionDetails',
                views: {
                    'lc': {
                        templateUrl: 'lawyer-center/promotion/details.html',
                        controller: 'promotionCtrl'
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
                    }
                }
            })
            // 打赏咨询
            .state('consult.rewardConsult', {
                url: '/rewardConsult',
                views: {
                    'consult': {
                        templateUrl: 'consult/reward-consult.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 电话咨询
            .state('consult.phoneConsult', {
                url: '/phoneConsult',
                views: {
                    'consult': {
                        templateUrl: 'consult/phone-consult.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //预约会面
            .state('consult.appointmentMeeting', {
                url: '/appointmentMeeting',
                views: {
                    'consult': {
                        templateUrl: 'consult/appointment-meeting.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //更多服务
            .state('consult.moreService', {
                url: '/moreService',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/index.html',
                        controller: 'consultIndex'
                    }
                }
            })

            //律师简介
            .state('consult.lawyerIntroduction', {
                url: '/lawyerIntroduction',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/lawyerIntroduction.html',
                        controller: 'consultIndex'
                    }
                }
            })

            //我的案例
            .state('consult.myCase', {
                url: '/myCase',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/myCase.html',
                        controller: 'consultIndex'
                    }
                }
            })
            .state('consult.myCaseDetails', {
                url: '/myCaseDetails',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/myCaseDetails.html',
                        controller: 'consultIndex'
                    }
                }
            })

            //私人法律顾问
            .state('consult.personalLawAdviser', {
                url: '/personalLawAdviser',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/personalLawAdviser.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //家庭法律顾问
            .state('consult.familyLawAdviser', {
                url: '/personalLawAdviser',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/familyLawAdviser.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //企业法律顾问
            .state('consult.enterpriseLawAdviser', {
                url: '/personalLawAdviser',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/enterpriseLawAdviser.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //诉讼服务
            .state('consult.lawsuitService', {
                url: '/lawsuitService',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/lawsuitService.html',
                        controller: 'consultIndex'
                    }
                }
            })
            //诉讼服务
            .state('consult.lawyerLetterService', {
                url: '/lawyerLetterService',
                views: {
                    'consult': {
                        templateUrl: 'consult/more-service/lawyerLetterService.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 解答分享
            .state('consult.analysisShare', {
                url: '/analysisShare',
                views: {
                    'consult': {
                        templateUrl: 'consult/analysisShare/list.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 解答分享-答案
            .state('consult.analysisShareDetails', {
                url: '/analysisShareDetails',
                views: {
                    'consult': {
                        templateUrl: 'consult/analysisShare/details.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 案例分享
            .state('consult.caseShare', {
                url: '/caseShare',
                views: {
                    'consult': {
                        templateUrl: 'consult/caseShare/list.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 案例分享-答案
            .state('consult.caseShareDetails', {
                url: '/caseShareDetails',
                views: {
                    'consult': {
                        templateUrl: 'consult/caseShare/details.html',
                        controller: 'consultIndex'
                    }
                }
            })
            // 合同下载
            .state('consult.contractDownload', {
                url: '/contractDownload',
                views: {
                    'consult': {
                        templateUrl: 'consult/contractDownload/list.html',
                        controller: 'consultIndex'
                    }
                }
            })
            .state('consult.contractDownloadDetails', {
                url: '/contractDownloadDetails',
                views: {
                    'consult': {
                        templateUrl: 'consult/contractDownload/details.html',
                        controller: 'consultIndex'
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