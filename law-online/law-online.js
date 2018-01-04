/**
 * Created by xieiqng on 2017/6/23.
 */
lawApp = angular.module('lawOnline', ['ionic']);

lawApp.controller('MyCtrl', function ($scope, $ionicSideMenuDelegate, $ionicModal) {
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
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
    //用户个人中心
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

    //咨询预约
    .controller('consultIndex',function($scope,$state){
        $scope.domains=[{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"}
        ,{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"},{name:"婚姻家庭",id:"ddd"}]
        $scope.list=[{name:"三旬老汉律师",province:"湖北",city:"黄冈",licenseNo:"11",domainNames:"离婚"}];
        $scope.item={name:"三旬老汉律师",province:"湖北",city:"黄冈",licenseNo:"11",domainNames:"离婚"};

        //打赏咨询
        $scope.rewardConsultShow=function(id){
            $state.go("consult.rewardConsult");
        }
        //电话咨询
        $scope.phoneConsultShow=function(id){
            $state.go("consult.phoneConsult");
        }
        //预约会面
        $scope.meetShow=function(id){
            $state.go("consult.appointmentMeeting");
        }
        //更多服务
        $scope.getMoreService=function(id){
            $state.go("consult.moreService");
        }

        //我的案例
        $scope.cases=[{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"},{title:"哈哈哈哈哈哈哈哈哈哈哈dfgdsdddddddddddddd电热翁二翁翁翁无翁",content:"呵呵呵呵呵呵咕咕咕咕过过过过过过过过过过呵呵呵呵呵" +
        "呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵呵哈哈哈哈哈哈哈哈哈哈哈呵呵呵呵呵呵呵呵呵呵呵呵"}];
        $scope.getDetails=function(){
            $state.go("consult.myCaseDetails");
        }
    })
;




