/**
 * Created by xieiqng on 2017/6/23.
 */
lawApp = angular.module('lawOnline', ['ionic', 'ionic-citypicker']);

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

lawApp.run(['$rootScope', '$state', '$templateCache', function ($rootScope, $state, $templateCache) {

    $templateCache.put('citySelect.html', '<ionic-city-picker options="vm.CityPickData"></ionic-city-picker>');

    localStorage.defaultCity = "";

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.name == "consult.index") {
                $rootScope.isShowCitySelect = true;
            } else {
                $rootScope.isShowCitySelect = false;
            }
        });
}]);

lawApp.controller('MyCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
    var vm = $scope.vm = {};
    vm.CityPickData = {
        areaData: [localStorage.defaultCity && localStorage.defaultCity != 'undefined' ? localStorage.defaultCity : '选择城市'],
        selectLevel: 1,
        iconClass: 'ion-location',
        cssClass: 'button ',
        spanClass: 'item-note item-note-white',
        hardwareBackButtonClose: false,
        cityPickers: localStorage.cityPickers,
        buttonClicked: function () {
            localStorage.defaultCity = vm.CityPickData.areaData[0];
            console.log(localStorage.defaultCity)
        }
    };
})
    //登录
    .controller('personalLogin', function ($rootScope, $scope, $ionicModal, $state) {
        $ionicModal.fromTemplateUrl('personal-center/personallogin/user-agreement.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.isAgree = false;

        $scope.login = function () {
            if (!$scope.isAgree) {
                commService.alertPopup(-1, '请阅读并同意电子合同条款')
            } else {

            }
        };


    })
    //--------------------------------------------------用户个人中心
    .controller('personalCenter', function ($scope) {

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.user.photoUrl = res;

            });
        };

    })

    //最新资讯
    .controller('latestInformation',function($scope,$state){
        $scope.list=[{title:"北京时间12月26日凌晨4点，骑士和勇士备受瞩目的年终大战开打，" +
        "勒布朗-詹姆斯将和凯文-杜兰特交锋。骑士和勇士已经连续三年在总决赛相遇",date:"2017-01-01",person:6},
            {title:"北京时间12月26日凌晨4点，骑士和勇士备受瞩目的年终大战开打，" +
            "勒布朗-詹姆斯将和凯文-杜兰特交锋。骑士和勇士已经连续三年在总决赛相遇",date:"2017-01-02",person:5}];
        $scope.getDetails=function(){
            $state.go("latestInformation.details");
        }
    })
    //我的会员套餐
    .controller('myVipPackage',function($scope,$state){
        $scope.getDetails=function(){
            $state.go("myVipPackage.details");
        }
    })

    //我的订单
    .controller('myOrder',function($scope,$state){
        $scope.getDetails=function(){
            $state.go("myOrder.details");
        }
    })
    //我的诉讼
    .controller('myLawsuit',function($scope,$state){
        $scope.getDetails=function(){
            $state.go("myLawsuit.details");
        };

        $scope.suitProgress=[{content:"都结束了呀，老铁",date:"2017-11-11 11:11:11"},
            {content:"都凉了呀，老铁",date:"2017-11-11 11:11:11"},
            {content:"都结束了呀，老铁",date:"2017-11-11 11:11:11"}];
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
        $scope.lawyerDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
        $scope.removePic=function(item){
            angular.forEach($scope.myDatas,function(value,index){
                if(item.uuid==value.uuid){
                    $scope.myDatas.splice(index,1);
                }
            })
        }
    })
    //我查听过的分享
    .controller('heardIssue',function($scope,$state){
        $scope.list=[{content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55}];
        $scope.detail={content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55,reply:'哈哈哈'};
    })
    //我查看过的视频
    .controller('watchedIssue',function($scope,$state){
        $scope.list=[{content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55}];
        $scope.detail={content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55,reply:'哈哈哈'};
    })
    //设置、安全设置
    .controller('personalSetting',function($scope,$state){
        $scope.bindPhone=function(){
            $state.go('personalCenter.bindPhone');
        }
    })
    //我的推荐
    .controller('myRecommend',function($scope,$state){
        $scope.list=[{date:"2017-11-11",name:"闪电侠"},{date:"2017-11-11",name:"闪电侠"}]
    })
    //我的钱包
    .controller('myMoney',function($scope,$state){
        $scope.cash=5000000;
        $scope.list=[{title:"体现",date:"2017-11-11",money:"+13元"},
            {title:"体现",date:"2017-11-11",money:"+13元"}];
        $scope.listType=["支付宝","银行卡"];

        //切换体现方式
        $scope.byType1=true;
        $scope.byType2=false;
        $scope.Type1=function(){
            $scope.byType1=true;
            $scope.byType2=false;
        };
        $scope.Type2=function(){
            $scope.byType1=false;
            $scope.byType2=true;
        }
    })
    //我的企业互助
    .controller('myEnterpriseHelp',function($scope,$state){
        $scope.myProductList=function(){
            $state.go("personalCenter.ProductList");
        }
        $scope.applyAccess=function(){
            $state.go("personalCenter.applyAccess");
        }
        $scope.list=["企业注册","企业管理","财税服务"]
    })




    //----------------------------------------------------律师个人中心
    .controller('lawyerCenter', function ($scope) {

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.user.photoUrl = res;

            });
        };

    })
    //我的首页
    .controller('lmyHome',function($scope,$state){
        //我的案例
        $scope.cases=[{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"},{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"}];

        $scope.getDetailsMyCase=function(){
            $state.go("lmyHome.myCaseDetails");
        }
    })
    //我的订单
    .controller('lmyOrder',function($scope,$state){
        $scope.getDetails=function(){
            $state.go("lmyOrder.details");
        }
    })
    //我的诉讼
    .controller('lmyLawsuit',function($scope,$state){
        $scope.getDetails=function(){
            $state.go("lmyLawsuit.details");
        };

        $scope.suitProgress=[{content:"都结束了呀，老铁",date:"2017-11-11 11:11:11"},
            {content:"都凉了呀，老铁",date:"2017-11-11 11:11:11"},
            {content:"都结束了呀，老铁",date:"2017-11-11 11:11:11"}];
        $scope.myDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
        $scope.lawyerDatas=[{title:"都结束了呀，老铁1",date:"2017-11-11 11:11:11",uuid:"1"},
            {title:"都凉了呀，老铁2",date:"2017-11-11 11:11:11",uuid:"2"},
            {title:"都结束了呀，老铁3",date:"2017-11-11 11:11:11",uuid:"3"}];
        $scope.removePic=function(item){
            angular.forEach($scope.myDatas,function(value,index){
                if(item.uuid==value.uuid){
                    $scope.myDatas.splice(index,1);
                }
            })
        }
    })
    //我查看过的视频
    .controller('lmyLawVideo',function($scope,$state){
        $scope.list=[{content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55}];
        $scope.detail={content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55,reply:'哈哈哈'};
    })
    //我的钱包
    .controller('lmyMoney',function($scope,$state){
        $scope.cash=5000000;
        $scope.list=[{title:"体现",date:"2017-11-11",money:"+13元"},
            {title:"体现",date:"2017-11-11",money:"+13元"}];
        $scope.listType=["支付宝","银行卡"];

        //切换体现方式
        $scope.byType1=true;
        $scope.byType2=false;
        $scope.Type1=function(){
            $scope.byType1=true;
            $scope.byType2=false;
        };
        $scope.Type2=function(){
            $scope.byType1=false;
            $scope.byType2=true;
        }
    })
    //设置、安全设置
    .controller('lpersonalSetting',function($scope,$state){
        $scope.bindPhone=function(){
            $state.go('lawyerCenter.bindPhone');
        }
    })
    //推广管理
    .controller('promotionCtrl',function($scope,$state){

    })

    //咨询预约
    .controller('consultIndex',function($scope,$state,$location){
        $scope.domains=[{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"}
        ,{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"}]
        $scope.list=[{name:"三旬老汉律师",province:"湖北",city:"黄冈",licenseNo:"11",domainNames:"离婚"}];
        $scope.item={name:"三旬老汉律师",province:"湖北",city:"黄冈",licenseNo:"11",domainNames:"离婚"};

        //解答分享
        $scope.analysisShare=function(){
            $state.go("consult.analysisShare");
        };
        $scope.shares=[{content:"请问律师，对甲方而言，这样一份婚前协议是否有效，如果两人离婚了甲方打算按第二条履行起来会有什么问题？",
            name:"老汉",address:"广东省",license_no:"110",listen_num:55},{content:"请问律师，对甲方而言，这样一份婚前协议是否有效，如果两人离婚了甲方打算按第二条履行起来会有什么问题？",
            name:"老汉",address:"广东省",license_no:"110",listen_num:55}];
        $scope.detail={content:"wwww",name:"jjj",address:"dddd",license_no:"110",listen_num:55,reply:'哈哈哈'};

        //案例分享
        $scope.caseShare=function() {
            $state.go("consult.caseShare");
        };

        //普法视频
        $scope.lawVideo=function(){
            window.location.href="/project_law_online/vip-online/vip.html#/vip/lawVideoIndex";
        };


        //合同下载
        $scope.contractDownload=function(){
            $state.go("consult.contractDownload");
        };
        $scope.contracts=[{name:"劳动人事",list:["房屋出租协议","房屋购买合同"]},{name:"劳动人事"},{name:"劳动人事"},{name:"劳动人事"},{name:"劳动人事"}];
        $scope.itemToggle=function(event){
            angular.element(event.target).parent().find("section").toggle();
            if(angular.element(event.target).parent().find("span").hasClass("ion-chevron-right")){
                angular.element(event.target).parent().find("span").addClass("ion-chevron-down").removeClass("ion-chevron-right");
            }else {
                angular.element(event.target).parent().find("span").addClass("ion-chevron-right").removeClass("ion-chevron-down");
            }
        };


        //打赏咨询
        $scope.rewardConsultShow=function(id){
            $state.go("consult.rewardConsult");
        };
        //电话咨询
        $scope.phoneConsultShow=function(id){
            $state.go("consult.phoneConsult");
        };
        //预约会面
        $scope.meetShow=function(id){
            $state.go("consult.appointmentMeeting");
        };
        //更多服务
        $scope.getMoreService=function(id){
            $state.go("consult.moreService");
        };

        //我的案例
        $scope.cases=[{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"},{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"}];
        $scope.getDetails=function(){
            $state.go("consult.myCaseDetails");
        }

    })

    //咨询预约-消息
    .controller('informationCtrl',function($scope,$state){
        $scope.list=[{title:"订单消息",content:"你有新的消息啦",date:"2018-01-11"},
            {title:"订单消息",content:"你有新的消息啦",date:"2018-01-11"},
            {title:"订单消息",content:"你有新的消息啦",date:"2018-01-11"}]
    })
;




