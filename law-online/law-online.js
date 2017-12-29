/**
 * Created by xieiqng on 2017/6/23.
 */
lawApp = angular.module('lawOnline', ['ionic', 'ionic-citypicker', 'ngTouch']);

// 拦截器配置
lawApp.factory('httpInterceptor', function ($q, $rootScope) {
    var httpInterceptor = {
        'responseError': function (response) {
            return $q.reject(response);
        },
        'response': function (response) {
            if (response.data.code == -800) {
                $rootScope.$emit('checkOut');
                return $q.reject(response);
            } else {
                return response;
            }
        },
        'request': function (config) {
            if (config.method == 'POST' && localStorage.law_token) {
                config.headers.token = localStorage.law_token;
            }
            return config;
        },
        'requestError': function (config) {
            return $q.reject(config);
        }
    };
    return httpInterceptor;
});

// 拦截器注入
lawApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $httpProvider.interceptors.push('httpInterceptor');
}]);

lawApp.run(['$rootScope', '$state', 'commService', '$templateCache', function ($rootScope, $state, commService, $templateCache) {

    $templateCache.put('citySelect.html', '<ionic-city-picker options="vm.CityPickData"></ionic-city-picker>');

    $rootScope.api_host = 'http://www.gdfxzx.com/fxzx';
    // $rootScope.api_host = 'http://127.0.0.1:8080/fxlb';

    $rootScope.$on('checkOut', function () {
        localStorage.law_token = '';
        localStorage.law_role = '';
        $rootScope._role = null;
        //commService.alertPopup(-1, '请先登录')
    });

    var GetUrlParams = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        if (window.location.href.split('?').length <= 1) {
            return null;
        } else {
            var r = window.location.href.split('?')[1].match(reg);
            if (r != null) return (r[2]);
            return null;
        }
    };
    var wecharCode = GetUrlParams('code');
    if (wecharCode) {
        commService.codeToOpenId({code: wecharCode}).then(function (res) {
            if (res.code >= 0) {
                localStorage.wxopenId = res.data.openId;
            }
        });
    }

    commService.cityPickers().then(function (rep) {
        localStorage.cityPickers = JSON.stringify(rep.data.pickers)
    });

    commService.systemOptions().then(function (res) {
        $rootScope._so = res.data.so;
    });

    localStorage.defaultCity = "";
    $rootScope._role = localStorage.law_role ? localStorage.law_role : null;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.name == "consult.index") {
                $rootScope.isShowCitySelect = true;
            } else {
                $rootScope.isShowCitySelect = false;
            }
        });


    // top颜色变化的狗比需求
    $rootScope.topColor = 'bar-positive'
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        /*        if (toState.name.indexOf('consult') == 0){
         $rootScope.topColor = 'bar-energized'
         }*/

    })

}]);

lawApp.filter('javaDate', function ($filter) {
    return function (input, format) {
        if (input) {
            var timestamp = input.time;
            return $filter("date")(timestamp, format);
        } else {
            return "";
        }
    }
});

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
        }
    };

})
    .controller('personalLogin', function ($rootScope, $scope, userService, commService, $ionicModal, $state) {
        $ionicModal.fromTemplateUrl('personal-center/personallogin/user-agreement.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        commService.getNews({newId: -1001}).then(function (rep) {
            $scope.loginAgree = rep.data.news;
        });

        $scope.isAgree = false;

        $scope.login = function () {
            if (!$scope.isAgree) {
                commService.alertPopup(-1, '请阅读并同意电子合同条款')
            } else {
                userService.login({
                    mobile: $scope.mobile == undefined ? "" : $scope.mobile,
                    password: $scope.password == undefined ? "" : $scope.password,
                    recommMobile: $scope.recommMobile == undefined ? "" : $scope.recommMobile
                }).then(function (rep) {
                    if (rep.code >= 0) {
                        localStorage.law_token = rep.data.token;
                        localStorage.law_role = "user";
                        $rootScope._role = "user";
                    }
                    commService.alertPopup(rep.code, rep.msg).then(function (res) {
                        if (rep.code >= 0) {
                            $state.go('personalCenter.centerList');
                        }
                    });
                });
            }
        };

        $scope.wxLogin = function () {
            if (!$scope.isAgree) {
                commService.alertPopup(-1, '请阅读并同意电子合同条款')
            } else {
                userService.wxLogin({
                    openId: localStorage.wxopenId ? localStorage.wxopenId : ''
                }).then(function (res) {
                    if (res.code >= 0) {
                        localStorage.law_token = res.data.token;
                        localStorage.law_role = "user";
                        $rootScope._role = "user";
                    }
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('personalCenter.centerList')
                        }
                    })
                });
            }
        }

    })
    .controller('personalRegist', function ($q, $scope, userService, commService, $ionicModal, $state) {
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择城市'],
            title: '地区',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.info = {
            mobile: '',
            code: '',
            password: '',
            email: '',
            sex: '1',
            recommMobile: ''
        }

        $scope.getCode = function () {
            var deferred = $q.defer();
            commService.sendMobileCode({mobile: $scope.info.mobile}).then(function (res) {
                deferred.resolve(res.code);
                commService.alertPopup(res.code, res.msg)
            });
            return deferred.promise;
        };

        $scope.userRegister = function () {
            userService.register({
                mobile: $scope.info.mobile,
                password: $scope.info.password,
                email: $scope.info.email,
                sex: $scope.info.sex,
                province: $scope.vm.CityPickData.areaData[0],
                city: $scope.vm.CityPickData.areaData[1],
                area: $scope.vm.CityPickData.areaData[2],
                recommMobile: $scope.info.recommMobile,
                code: $scope.info.code
            }).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function (rep) {
                    if (res.code >= 0) {
                        $state.go('personalCenter.personalLogin')
                    }
                })
            })
        };

    })
    //用户个人中心
    .controller('personalCenter', function ($scope, userService, commService) {

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.user.photoUrl = res;
                userService.updateUserPhoto({photoUrl: res}).then(function (rep) {
                });
            });
        };
        userService.userCenter().then(function (res) {
            $scope.user = res.data.user;
        });


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
        $scope.a=22;
    })
;




