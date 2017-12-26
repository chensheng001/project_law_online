var lawApp = angular.module('lawOnline');
// 评价星级指令
lawApp.directive('evaluateStar', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {starNum: '='},
        link: function (scope, element, attrs) {
            var init = function () {
                scope.starList = new Array();
                scope.outStarList = new Array();
                var count = 0;
                for (var i = 0; i < parseInt(scope.starNum); i++) {
                    scope.starList[i] = 1;
                    count = i + 1;
                }
                for (var n = 0; n < 5 - count; n++) {
                    scope.outStarList[n] = 1;
                }
            };

            scope.$watch('starNum', function () {
                init();
            });
        },
        template: '<div><i class="ion ion-ios-star" ng-repeat=" s in starList track by $index"></i>' +
        '<i class="ion ion-ios-star-outline" ng-repeat=" o in outStarList track by $index"></i></div>'
    };
});

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


lawApp.service('commService', ['$q', '$http', '$rootScope', '$ionicPopup', function ($q, $http, $rootScope, $ionicPopup) {
    // 获取所有领域
    this.domains = function () {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/domains',
            method: 'POST',
            data: {}
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取系统参数
    this.systemOptions = function () {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/systemOptions',
            method: 'POST',
            data: {}
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    //code换取openId
    this.codeToOpenId = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/codeToOpenId',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取图片上传签名
    this.getPolicy = function () {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/getPolicy',
            method: 'POST',
            data: {}
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 上传文件
    this.uploadFile = function (file) {
        var bucket = 'fxzx';
        var region = 'oss-cn-hangzhou';
        var endpoint = 'http://oss-cn-hangzhou.aliyuncs.com';
        var deferred = $q.defer();
        var getFileName = function (file) {
            return new Date().Format("yyyyMMddhhmmssS") + "_" + parseInt(Math.random() * (99999 - 0)) + file.name.substring(file.name.lastIndexOf("."), file.name.length);
        };

        var client = new OSS.Wrapper({
            region: region,
            accessKeyId: 'LTAIOnYcKmyD7N6A',
            accessKeySecret: 'tLJK1nS9CS3PsqgF6ftyNV143pGdox',
            bucket: 'fxzx'
        });
        var fileName = getFileName(file);

        client.multipartUpload(fileName, file).then(function (result) {
            deferred.resolve(endpoint.substring(0, 7) + bucket + "." + endpoint.substring(7) + "/" + fileName);
        }).catch(function (err) {
            console.log(err);
        });
        return deferred.promise;
    };

    // 发送手机验证码
    this.sendMobileCode = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/sendMobileCode',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取新闻
    this.getNews = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/getNews',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取省市区数据
    this.cityPickers = function () {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/cityPickers',
            method: 'POST',
            data: {}
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.alertPopup = function (code, msg) {
        if (code != -800) {
            var t = code >= 0 ? "提示" : "警告"
            var alertPopup = $ionicPopup.alert({
                title: t,
                template: msg,
                okText: '确定'
            });
            return alertPopup;
        }
    };

    // 微信订单支付
    this.wxPayOrder = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/unifiedOrder',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 微信查听支付
    this.wxPayListen = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/unifiedListen',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 微信代办支付
    this.wxPayEntrust = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/general/unifiedEntrust',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取微信JSApi签名
    this.getJSticket = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/comm/getJSticket',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };


}])
    .service('userService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 登录
        this.login = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/login',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 用户绑定微信
        this.userBindWX = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userBindWX',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 微信登录
        this.wxLogin = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/wxLogin',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };


        // 注册
        this.register = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/register',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 用户个人中心
        this.userCenter = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userCenter',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 更换用户头像
        this.updateUserPhoto = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/updateUserPhoto',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我的资料（用户）
        this.userInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 保存我的资料（用户）
        this.saveUserInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/saveUserInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('lawyerService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 律师列表
        this.lawyerList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师详情
        this.lawyerInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师过往案例列表
        this.lawyerCaseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerCaseList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我的律师过往案例列表
        this.myLawyerCaseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/myLawyerCaseList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师过往案例详情
        this.lawyerCaseInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerCaseInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师注册
        this.lawyerRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师登录
        this.lawyerLogin = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerLogin',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 微信登录
        this.wxLogin = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerWXLogin',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 绑定微信id
        this.lawyerBindWX = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerBindWX',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 修改头像
        this.updateLawyerPhotoUrl = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/updateLawyerPhotoUrl',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师个人中心
        this.lawyerCenter = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerCenter',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师个人资料
        this.myInfoByLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/myInfoByLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 保存律师资料
        this.saveLawyerInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/saveLawyerInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布律师过往案例
        this.publishLawyerCase = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/publishLawyerCase',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 交易记录
        this.tranList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/tranList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师提现
        this.withdraw = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/withdraw',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('orderService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 律师打赏咨询
        this.lawyerConsult = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerConsult',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师回复打赏咨询
        this.consultRepay = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/consultRepay',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师回复打赏咨询
        this.mobileComplete = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/mobileComplete',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师电话咨询
        this.lawyerMobile = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerMobile',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师会面
        this.lawyerView = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerView',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 修改预约信息
        this.updateMeetInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/updateMeetInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 完成预约订单
        this.completeMeet = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/completeMeet',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加服务订单
        this.addServiceOrder = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/addServiceOrder',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 完成服务订单
        this.completeService = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/completeService',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 合同下载
        this.contractDownload = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/contractDownload',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };


        // 用户订单列表
        this.userOrderList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userOrderList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 订单详情
        this.userOrderInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userOrderInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 取消订单
        this.cancelOrder = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/cancelOrder',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师订单列表
        this.lawyerOrderList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerOrderList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 订单详情
        this.lawyerOrderInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerOrderInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('evaluateService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 律师评价列表
        this.lawyerEvaluateList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerEvaluateList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 用户评价
        this.userEvaluate = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userEvaluate',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }])
    .service('questionService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 日常法典列表
        this.statuteBookList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/statuteBookList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 问题详情
        this.questionInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/questionInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 法聚观点
        this.lawViewpoint = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawViewpoint',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 问题回复列表
        this.questionRepayList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/questionRepayList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 过往法聚观点列表
        this.lawViewpointList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawViewpointList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布观点
        this.publishViewpoint = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/publishViewpoint',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 听过的问题列表（用户）
        this.userQuestionList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userQuestionList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 问题回复详情
        this.userQuestionInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userQuestionInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('productService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 合同列表
        this.contractList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/contractList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 合同详情
        this.contractInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/contractInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 产品服务详情
        this.serviceInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/serviceInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('caseService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 案件列表
        this.userCaseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userCaseList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件详情
        this.caseInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/caseInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布案件
        this.publishCase = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/publishCase',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        // 发布案件
        this.publishCaseByLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/publishCaseByLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师案件列表
        this.myCaseListByLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/myCaseListByLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件聊天记录
        this.caseMsgList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/caseMsgList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件聊天记录
        this.userAddCaseMsg = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/userAddCaseMsg',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件聊天记录
        this.lawyerAddCaseMsg = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerAddCaseMsg',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件照片
        this.casePictures = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/casePictures',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加案件照片
        this.addPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/addPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 删除案件照片
        this.delPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/delPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('caseLogService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 案件日志
        this.caseLogs = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/caseLogs',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加案件进展
        this.addCaseLog = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/addCaseLog',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('entrustService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 代办列表
        this.entrustList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/entrustList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布代办
        this.publishEntrust = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/publishEntrust',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 取消代办
        this.cancelEntrust = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/cancelEntrust',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师代办列表
        this.lawyerEntrustList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/lawyerEntrustList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 代办详情
        this.entrustInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/entrustInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 确认代办完成
        this.confirmEntrust = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/confirmEntrust',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 申请代办
        this.applyEntrust = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/general/applyEntrust',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }]);

