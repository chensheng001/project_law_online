var lawApp = angular.module('becomeMember');
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

lawApp.directive('formatDate', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function (modelValue) {
                if (modelValue) {
                    return new Date(modelValue);
                }
            });

            ngModelCtrl.$parsers.push(function (value) {
                if (value) {
                    return $filter('date')(value, 'yyyy-MM-dd');
                }
            });
        }
    };
});

lawApp.service('commService', ['$q', '$http', '$rootScope', '$ionicPopup', function ($q, $http, $rootScope, $ionicPopup, $state) {
    // 获取所有领域
    this.domains = function () {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/domains',
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
            url: $rootScope.api_host + '/wx/codeToOpenId',
            method: 'POST',
            data: obj
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

    this.alertPopup = function (code, msg) {
        var t = code >= 0 ? "提示" : "警告"
        if (code == -800) {
            var confirmPopup = $ionicPopup.confirm({
                title: t,
                template: msg,
                okText: '去登录',
                cancelType: 'button-stable'
            });
            return confirmPopup;
        }
        if (code != -800) {
            var alertPopup = $ionicPopup.alert({
                title: t,
                template: msg,
                okText: '确定'
            });
            return alertPopup;
        }
    };

    // 获取微信JSApi签名
    this.getJSticket = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/getJSticket',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // 获取系统参数
    this.getSystemOptions = function (obj) {
        var deferred = $q.defer();
        $http({
            url: $rootScope.api_host + '/wx/getSystemOptions',
            method: 'POST',
            data: obj
        }).then(function (res) {
            deferred.resolve(res.data)
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.addPage = function (oldPage, newPage) {
        Array.prototype.push.apply(oldPage.content, newPage.content);
        newPage.content = oldPage.content;
        return newPage;
    }


}])
    .service('userService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 获取会员价格
        this.userPrices = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/userPrices',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 个人注册
        this.personalRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/personalRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 企业体验会员注册
        this.attemptBusiRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/attemptBusiRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 基础企业会员注册
        this.basicBusiRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/basicBusiRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 顾问会员注册
        this.adviserRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/adviserRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // VIP顾问会员注册
        this.vipAdviserRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/vipAdviserRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 机构服务会员注册
        this.busiServiceRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/busiServiceRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 登录
        this.login = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/login',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 选择律师
        this.selectLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/selectLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 查听支付
        this.payListenRepay = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/payListenRepay',
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
                url: $rootScope.api_host + '/wx/user/updateUserPhoto',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我的律师
        this.myLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/myLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 申请更换律师
        this.changeLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/changeLawyer',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我的资料（会员）
        this.userInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/userInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 获取用户次数（会员）
        this.getUserNum = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/getUserNum',
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
    // 需求服务
    .service('needService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 其他需求列表
        this.needList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/needList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 其他需求列表
        this.userNeedInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/needInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布需求
        this.publishNeed = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/publishNeed',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我对接的需求列表
        this.getNeedList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/getNeedList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我对接的需求详情
        this.getNeedInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/getNeedInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 处理对接的需求详情
        this.makeGetNeed = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/makeGetNeed',
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
        // 律师注册
        this.lawyerRegister = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyerRegister',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师列表
        this.lawyerList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyerList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 机构列表
        this.businessList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/businessList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师我的资料
        this.myInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/info',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 更换律师头像
        this.updateLawyerPhoto = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/updatePhotoUrl',
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
        this.saveInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/saveInfo',
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
                url: $rootScope.api_host + '/wx/lawyer/tranList',
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
                url: $rootScope.api_host + '/wx/lawyer/withdraw',
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

        // 日常法典
        this.statuteBookList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/statuteBookList',
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
                url: $rootScope.api_host + '/wx/questionInfo',
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
                url: $rootScope.api_host + '/wx/lawViewpoint',
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
                url: $rootScope.api_host + '/wx/questionRepayList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 法聚观点列表
        this.lawViewpointList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawViewpointList',
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
                url: $rootScope.api_host + '/wx/lawyer/publishViewpoint',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 问题回复详情
        this.userQuestionInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/questionInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 听过的问题列表（会员）
        this.userQuestionList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/questionList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

    }])
    .service('caseService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 会员的案件列表
        this.userCaseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/caseList',
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
                url: $rootScope.api_host + '/wx/user/caseInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件详情(律师)
        this.lawyerCaseInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/caseInfo',
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
                url: $rootScope.api_host + '/wx/user/publishCase',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 发布案件(律师)
        this.publishCaseByLawyer = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/publishCase',
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
                url: $rootScope.api_host + '/wx/user/casePictures',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加会员案件照片
        this.addUserPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/addPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加律师案件照片
        this.addLawyerPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/addPicture',
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
                url: $rootScope.api_host + '/wx/user/delPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 会员发送消息
        this.userAddCaseMsg = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/addCaseMsg',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师发送消息
        this.lawyerAddCaseMsg = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/addCaseMsg',
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
                url: $rootScope.api_host + '/wx/user/caseMsgList',
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
        this.lawyerCaseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/caseList',
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

        // 案件进展
        this.caseLogs = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/caseLogs',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加案件日志
        this.addCaseLog = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/addCaseLog',
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

        // 会员的订单列表
        this.userOrderList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/orderList',
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
                url: $rootScope.api_host + '/wx/user/orderInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 律师的订单列表
        this.lawyerOrderList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/orderList',
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
                url: $rootScope.api_host + '/wx/lawyer/orderInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 咨询回复
        this.consultRepay = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/consultRepay',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 订单完成
        this.orderComplete = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/orderComplete',
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
                url: $rootScope.api_host + '/wx/user/evaluateList',
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
                url: $rootScope.api_host + '/wx/user/evaluateLawyer',
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
    .service('serviceService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        // 获取服务包价格信息
        this.servicePrice = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/servicePrice',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 提问咨询
        this.consult = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/consult',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 电话咨询
        this.mobileConsult = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/mobileConsult',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 预约会面
        this.viewMeeting = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/view',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 合同列表
        this.contracts = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/contracts',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 合同购买
        this.payContract = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/payContract',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //服务详情
        this.serviceInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/serviceInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //合同起草
        this.contractWrite = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/contractWrite',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //合同审查
        this.contractInverstigate = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/contractInverstigate',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //合同审查
        this.riskContract = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/risk',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //购买一般服务
        this.payService = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/payService',
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
    .service('activityService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 会员活动列表
        this.activityList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/activityList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 活动详情
        this.activityInfo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/activityInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 参加活动
        this.joinActivity = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/joinActivity',
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
    .service('eliteService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 实名精英列表
        this.eliteList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/eliteList',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 加入精英
        this.joinElite = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/joinElite',
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
    .service('payOrderService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 根据订单号支付
        this.payByOrderNo = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/payByOrderNo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 购买产品服务包
        this.payServicePack = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/user/payServicePack',
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
    .service('lawyerEntrustService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 代办列表
        this.entrustList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/entrustList',
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
                url: $rootScope.api_host + '/wx/lawyer/publishEntrust',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 代办支付
        this.entrustPay = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/entrustPay',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 我的代办列表
        this.myEntrustList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/lawyer/myEntrustList',
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
                url: $rootScope.api_host + '/wx/lawyer/entrustInfo',
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
                url: $rootScope.api_host + '/wx/lawyer/cancelEntrust',
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
                url: $rootScope.api_host + '/wx/lawyer/applyEntrust',
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
                url: $rootScope.api_host + '/wx/lawyer/confirmEntrust',
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
    .service('searchService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

        // 发送短信
        this.sendCode = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/sendCode',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 登录
        this.login = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/login',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件列表
        this.caseList = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/caseList',
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
                url: $rootScope.api_host + '/wx/about/caseInfo',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件照片资料
        this.casePictures = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/casePictures',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 添加照片资料
        this.addPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/addPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 删除照片资料
        this.delPicture = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/delPicture',
                method: 'POST',
                data: obj
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // 案件日志
        this.caseLogs = function (obj) {
            var deferred = $q.defer();
            $http({
                url: $rootScope.api_host + '/wx/about/caseLogs',
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
                url: $rootScope.api_host + '/wx/lawyer/confirmEntrust',
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



