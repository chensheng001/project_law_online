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
    // 用户信息
    .controller('myInfo', function ($scope, userService, commService) {

        var vm = $scope.vm = {};

        userService.userCenter().then(function (res) {
            $scope.user = res.data.user;
            if ($scope.user.province) {
                vm.CityPickData = {
                    areaData: ['请选择城市'],
                    title: '地区',
                    defaultAreaData: [$scope.user.province, $scope.user.city, $scope.user.area],
                    hardwareBackButtonClose: false,
                    cityPickers: localStorage.cityPickers
                };
            } else {
                vm.CityPickData = {
                    areaData: ['请选择城市'],
                    title: '地区',
                    hardwareBackButtonClose: false,
                    cityPickers: localStorage.cityPickers
                };
            }
        });


        $scope.updateSubmit = function () {
            $scope.user.province = vm.CityPickData.areaData[0];
            $scope.user.city = vm.CityPickData.areaData[1];
            $scope.user.area = vm.CityPickData.areaData[2];
            userService.saveUserInfo($scope.user).then(function (res) {
                commService.alertPopup(res.code, res.msg);
            })
        }


    })
    // 用户听过的问题
    .controller('heardIssue', function ($scope, $sce, $ionicModal, questionService) {

        $scope.sce = $sce.trustAsResourceUrl;

        $scope.detail = {
            question: {},
            lawyer: {},
            repay: {}
        }

        $ionicModal.fromTemplateUrl('personal-center/heard-issue/heard-issue-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.modalShow = function (id) {
            questionService.userQuestionInfo({uqrId: id}).then(function (res) {
                $scope.detail.question = res.data.question;
                $scope.detail.lawyer = res.data.lawyer;
                $scope.detail.repay = res.data.repay;
                $scope.detail.uqr = res.data.uqr;
            });
            $scope.modal.show();
        };

        $scope.que = {
            page: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    questionService.userQuestionList({currPage: this.page.currPage}).then(function (res) {
                        Array.prototype.push.apply($scope.que.page.list, res.data.page.list);
                        res.data.page.list = $scope.que.page.list;
                        $scope.que.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        $scope.que.loadMore();


    })

    // 案件列表
    .controller('caseList', function ($scope, $ionicModal, caseService, commService, lawyerService, caseLogService) {

        $scope.dict = {
            status: {
                '-1': '审核失败',
                '0': '待审核',
                '1': '律师处理中',
                '2': '已完成'
            }
        };
        $scope.case = {
            type: 0,
            page: {currPage: 0, pages: 1, list: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    caseService.userCaseList({
                        type: this.type,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.case.page.list, res.data.page.list);
                        res.data.page.list = $scope.case.page.list;
                        $scope.case.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.case.loadMore();
        $scope.detail = {
            caseId: 0,
            case: {},
            caseListShow: function (id) {
                this.caseId = id;
                caseService.caseInfo({caseId: this.caseId}).then(function (res) {
                    $scope.detail.case = res.data.case;
                });
                this.msgs.loadMore();
                $scope.caseListmodal.show();
            },
            lawyerPic: {
                list: [],
                getList: function () {
                    caseService.casePictures({caseId: $scope.detail.caseId, type: 2}).then(function (res) {
                        $scope.detail.lawyerPic.list = res.data.list;
                    })
                },
                show: function () {
                    $scope.imgmodalTitle = '律师的图片资料';
                    $scope.imgmodalType = 2;
                    this.getList();
                    $scope.imgmodal.show();
                }
            },
            myPic: {
                list: [],
                getList: function () {
                    caseService.casePictures({caseId: $scope.detail.caseId, type: 1}).then(function (res) {
                        $scope.detail.myPic.list = res.data.list;
                    })
                },
                add: {
                    img: {name: '', pictureUrl: ''},
                    show: function () {
                        this.img = {name: '', pictureUrl: ''};
                        $scope.addImgModel.show();
                    },
                    add: function () {
                        caseService.addPicture({
                            caseId: $scope.detail.caseId,
                            type: 1,
                            name: this.img.name,
                            pictureUrl: this.img.pictureUrl
                        }).then(function (res) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $scope.detail.myPic.getList();
                                    $scope.addImgModel.hide();
                                }
                            })
                        })
                    }
                },
                del: function (id) {
                    caseService.delPicture({picId: id}).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.detail.myPic.getList();
                            }
                        })
                    });
                },
                show: function () {
                    this.getList();
                    $scope.imgmodalTitle = '用户的图片资料';
                    $scope.imgmodalType = 1;
                    $scope.imgmodal.show();
                }
            },
            msgs: {
                msg: {content: ''},
                page: {currPage: 0, pages: 1, list: []},
                submit: function () {
                    caseService.userAddCaseMsg({
                        caseId: $scope.detail.caseId,
                        content: $scope.detail.msgs.msg.content
                    }).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.detail.msgs.msg.content = '';
                                $scope.detail.msgs.page = {currPage: 0, pages: 1, list: []};
                                $scope.detail.msgs.loadMore();
                            }
                        });
                    })
                },
                loadMore: function () {
                    if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                        this.page.currPage += 1;
                        caseService.caseMsgList({
                            caseId: $scope.detail.caseId,
                            currPage: this.page.currPage
                        }).then(function (res) {
                            Array.prototype.push.apply($scope.detail.msgs.page.list, res.data.page.list);
                            res.data.page.list = $scope.detail.msgs.page.list;
                            $scope.detail.msgs.page = res.data.page;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }
                },
                doRefresh: function () {
                    this.page = {currPage: 0, pages: 1, list: []};
                    this.loadMore();
                }
            },
            logs: {
                list: [],
                show: function () {
                    this.load();
                    $scope.caseLogModal.show();
                },
                load: function () {
                    caseLogService.caseLogs({caseId: $scope.detail.caseId}).then(function (res) {
                        $scope.detail.logs.list = res.data.list;
                    })
                }
            }
        };

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                console.log(res)
                $scope.detail.myPic.add.img.pictureUrl = res;
            });
        };

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择城市'],
            title: '诉讼区域',
            selectLevel: 2,
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.publish = {
            case: {name: '', mobile: '', idCard: '', content: '', domainId: '2', city: '', minAmount: 0, maxAmount: 0},
            openShow: function () {
                this.case = {
                    name: '',
                    mobile: '',
                    idCard: '',
                    content: '',
                    domainId: '2',
                    city: '',
                    minAmount: 0,
                    maxAmount: 0
                };
                $scope.releasemodal.show();
            },
            selectLawyer: {
                lawyer: {id: 0},
                page: {currPage: 0, pages: 1, list: []},
                show: function () {
                    this.page = {currPage: 0, pages: 1, list: []};
                    this.loadMore();
                    console.log($scope.publish.selectLawyer.page.list)
                    $scope.selectLawyerModel.show();
                },
                select: function (item) {
                    this.lawyer = item;
                    $scope.selectLawyerModel.hide();
                },
                loadMore: function () {
                    if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                        this.page.currPage += 1;
                        lawyerService.lawyerList({currPage: this.page.currPage}).then(function (res) {
                            Array.prototype.push.apply($scope.publish.selectLawyer.page.list, res.data.page.list);
                            res.data.page.list = $scope.publish.selectLawyer.page.list;
                            $scope.publish.selectLawyer.page = res.data.page;
                            console.log($scope.publish.selectLawyer.page.list)
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }
                },
                doRefresh: function () {
                    this.page = {currPage: 0, pages: 1, list: []};
                    this.loadMore();
                }
            },
            publish: function () {
                caseService.publishCase({
                    name: this.case.name,
                    mobile: this.case.mobile,
                    idCard: this.case.idCard,
                    content: this.case.content,
                    domainId: this.case.domainId,
                    city: vm.CityPickData.areaData[1],
                    minAmount: this.case.minAmount,
                    minAmount: this.case.minAmount,
                    maxAmount: this.case.maxAmount,
                    lawyerId: this.selectLawyer.lawyer.id
                }).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.releasemodal.hide();
                        }
                    });
                })
            }
        };

        // case详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/case-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseListmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/imgs-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imgmodalTitle = '';
            $scope.imgmodalType = 0;
            $scope.imgmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/addImg-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addImgModel = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/release-case.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.releasemodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/select-lawyer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectLawyerModel = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('personal-center/case-list/case-logs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseLogModal = modal;
        });

    })
    //关于平台
    .controller('aboutPlatform', function ($scope, $ionicModal) {
        // 使用向导
        $ionicModal.fromTemplateUrl('personal-center/about-platform/use-guide.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.useGuidemodal = modal;
        });
        // 关于平台
        $ionicModal.fromTemplateUrl('personal-center/about-platform/about-platform-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.aboutPlatformmodal = modal;
        });
    })
    //关于平台
    .controller('personalSetting', function ($rootScope, $scope, $state, $ionicModal, userService, commService) {

        userService.userInfo({}).then(function (res) {
            $scope.user = res.data.user;
        });

        $scope.outLogin = function () {
            localStorage.law_token = '';
            localStorage.law_role = '';
            $rootScope._role = null;
            $state.go('personalCenter.personalLogin');
        };

        $scope.bindwx = function () {
            userService.userBindWX({
                openId: localStorage.wxopenId ? localStorage.wxopenId : ''
            }).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        $scope.user.wxOpenId = localStorage.wxopenId;
                    }
                });
            });
        }
    })

    // 咨询模块
    // 咨询模块详情
    .controller('consultIndex', function ($templateCache, $q, $scope, $ionicModal, $stateParams, $filter, commService, lawyerService, orderService, evaluateService, $state) {
        $scope.reward = {
            lawyerId: 0,
            content: '',
            mobile: '',
            code: '',
            amount: '5'
        };

        $scope.getCode = function () {
            var deferred = $q.defer();
            commService.sendMobileCode({mobile: $scope.reward.mobile}).then(function (res) {
                deferred.resolve(res.code);
                commService.alertPopup(res.code, res.msg)
            });
            return deferred.promise;
        };

        // 打赏咨询modal
        $ionicModal.fromTemplateUrl('consult/reward-consult.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.rewardconsultmodal = modal;
        });

        $scope.rewardConsultShow = function (id) {
            $scope.reward = {
                lawyerId: 0,
                content: '',
                mobile: '',
                code: '',
                amount: '5'
            };
            $scope.reward.lawyerId = id;
            $scope.rewardconsultmodal.show();
        };

        $scope.wxPayInfo = {};

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.wxPayInfo,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功!').then(function () {
                            $scope.rewardconsultmodal.hide();
                            $scope.phoneconsultmodal.hide();
                            $scope.meetingmodal.hide();
                        })
                    }
                }
            );
        }

        $scope.rewardSubmit = function () {
            orderService.lawyerConsult({
                lawyerId: $scope.reward.lawyerId,
                content: $scope.reward.content,
                mobile: $scope.reward.mobile,
                code: $scope.reward.code,
                amount: $scope.reward.amount
            }).then(function (rep) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            });
        };

        $scope.phone = {
            lawyerId: 0,
            mobile: '',
            nick: ''
        };

        // 电话咨询modal
        $ionicModal.fromTemplateUrl('consult/phone-consult.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.phoneconsultmodal = modal;
        });

        $scope.phoneConsultShow = function (id) {
            $scope.phone = {
                lawyerId: 0,
                mobile: '',
                nick: '',
                lawyer: {}
            };
            lawyerService.lawyerInfo({lawyerId: id}).then(function (res) {
                $scope.phone.lawyer = res.data.lawyer
            });
            $scope.phone.lawyerId = id;
            $scope.phoneconsultmodal.show()
        }

        $scope.phoneSubmit = function () {
            orderService.lawyerMobile({
                lawyerId: $scope.phone.lawyerId,
                mobile: $scope.phone.mobile,
                nickName: $scope.phone.nickName
            }).then(function (rep) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            });
        };


        $scope.meet = {
            lawyerId: 0,
            contactName: '',
            contactMobile: '',
            idCard: '',
            content: '',
            meetTime: '',
            province: '',
            city: '',
            area: '',
            detailAddress: '',
            lawyer: {}
        }

        var vm = $scope.vm = {};
        vm.meetCityData = {
            areaData: ['请选择城市'],
            title: '地区',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };


        // meeting咨询modal
        $ionicModal.fromTemplateUrl('consult/apointment-meeting.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.meetingmodal = modal;
        });

        $scope.meetShow = function (id) {
            $scope.meet = {
                lawyerId: 0,
                contactName: '',
                contactMobile: '',
                idCard: '',
                content: '',
                meetTime: '',
                province: '',
                city: '',
                area: '',
                detailAddress: '',
                lawyer: {}
            }
            $scope.meet.lawyerId = id;
            lawyerService.lawyerInfo({lawyerId: id}).then(function (res) {
                $scope.meet.lawyer = res.data.lawyer
            });
            $scope.meetingmodal.show()
        };

        $scope.meetSubmit = function () {
            $scope.meet.province = vm.meetCityData.areaData[0];
            $scope.meet.city = vm.meetCityData.areaData[1];
            $scope.meet.area = vm.meetCityData.areaData[2];
            orderService.lawyerView({
                lawyerId: $scope.meet.lawyerId,
                contactName: $scope.meet.contactName,
                contactMobile: $scope.meet.contactMobile,
                idCard: $scope.meet.idCard,
                content: $scope.meet.content,
                meetTime: $filter('date')($scope.meet.meetTime, 'yyyy-MM-dd HH:mm:ss'),
                province: $scope.meet.province,
                city: $scope.meet.city,
                area: $scope.meet.area,
                detailAddress: $scope.meet.detailAddress
            }).then(function (rep) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            })
        };

        $scope.evaluateList = {
            lawyerId: 0,
            lawyer: {},
            page: {currPage: 0, pages: 1, total: 0, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    $scope.evaluateList.page.currPage += 1;
                    evaluateService.lawyerEvaluateList({
                        lawyerId: this.lawyerId,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.evaluateList.page.list, res.data.page.list);
                        res.data.page.list = $scope.evaluateList.page.list;
                        $scope.evaluateList.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        }

        // 用户评价modal
        $ionicModal.fromTemplateUrl('consult/user-rating.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.userratingmodal = modal;
        });

        $scope.evaluateListShow = function (id) {
            $scope.evaluateList.lawyerId = id;
            lawyerService.lawyerInfo({lawyerId: id}).then(function (res) {
                $scope.evaluateList.lawyer = res.data.lawyer
            });
            $scope.evaluateList.page = {currPage: 0, pages: 1, total: 0, list: []};
            $scope.evaluateList.loadMore();
            $scope.userratingmodal.show()
        }

        $scope.evaluate = {
            grade: 5,
            content: ''
        }

        // 提交用户评价modal
        $ionicModal.fromTemplateUrl('consult/post-rating.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.postratingmodal = modal;
        });

        $scope.postRatingShow = function () {
            $scope.evaluate = {
                grade: '5',
                content: ''
            }
            $scope.postratingmodal.show()
        }

        $scope.evaluateSubmit = function () {
            evaluateService.userEvaluate({
                lawyerId: $scope.evaluateList.lawyerId,
                grade: $scope.evaluate.grade,
                content: $scope.evaluate.content
            }).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function (rep) {
                    if (res.code >= 0) {
                        $scope.postratingmodal.hide();
                    }
                });
            });
        };

        $scope.consult = {
            domainId: 0,
            keyWord: '',
            page: {currPage: 0, pages: 1, list: []},
            searchKeyWord: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            searchDomain: function (domainId) {
                this.domainId = domainId;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    lawyerService.lawyerList({
                        keyWord: $scope.consult.keyWord,
                        city: localStorage.defaultCity ? localStorage.defaultCity : '',
                        domainId: this.domainId,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.consult.page.list, res.data.page.list);
                        res.data.page.list = $scope.consult.page.list;
                        $scope.consult.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        $scope.consult.loadMore();


        commService.domains().then(function (rep) {
            $scope.domains = rep.data.domains;
        });


    })
    // 咨询模块详情
    .controller('consultDetails', function ($q, $scope, $ionicModal, $filter, $stateParams, lawyerService, commService, orderService, $state) {

        // 过往案例详情
        $ionicModal.fromTemplateUrl('consult/consult-details/detalis.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.pastcasemodal = modal;
        });
        $scope.reward = {
            lawyerId: 0,
            content: '',
            mobile: '',
            code: '',
            amount: '5'
        };

        $scope.wxPayInfo = {};

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.wxPayInfo,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功!').then(function () {
                            $scope.rewardconsultmodal.hide();
                            $scope.phoneconsultmodal.hide();
                            $scope.meetingmodal.hide();
                        })
                    }
                }
            );
        }

        $scope.getCode = function () {
            var deferred = $q.defer();
            commService.sendMobileCode({mobile: $scope.reward.mobile}).then(function (res) {
                deferred.resolve(res.code);
                commService.alertPopup(res.code, res.msg)
            });
            return deferred.promise;
        };
        // 打赏咨询modal
        $ionicModal.fromTemplateUrl('consult/reward-consult.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.rewardconsultmodal = modal;
        });

        $scope.rewardConsultShow = function (id) {
            $scope.reward = {
                lawyerId: 0,
                content: '',
                mobile: '',
                code: '',
                amount: 5
            };
            $scope.reward.lawyerId = id;
            $scope.rewardconsultmodal.show();
        };

        $scope.rewardSubmit = function () {
            orderService.lawyerConsult({
                lawyerId: $scope.reward.lawyerId,
                content: $scope.reward.content,
                mobile: $scope.reward.mobile,
                code: $scope.reward.code,
                amount: $scope.reward.amount
            }).then(function (rep) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            });
        };

        $scope.phone = {
            lawyerId: 0,
            mobile: '',
            nick: ''
        };

        // 电话咨询modal
        $ionicModal.fromTemplateUrl('consult/phone-consult.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.phoneconsultmodal = modal;
        });

        $scope.phoneConsultShow = function (id) {
            $scope.phone = {
                lawyerId: 0,
                mobile: '',
                nick: '',
                lawyer: {}
            };
            lawyerService.lawyerInfo({lawyerId: id}).then(function (res) {
                $scope.phone.lawyer = res.data.lawyer
            });
            $scope.reward.lawyerId = id;
            $scope.phoneconsultmodal.show()
        };

        $scope.phoneSubmit = function () {
            orderService.lawyerMobile({
                lawyerId: $scope.phone.lawyerId,
                mobile: $scope.phone.mobile,
                nickName: $scope.phone.nickName
            }).then(function (res) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            });
        }


        $scope.meet = {
            lawyerId: 0,
            contactName: '',
            contactMobile: '',
            idCard: '',
            content: '',
            meetTime: '',
            province: '',
            city: '',
            area: '',
            detailAddress: '',
            lawyer: {}
        };

        var vm = $scope.vm = {};
        vm.meetCityData = {
            areaData: ['请选择城市'],
            title: '地区',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };


        // meeting咨询modal
        $ionicModal.fromTemplateUrl('consult/apointment-meeting.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.meetingmodal = modal;
        });

        $scope.meetShow = function (id) {
            $scope.meet = {
                lawyerId: 0,
                contactName: '',
                contactMobile: '',
                idCard: '',
                content: '',
                meetTime: '',
                province: '',
                city: '',
                area: '',
                detailAddress: '',
                lawyer: {}
            };
            $scope.meet.lawyerId = id;
            lawyerService.lawyerInfo({lawyerId: id}).then(function (res) {
                $scope.meet.lawyer = res.data.lawyer
            });
            $scope.meetingmodal.show()
        };

        $scope.meetSubmit = function () {
            $scope.meet.province = vm.meetCityData.areaData[0];
            $scope.meet.city = vm.meetCityData.areaData[1];
            $scope.meet.area = vm.meetCityData.areaData[2];
            orderService.lawyerView({
                lawyerId: $scope.meet.lawyerId,
                contactName: $scope.meet.contactName,
                contactMobile: $scope.meet.contactMobile,
                idCard: $scope.meet.idCard,
                content: $scope.meet.content,
                meetTime: $filter('date')($scope.meet.meetTime, 'yyyy-MM-dd HH:mm:ss'),
                province: $scope.meet.province,
                city: $scope.meet.city,
                area: $scope.meet.area,
                detailAddress: $scope.meet.detailAddress
            }).then(function (res) {
                if (rep.code < 0) {
                    commService.alertPopup(rep.code, rep.msg);
                } else {
                    commService.wxPayOrder({
                        orderId: rep.data.orderId,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.wxPayInfo = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            })
        };

        lawyerService.lawyerInfo({lawyerId: $stateParams.id}).then(function (rep) {
            $scope.lawyer = rep.data.lawyer;
        });

        lawyerService.lawyerCaseList({lawyerId: $stateParams.id, pageSize: 3}).then(function (rep) {
            $scope.caseList = rep.data.page.list;
        });

        $scope.pastcasemodalShow = function (id) {
            lawyerService.lawyerCaseInfo({caseId: id}).then(function (rep) {
                $scope.lawyerCaseInfo = rep.data.lawyerCase;
                $scope.pastcasemodal.show();
            });
        };

    })
    // 过往案例列表
    .controller('pastCaseList', function ($scope, $ionicModal, $stateParams, lawyerService, $state) {

        // 详情modal
        $ionicModal.fromTemplateUrl('consult/consult-details/detalis.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.pastcasemodal = modal;
        });
        $scope.pastcasemodalShow = function (id) {
            lawyerService.lawyerCaseInfo({caseId: id}).then(function (rep) {
                $scope.lawyerCaseInfo = rep.data.lawyerCase;
                $scope.pastcasemodal.show();
            });
        };

        lawyerService.lawyerInfo({lawyerId: $stateParams.id}).then(function (rep) {
            $scope.lawyer = rep.data.lawyer;
        });

        $scope.currPage = 0;
        $scope.list = [];

        $scope.loadMore = function () {
            $scope.currPage = $scope.currPage + 1;
            lawyerService.lawyerCaseList({
                lawyerId: $stateParams.id,
                currPage: $scope.currPage
            }).then(function (rep) {
                rep.data.page.list.forEach(function (val, index, arr) {
                    $scope.list.push(val);
                });
            });
        };

        $scope.loadMore();
    })


    // 日常法典
    .controller('daily', function ($scope, $ionicModal, commService, questionService, $state) {

        $scope.search = {
            domainId: 0,
            page: {currPage: 0, pages: 1, list: []},
            searchDomain: function (domainId) {
                this.domainId = domainId;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore()
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.pages > this.page.currPage) {
                    $scope.search.page.currPage += 1;
                    questionService.statuteBookList({
                        domainId: this.domainId,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.search.page.list, res.data.page.list);
                        res.data.page.list = $scope.search.page.list;
                        $scope.search.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        $scope.search.loadMore();

        commService.domains().then(function (rep) {
            $scope.domains = rep.data.domains;
        });

        $scope.answer = {
            questionId: 0,
            user: {},
            question: {},
            repay: {}
        }

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.repay.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功!').then(function () {
                            $state.go('personalCenter.heardIssue');
                        })
                    }
                }
            );
        }

        $scope.repay = {
            wxPay: {
                info: {},
                pay: function (id) {
                    commService.wxPayListen({repayId: id, openId: localStorage.wxopenId}).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.repay.wxPay.info = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            }
        }


        // 使用向导
        // 接收参数你可以
        // 详情modal
        // 偷看答案
        $ionicModal.fromTemplateUrl('share/daily/check-answer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.checkanswermodal = modal;
        });

        $scope.checkAnswerShow = function (id) {
            $scope.answer.questionId = id;
            questionService.questionInfo({questionId: id}).then(function (res) {
                $scope.answer.question = res.data.question;
                $scope.answer.user = res.data.user;
            });
            questionService.questionRepayList({questionId: id}).then(function (res) {
                $scope.answer.repay = res.data.page.list[0]
            });
            $scope.checkanswermodal.show();
        };


    })
    // 法聚观点
    .controller('lawyerViewPoint', function ($scope, $state, $ionicModal, $stateParams, commService, questionService) {

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.vp.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功,请前去我的中心查看').then(function () {
                            $state.go('personalCenter.heardIssue')
                        })
                    }
                }
            );
        }

        $scope.vp = {
            questionId: $stateParams.id,
            question: {},
            repays: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.repays.pages > 0 && this.repays.currPage <= this.repays.pages) {
                    $scope.vp.repays.currPage += 1;
                    questionService.questionRepayList({
                        questionId: this.question.id,
                        currPage: this.repays.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.vp.repays.list, res.data.page.list);
                        res.data.page.list = $scope.vp.repays.list;
                        $scope.vp.repays = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.repays = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            wxPay: {
                info: {},
                pay: function (id) {
                    commService.wxPayListen({repayId: id, openId: localStorage.wxopenId}).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.vp.wxPay.info = res.data.info;
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                }
                            } else {
                                onBridgeReady();
                            }
                        }
                    })
                }
            }
        };

        questionService.lawViewpoint({questionId: $scope.vp.questionId}).then(function (res) {
            $scope.vp.question = res.data.question;
            $scope.vp.loadMore();
        });

        $scope.vps = {
            pointDetail: function (id) {
                $state.go('share.lawyerViewPoint', {id: id});
                $scope.listmodal.hide();
            },
            page: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    $scope.vps.page.currPage += 1;
                    questionService.lawViewpointList({currPage: this.page.currPage}).then(function (res) {
                        Array.prototype.push.apply($scope.vps.page.list, res.data.page.list);
                        res.data.page.list = $scope.vps.page.list;
                        $scope.vps.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                questionService.lawViewpoint({questionId: $scope.vp.questionId}).then(function (res) {
                    $scope.vp.question = res.data.question;
                });
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        // 使用向导
        // 接收参数你可以
        // 详情modal
        // 偷看答案
        $ionicModal.fromTemplateUrl('share/lawyer-viewpoint/list.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.listmodal = modal;
        });

        $scope.listShow = function () {
            $scope.vps.loadMore();
            $scope.listmodal.show();
        };

        $scope.repay = {
            questionId: 0,
            questionContent: '',
            content: '',
            serverId: "",
            second: 0,
            price: '1'
        };

        $ionicModal.fromTemplateUrl('share/lawyer-viewpoint/report.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.reportmodal = modal;
        });

        $scope.reportShow = function (id, content) {
            $scope.repay.questionId = id;
            $scope.repay.questionContent = content;
            $scope.repay.content = '';
            $scope.repay.serverId = '';
            $scope.repay.second = 0;
            $scope.repay.price = '1';
            $scope.tape.second = 0;
            $scope.tape.startTime = 0;
            $scope.tape.endTime = 0;
            $scope.tape.localId = 0;
            $scope.reportmodal.show();
        };

        commService.getJSticket({url: location.href.split('#')[0]}).then(function (res) {
            if (res.code >= 0) {
                var sign = res.data.sign;
                delete sign.url;
                sign.debug = false;
                sign.jsApiList = ['startRecord', 'stopRecord', 'querySelector', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'querySelector', 'querySelector', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'];
                wx.config(sign);
            }
        });

        $scope.tape = {
            second: 0,
            startTime: 0,
            endTime: 0,
            cycSecondId: 0,
            localId: 0,
            isPlay: false,
            touchStart: function ($event) {
                if (this.isPlay) {
                    commService.alertPopup(-1, "当前正在播放，不能录音");
                    return;
                }
                ;
                this.reset($event);
                wx.startRecord({
                    success: function () {
                        $scope.tape.start();
                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
                wx.onVoiceRecordEnd({
                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                    complete: function (res) {
                        $scope.tape.localId = res.localId;
                        $scope.tape.complete();
                    }
                });

            },
            touchEnd: function ($event) {
                if (this.isPlay) {
                    return;
                }
                wx.stopRecord({
                    success: function (res) {
                        $scope.tape.localId = res.localId;
                        $scope.tape.complete();
                    }
                });

            },
            reset: function ($event) {
                this.second = 0;
                this.startTime = 0;
                this.endTime = 0;
                this.localId = 0;
                $event.target.innerHTML = '开始录音';
            },
            play: function ($event) {
                if (this.localId != 0) {
                    if (!this.isPlay) {
                        this.isPlay = true;
                        wx.playVoice({
                            localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
                        });
                        $event.target.innerHTML = '暂停';
                        wx.onVoicePlayEnd({
                            success: function (res) {
                                $scope.tape.isPlay = false;
                                $event.target.innerHTML = '播放';
                            }
                        });
                    } else {
                        this.isPlay = false;
                        wx.pauseVoice({
                            localId: this.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
                        });
                        $event.target.innerHTML = '播放';
                    }
                } else {
                    commService.alertPopup(-1, '请先录音');
                }
            },
            start: function () {
                $scope.tape.startTime = new Date().getTime();
                function cycSecond() {
                    $scope.tape.second += 1;
                    $scope.$apply();
                    if ($scope.tape.second == 60) {
                        $event.target.innerHTML = '开始录音';
                    } else {
                        $scope.tape.cycSecondId = setTimeout(cycSecond, 1000);
                    }
                };
                $scope.tape.cycSecondId = setTimeout(cycSecond, 1000);
                $event.target.innerHTML = '正在录音';
            },
            complete: function () {
                clearTimeout(this.cycSecondId);
                $scope.tape.endTime = new Date().getTime();
                if (($scope.tape.endTime - $scope.tape.startTime) / 1000 < 30) {
                    commService.alertPopup(-1, '录音时间不得低于30秒').then(function () {
                        $scope.tape.reset($event);
                    })
                } else {
                    if ($scope.tape.localId != 0) {
                        wx.uploadVoice({
                            localId: $scope.tape.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                $scope.repay.serverId = res.serverId;
                                $scope.repay.second = $scope.tape.second;
                            }
                        });
                    }
                    $event.target.innerHTML = '开始录音';
                }
            }
        };


        $scope.repaySubmit = function () {
            questionService.publishViewpoint($scope.repay).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        $scope.reportmodal.hide()
                    }
                });
            });
        };


    })
    .controller('proServiceMenu', function ($q, $scope, $ionicModal, $state) {


    })
    .controller('download', function ($q, $scope, userService, commService, productService, orderService, $ionicModal, $state) {

        $scope.dict = {
            '1': '劳动人事',
            '2': '买卖购销',
            '3': '债务债权',
            '4': '婚姻家庭',
            '5': '企业经营',
            '6': '诉讼文书'
        };

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.contract.wxPayInfo,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功').then(function () {
                            $state.go('personalCenter.myOrders')
                        })
                    }
                }
            );
        }

        productService.contractList({}).then(function (res) {
            $scope.contracts = res.data.map;
        });

        $scope.contract = {
            contractId: 0,
            contract: {},
            wxPayInfo: {},
            show: function (id) {
                this.contractId = id;
                productService.contractInfo({
                    contractId: id
                }).then(function (res) {
                    $scope.contract.contract = res.data.contract;
                    $scope.downloadmodal.show();
                })
            },
            download: function () {
                orderService.contractDownload({contractId: this.contractId}).then(function (rep) {
                    if (rep.code < 0) {
                        commService.alertPopup(rep.code, rep.msg);
                    } else {
                        commService.wxPayOrder({
                            orderId: rep.data.orderId,
                            openId: localStorage.wxopenId
                        }).then(function (res) {
                            if (res.code < 0) {
                                commService.alertPopup(res.code, res.msg);
                            } else {
                                $scope.contract.wxPayInfo = res.data.info;
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                } else {
                                    onBridgeReady();
                                }
                            }
                        })
                    }
                })
            }
        };


        $ionicModal.fromTemplateUrl('product-service/download/downloadmodal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.downloadmodal = modal;
        });

    })
    .controller('productDetail', function ($q, $scope, $stateParams, productService, lawyerService, orderService, commService, $ionicModal, $state) {

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.product.buy.wxPayInfo,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功').then(function () {
                            $scope.buyservicemodal.hide();
                        })
                    }
                }
            );
        }

        $scope.product = {
            id: $stateParams.id,
            product: {},
            buy: {
                content: '',
                show: function () {
                    $scope.buyservicemodal.show();
                },
                selectLawyer: {
                    lawyer: {id: 0},
                    page: {currPage: 0, pages: 1, list: []},
                    show: function () {
                        this.page = {currPage: 0, pages: 1, list: []}
                        this.loadMore();
                        $scope.buySelectLawyer.show();
                    },
                    select: function (item) {
                        this.lawyer = item;
                        $scope.buySelectLawyer.hide();
                    },
                    loadMore: function () {
                        if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                            this.page.currPage += 1;
                            lawyerService.lawyerList({currPage: this.page.currPage}).then(function (res) {
                                Array.prototype.push.apply($scope.product.buy.selectLawyer.page.list, res.data.page.list);
                                res.data.page.list = $scope.product.buy.selectLawyer.page.list;
                                $scope.product.buy.selectLawyer.page = res.data.page;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $scope.$broadcast('scroll.refreshComplete');
                            })
                        }
                    },
                    doRefresh: function () {
                        this.page = {currPage: 0, pages: 1, list: []};
                        this.loadMore();
                    }
                },
                wxPayInfo: {},
                paySubmit: function () {
                    orderService.addServiceOrder({
                        serviceId: $scope.product.id,
                        content: $scope.product.buy.content,
                        lawyerId: $scope.product.buy.selectLawyer.lawyer.id
                    }).then(function (rep) {
                        if (rep.code < 0) {
                            commService.alertPopup(rep.code, rep.msg);
                        } else {
                            commService.wxPayOrder({
                                orderId: rep.data.orderId,
                                openId: localStorage.wxopenId
                            }).then(function (res) {
                                if (res.code < 0) {
                                    commService.alertPopup(res.code, res.msg);
                                } else {
                                    $scope.product.buy.wxPayInfo = res.data.info;
                                    if (typeof WeixinJSBridge == "undefined") {
                                        if (document.addEventListener) {
                                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                        } else if (document.attachEvent) {
                                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                        }
                                    } else {
                                        onBridgeReady();
                                    }
                                }
                            })
                        }
                    })
                }
            }
        };
        productService.serviceInfo({serviceId: $stateParams.id}).then(function (res) {
            $scope.product.product = res.data.pack;
        });

        $ionicModal.fromTemplateUrl('product-service/product/buy-service-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.buyservicemodal = modal;
        });

        $ionicModal.fromTemplateUrl('product-service/product/select-lawyer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.buySelectLawyer = modal;
        });
    })
    .controller('selectUtils', function ($q, $scope, $ionicModal, $state) {

        $ionicModal.fromTemplateUrl('select-util/friend-link.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.friendLinkModel = modal;
        });

    })
    // 律师中心
    .controller('lawyerLogin', function ($q, $scope, $rootScope, $ionicModal, $state, lawyerService, commService) {

        $scope.login = {
            loginAgree: {},
            mobile: '',
            password: '',
            isAgree: false,
            login: function () {
                if (!this.isAgree) {
                    commService.alertPopup(-1, '请阅读并同意合同条款');
                } else {
                    lawyerService.lawyerLogin({
                        mobile: this.mobile,
                        password: this.password
                    }).then(function (res) {
                        if (res.code >= 0) {
                            localStorage.law_token = res.data.token;
                            localStorage.law_role = "lawyer";
                            $rootScope._role = "lawyer";
                        }
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code > 0) {
                                $state.go('lawyerCenter.centerList');
                            }
                        })
                    })
                }
            },
            wxLogin: function () {
                if (!this.isAgree) {
                    commService.alertPopup(-1, '请阅读并同意合同条款');
                } else {
                    lawyerService.wxLogin({
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code >= 0) {
                            localStorage.law_token = res.data.token;
                            localStorage.law_role = "lawyer";
                            $rootScope._role = "lawyer";
                        }
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code > 0) {
                                $state.go('lawyerCenter.centerList');
                            }
                        })
                    })
                }
            }

        };
        commService.getNews({newId: -1002}).then(function (res) {
            $scope.login.loginAgree = res.data.news;
        });

        $ionicModal.fromTemplateUrl('lawyer-center/personallogin/user-agreement.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.loginAgreeModel = modal;
        });

    })
    .controller('lawyerRegist', function ($q, $scope, commService, lawyerService, $ionicModal, $state) {
        $scope.info = {};
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择城市'],
            title: '地区',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.getCode = function () {
            var deferred = $q.defer();
            commService.sendMobileCode({mobile: $scope.info.mobile}).then(function (res) {
                deferred.resolve(res.code);
                commService.alertPopup(res.code, res.msg)
            });
            return deferred.promise;
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.register = function () {
            $scope.info.domainIds = '';
            angular.forEach($scope.domains, function (data) {
                if (data.checked) {
                    $scope.info.domainIds = $scope.info.domainIds + data.id + ',';
                }
            });
            $scope.info.province = vm.CityPickData.areaData[0];
            $scope.info.city = vm.CityPickData.areaData[1]
            $scope.info.area = vm.CityPickData.areaData[2];
            lawyerService.lawyerRegister($scope.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        $state.go('consult.index')
                    }
                })
            })
        }
    })
    .controller('lawyerCenter', function ($q, $scope, commService, lawyerService, $ionicModal, $state) {
        lawyerService.lawyerCenter({}).then(function (res) {
            $scope.lawyer = res.data.lawyer;
        });

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.lawyer.photoUrl = res;
                lawyerService.updateLawyerPhotoUrl({photoUrl: res}).then(function (rep) {
                    commService.alertPopup(rep.code, rep.msg);
                });
            });
        };
    })
    .controller('lawyerInfo', function ($q, $scope, commService, lawyerService, $ionicModal, $state) {
        var vm = $scope.vm = {};

        lawyerService.myInfoByLawyer({}).then(function (res) {
            $scope.lawyer = res.data.lawyer;
            if ($scope.lawyer.province) {
                vm.CityPickData = {
                    areaData: ['请选择城市'],
                    title: '地区',
                    defaultAreaData: [$scope.lawyer.province, $scope.lawyer.city, $scope.lawyer.area],
                    hardwareBackButtonClose: false,
                    cityPickers: localStorage.cityPickers
                };
            } else {
                vm.CityPickData = {
                    areaData: ['请选择城市'],
                    title: '地区',
                    hardwareBackButtonClose: false,
                    cityPickers: localStorage.cityPickers
                };
            }
            commService.domains().then(function (res) {
                $scope.domains = res.data.domains;
                angular.forEach($scope.domains, function (data) {
                    if ($scope.lawyer.domainIds.indexOf((data.id + ',')) >= 0) {
                        data.checked = true;
                    }
                })
            });
        });

        $scope.saveInfo = function () {
            $scope.lawyer.domainIds = '';
            angular.forEach($scope.domains, function (data) {
                if (data.checked) {
                    $scope.lawyer.domainIds = $scope.lawyer.domainIds + data.id + ',';
                }
            });
            lawyerService.saveLawyerInfo({
                province: vm.CityPickData.areaData[0],
                city: vm.CityPickData.areaData[1],
                area: vm.CityPickData.areaData[2],
                detailAddress: $scope.lawyer.detailAddress,
                domainIds: $scope.lawyer.domainIds,
                summary: $scope.lawyer.summary
            }).then(function (res) {
                commService.alertPopup(res.code, res.msg)
            })
        }
    })
    .controller('lawyerPastCase', function ($q, $scope, commService, lawyerService, $ionicModal, $state) {

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.pc.publish.info.pictureUrl = res;
            });
        };

        $scope.pc = {
            page: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    lawyerService.myLawyerCaseList({currPage: this.page.currPage}).then(function (res) {
                        Array.prototype.push.apply($scope.pc.page.list, res.data.page.list);
                        res.data.page.list = $scope.pc.page.list;
                        $scope.pc.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            detail: {
                detail: {},
                show: function (item) {
                    this.detail = item;
                    $scope.detailsmodal.show();
                }
            },
            publish: {
                info: {},
                show: function () {
                    this.info = {};
                    $scope.postcasemodal.show();
                },
                publish: function () {
                    lawyerService.publishLawyerCase({
                        title: this.info.title,
                        pictureUrl: this.info.pictureUrl,
                        content: this.info.content
                    }).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.pc.page = {currPage: 0, pages: 1, list: []};
                                $scope.pc.loadMore();
                                $scope.postcasemodal.hide();
                            }
                        })
                    })
                }
            }
        };

        $scope.pc.loadMore();


        $ionicModal.fromTemplateUrl('lawyer-center/pastCase/detalis.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.detailsmodal = modal;
        });
        $ionicModal.fromTemplateUrl('lawyer-center/pastCase/post-case.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.postcasemodal = modal;
        });
    })
    // 我的订单
    .controller('lawyerOrders', function ($scope, $sce, $ionicModal, orderService, commService) {

        $scope.sce = $sce.trustAsResourceUrl;

        $scope.dict = {
            orderStatus: {
                '-1': '订单取消',
                '0': '待付款',
                '1': '待处理',
                '2': '已完成'
            },
            orderType: {
                '1': '打赏咨询',
                '2': '电话咨询',
                '3': '预约咨询',
                '5': '合同下载',
                '10': '合同起草',
                '11': '合同审查',
                '12': '律师调解',
                '13': '律师函',
                '14': '律师见证'
            }
        };

        $scope.order = {
            type: 0,
            page: {currPage: 0, pages: 1, list: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    orderService.lawyerOrderList({
                        type: this.type,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.order.page.list, res.data.page.list);
                        res.data.page.list = $scope.order.page.list;
                        $scope.order.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        $scope.order.loadMore();

        $scope.detail = {
            data: {},
            show: function (id, type) {
                orderService.lawyerOrderInfo({orderId: id}).then(function (res) {
                    $scope.detail.data = res.data;
                });
                switch (type) {
                    case 1:
                        // 打赏咨询
                        $scope.rewardDetials.show();
                        break;
                    case 2:
                        // 电话咨询
                        $scope.phoneDetials.show();
                        break;
                    case 3:
                        // 预约咨询
                        $scope.meetingDetials.show();
                        break;
                    case 10:
                        // 合同起草
                        $scope.draftDetials.show();
                        break;
                    case 11:
                        // 合同审查
                        $scope.examinationDetials.show();
                        break;
                    case 12:
                        // 律师调解
                        $scope.lawyerMediationDetials.show();
                        break;
                    case 13:
                        // 律师函
                        $scope.lawyerletterDetials.show();
                        break;
                    case 14:
                        // 律师见证
                        $scope.lawyerWitnessDetials.show();
                        break;
                }
            }
        };

        $scope.reward = {
            info: {serverId: ""},
            repay: function (id) {
                orderService.consultRepay({
                    orderId: id,
                    serverId: this.info.serverId,
                    repayContent: this.info.repayContent,
                    second: $scope.tape.second
                }).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.order.page = {currPage: 0, pages: 1, list: []};
                            $scope.order.loadMore();
                            $scope.rewardDetials.hide();
                        }
                    })
                })
            }
        };

        commService.getJSticket({url: location.href.split('#')[0]}).then(function (res) {
            if (res.code >= 0) {
                var sign = res.data.sign;
                delete sign.url;
                sign.debug = false;
                sign.jsApiList = ['startRecord', 'stopRecord', 'querySelector', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'querySelector', 'querySelector', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'];
                wx.config(sign);
            }
        });

        $scope.tape = {
            second: 0,
            startTime: 0,
            endTime: 0,
            cycSecondId: 0,
            localId: 0,
            isPlay: false,
            touchStart: function ($event) {
                if (this.isPlay) {
                    commService.alertPopup(-1, "当前正在播放，不能录音");
                    return;
                }
                ;
                this.reset($event);
                wx.startRecord({
                    success: function () {
                        $scope.tape.start();
                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
                wx.onVoiceRecordEnd({
                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                    complete: function (res) {
                        $scope.tape.localId = res.localId;
                        $scope.tape.complete();
                    }
                });

            },
            touchEnd: function ($event) {
                if (this.isPlay) {
                    return;
                }
                wx.stopRecord({
                    success: function (res) {
                        $scope.tape.localId = res.localId;
                        $scope.tape.complete();
                    }
                });

            },
            reset: function ($event) {
                this.second = 0;
                this.startTime = 0;
                this.endTime = 0;
                this.localId = 0;
                $event.target.innerHTML = '开始录音';
            },
            play: function ($event) {
                if (this.localId != 0) {
                    if (!this.isPlay) {
                        this.isPlay = true;
                        wx.playVoice({
                            localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
                        });
                        $event.target.innerHTML = '暂停';
                        wx.onVoicePlayEnd({
                            success: function (res) {
                                $scope.tape.isPlay = false;
                                $event.target.innerHTML = '播放';
                            }
                        });
                    } else {
                        this.isPlay = false;
                        wx.pauseVoice({
                            localId: this.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
                        });
                        $event.target.innerHTML = '播放';
                    }
                } else {
                    commService.alertPopup(-1, '请先录音');
                }
            },
            start: function () {
                $scope.tape.startTime = new Date().getTime();
                function cycSecond() {
                    $scope.tape.second += 1;
                    $scope.$apply();
                    if ($scope.tape.second == 60) {
                        $event.target.innerHTML = '开始录音';
                    } else {
                        $scope.tape.cycSecondId = setTimeout(cycSecond, 1000);
                    }
                };
                $scope.tape.cycSecondId = setTimeout(cycSecond, 1000);
                $event.target.innerHTML = '正在录音';
            },
            complete: function () {
                clearTimeout(this.cycSecondId);
                $scope.tape.endTime = new Date().getTime();
                if (($scope.tape.endTime - $scope.tape.startTime) / 1000 < 30) {
                    commService.alertPopup(-1, '录音时间不得低于30秒').then(function () {
                        $scope.tape.reset($event);
                    })
                } else {
                    if ($scope.tape.localId != 0) {
                        wx.uploadVoice({
                            localId: $scope.tape.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                $scope.reward.info.serverId = res.serverId;
                            }
                        });
                    }
                    $event.target.innerHTML = '开始录音';
                }
            }
        };


        $scope.phone = {
            complete: function (id) {
                orderService.mobileComplete({
                    orderId: id
                }).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.order.page = {currPage: 0, pages: 1, list: []};
                            $scope.order.loadMore();
                            $scope.phoneDetials.hide();
                        }
                    })
                })
            }
        };

        var vm = $scope.vm = {};

        $scope.meet = {
            updateInfo: {
                info: {},
                show: function () {
                    this.info.meetTime = $scope.detail.data.orderMeet.meetTime;
                    this.info.province = $scope.detail.data.orderMeet.province;
                    this.info.city = $scope.detail.data.orderMeet.city;
                    this.info.area = $scope.detail.data.orderMeet.area;
                    this.info.detailAddress = $scope.detail.data.orderMeet.detailAddress;
                    vm.CityPickData = {
                        areaData: ['请选择代办区域'],
                        title: '预约地区',
                        defaultAreaData: [this.info.province, this.info.city, this.info.area],
                        hardwareBackButtonClose: false,
                        cityPickers: localStorage.cityPickers
                    };
                    $scope.updateMeetingDetials.show();
                },
                update: function (id) {
                    this.info.orderId = id;
                    orderService.updateMeetInfo(this.info).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                orderService.lawyerOrderInfo({orderId: id}).then(function (res) {
                                    $scope.detail.data = res.data;
                                    $scope.updateMeetingDetials.hide();
                                });
                            }
                        })
                    })
                }
            },
            complete: function (id) {
                orderService.completeMeet({orderId: id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            orderService.lawyerOrderInfo({orderId: id}).then(function (res) {
                                $scope.detail.data = res.data;
                            });
                        }
                    })
                })
            }
        };

        $scope.service = {
            complete: function (id) {
                orderService.completeService({orderId: id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            this.detail.data.order.status = 2;
                        }
                    })
                })
            }
        };


        // 悬赏订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/reward-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.rewardDetials = modal;
        });
        // 电话订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/phone-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.phoneDetials = modal;
        });
        // 会见订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/meeting-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.meetingDetials = modal;
        });
        // 修改预约会面信息
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/update-meet.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.updateMeetingDetials = modal;
        });
        // 律师见证订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/lawyer-witness-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.lawyerWitnessDetials = modal;
        });
        // 律师调解订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/lawyer-mediation-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.lawyerMediationDetials = modal;
        });
        // 律师函订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/lawyer-letter-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.lawyerletterDetials = modal;
        });
        // 合同审查订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/examination-contract-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.examinationDetials = modal;
        });
        // 起草合同订单详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-orders/order-details-modal/draft-contract-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.draftDetials = modal;
        });

    })

    //我的钱包
    .controller('myWallet', function ($scope, $ionicModal, lawyerService, commService) {

        lawyerService.myInfoByLawyer({}).then(function (res) {
            $scope.lawyer = res.data.lawyer
        });

        $scope.wallet = {
            page: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    lawyerService.tranList({
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.wallet.page.list, res.data.page.list);
                        res.data.page.list = $scope.wallet.page.list;
                        $scope.wallet.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            }
        };

        $scope.wallet.loadMore();

        $scope.withdraw = {
            info: {
                amount: 0,
                type: '1',
                zfbAccount: '',
                zfbName: '',
                yhkAccount: '',
                yhkName: ''
            },
            show: function () {
                this.info = {
                    amount: 0,
                    type: '1',
                    zfbAccount: '',
                    zfbName: '',
                    yhkAccount: '',
                    yhkName: ''
                };
                $scope.moneybackmodal.show();
            },
            submit: function () {
                lawyerService.withdraw(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            lawyerService.myInfoByLawyer({}).then(function (res) {
                                $scope.lawyer = res.data.lawyer
                            });
                            $scope.wallet.page = {currPage: 0, pages: 1, list: []};
                            $scope.wallet.loadMore();
                            $scope.moneybackmodal.hide();
                        }
                    })
                })
            }
        }

        $ionicModal.fromTemplateUrl('lawyer-center/my-wallet/money-back.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moneybackmodal = modal;
        });

    })
    // 案件列表
    .controller('lawyerCaseList', function ($scope, $ionicModal, caseService, caseLogService, commService) {

        $scope.dict = {
            status: {
                '-1': '审核失败',
                '0': '待审核',
                '1': '律师处理中',
                '2': '已完成'
            }
        };

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.case.detail.lawyerPic.add.info.pictureUrl = res;
            });
        };


        $scope.case = {
            type: 0,
            page: {currPage: 0, pages: 1, list: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    caseService.myCaseListByLawyer({
                        type: this.type,
                        currPaage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.case.page.list, res.data.page.list);
                        res.data.page.list = $scope.case.page.list;
                        $scope.case.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            detail: {
                info: {},
                show: function (id) {
                    caseService.caseInfo({caseId: id}).then(function (res) {
                        $scope.case.detail.info = res.data.case;
                        $scope.case.detail.msgs.loadMore();
                        $scope.caseListmodal.show();
                    })
                },
                userPic: {
                    list: [],
                    getList: function () {
                        caseService.casePictures({caseId: $scope.case.detail.info.id, type: 1}).then(function (res) {
                            $scope.case.detail.userPic.list = res.data.list;
                        })
                    },
                    show: function () {
                        this.getList();
                        $scope.imgmodalTitle = '用户的图片资料';
                        $scope.imgmodalType = 1;
                        $scope.imgmodal.show();
                    }
                },
                lawyerPic: {
                    list: [],
                    getList: function () {
                        caseService.casePictures({caseId: $scope.case.detail.info.id, type: 2}).then(function (res) {
                            $scope.case.detail.lawyerPic.list = res.data.list;
                        })
                    },
                    show: function () {
                        this.getList();
                        $scope.imgmodalTitle = '律师的图片资料';
                        $scope.imgmodalType = 2;
                        $scope.imgmodal.show();
                    },
                    del: function (id) {
                        caseService.delPicture({picId: id}).then(function (res) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $scope.case.detail.lawyerPic.getList();
                                }
                            })
                        });
                    },
                    add: {
                        info: {name: '', pictureUrl: ''},
                        show: function () {
                            this.info = {name: '', pictureUrl: ''};
                            $scope.addImgModel.show();
                        },
                        add: function () {
                            caseService.addPicture({
                                caseId: $scope.case.detail.info.id,
                                type: 2,
                                name: this.info.name,
                                pictureUrl: this.info.pictureUrl
                            }).then(function (res) {
                                commService.alertPopup(res.code, res.msg).then(function () {
                                    if (res.code >= 0) {
                                        $scope.case.detail.lawyerPic.getList();
                                        $scope.addImgModel.hide();
                                    }
                                })
                            })
                        }
                    }
                },
                msgs: {
                    page: {currPage: 0, pages: 1, list: []},
                    loadMore: function () {
                        if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                            this.page.currPage += 1;
                            caseService.caseMsgList({
                                caseId: $scope.case.detail.info.id,
                                currPage: this.page.currPage
                            }).then(function (res) {
                                Array.prototype.push.apply($scope.case.detail.msgs.page.list, res.data.page.list);
                                res.data.page.list = $scope.case.detail.msgs.page.list;
                                $scope.case.detail.msgs.page = res.data.page;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                        }
                    },
                    doRefresh: function () {
                        this.page = {currPage: 0, pages: 1, list: []};
                        this.loadMore();
                    },
                    publish: {
                        msg: {content: ''},
                        submit: function () {
                            caseService.lawyerAddCaseMsg({
                                caseId: $scope.case.detail.info.id,
                                content: this.msg.content
                            }).then(function (res) {
                                commService.alertPopup(res.code, res.msg).then(function () {
                                    if (res.code >= 0) {
                                        $scope.case.detail.msgs.publish.msg.content = '';
                                        $scope.case.detail.msgs.page = {currPage: 0, pages: 1, list: []};
                                        $scope.case.detail.msgs.loadMore();
                                    }
                                });
                            })
                        }
                    }
                },
                logs: {
                    info: {},
                    list: [],
                    show: function () {
                        this.load();
                        $scope.caseLogModal.show();
                    },
                    load: function () {
                        caseLogService.caseLogs({caseId: $scope.case.detail.info.id}).then(function (res) {
                            $scope.case.detail.logs.list = res.data.list;
                        })
                    },
                    addShow: function () {
                        this.info = {};
                        $scope.addLogModal.show();
                    },
                    add: function () {
                        this.info.caseId = $scope.case.detail.info.id;
                        caseLogService.addCaseLog(this.info).then(function (res) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $scope.case.detail.logs.load();
                                    $scope.addLogModal.hide();
                                }
                            })
                        })
                    }
                }
            }
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择城市'],
            title: '诉讼区域',
            selectLevel: 2,
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.publish = {
            case: {name: '', mobile: '', idCard: '', content: '', domainId: '2', city: '', minAmount: 0, maxAmount: 0},
            openShow: function () {
                this.case = {
                    name: '',
                    mobile: '',
                    idCard: '',
                    content: '',
                    domainId: '2',
                    city: '',
                    minAmount: 0,
                    maxAmount: 0
                };
                $scope.releasemodal.show();
            },
            publish: function () {
                caseService.publishCaseByLawyer({
                    name: this.case.name,
                    mobile: this.case.mobile,
                    idCard: this.case.idCard,
                    content: this.case.content,
                    domainId: this.case.domainId,
                    city: vm.CityPickData.areaData[1],
                    minAmount: this.case.minAmount,
                    minAmount: this.case.minAmount,
                    maxAmount: this.case.maxAmount
                }).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.case.doRefresh();
                            $scope.releasemodal.hide();
                        }
                    });
                })
            }
        };


        $scope.case.loadMore();

        // case详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/case-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseListmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/imgs-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imgmodalTitle = '';
            $scope.imgmodalType = 0;
            $scope.imgmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/addImg-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addImgModel = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/case-logs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseLogModal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/add-log.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addLogModal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('lawyer-center/case-list/release-case.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.releasemodal = modal;
        });
    })
    // 我的代办
    .controller('lawyerAgency', function ($scope, $ionicModal, entrustService, commService) {

        $scope.dict = {
            '-2': '已过期',
            '-1': '已取消',
            '0': '待付款',
            '1': '待接单',
            '2': '处理中',
            '3': '已完成'
        };

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.entrusts.publish.wxPayInfo,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功').then(function () {
                            $scope.entrusts.type = 0;
                            $scope.entrusts.page = {currPage: 0, pages: 1, list: []};
                            $scope.entrusts.loadMore();
                            $scope.postagency.hide();
                        })
                    }
                }
            );
        }

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择代办区域'],
            title: '代办区域',
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.entrusts = {
            type: 0,
            page: {currPage: 0, pages: 1, list: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    entrustService.lawyerEntrustList({
                        type: this.type,
                        currPage: this.page.currPage
                    }).then(function (res) {
                        Array.prototype.push.apply($scope.entrusts.page.list, res.data.page.list);
                        res.data.page.list = $scope.entrusts.page.list;
                        $scope.entrusts.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            detail: {
                info: {},
                lawyer: {},
                show: function (id) {
                    entrustService.entrustInfo({entrustId: id}).then(function (res) {
                        $scope.entrusts.detail.info = res.data.info;
                        $scope.entrusts.detail.lawyer = res.data.lawyer;
                        $scope.agencyDetials.show();
                    })
                },
                confirm: function () {
                    entrustService.confirmEntrust({entrustId: this.info.id}).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.entrusts.detail.info.status = 3;
                            }
                        })
                    })
                }
            },
            publish: {
                info: {},
                wxPayInfo: {},
                show: function () {
                    this.info = {};
                    $scope.postagency.show();
                },
                publish: function () {
                    this.info.province = vm.CityPickData.areaData[0];
                    this.info.city = vm.CityPickData.areaData[1];
                    this.info.area = vm.CityPickData.areaData[2];
                    entrustService.publishEntrust(this.info).then(function (rep) {
                        if (rep.code < 0) {
                            commService.alertPopup(rep.code, rep.msg);
                        } else {
                            $scope.wxPayDo(rep.data.entrustId)
                        }
                    })
                }
            },
            cancel: function (id) {
                entrustService.cancelEntrust({entrustId: id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.entrusts.page = {currPage: 0, pages: 1, list: []};
                            $scope.entrusts.loadMore();
                        }
                    })
                })
            }
        };

        $scope.entrusts.loadMore();

        $scope.wxPayDo = function (id) {
            commService.wxPayEntrust({
                entrustId: id,
                openId: localStorage.wxopenId
            }).then(function (res) {
                if (res.code < 0) {
                    commService.alertPopup(res.code, res.msg);
                } else {
                    $scope.entrusts.publish.wxPayInfo = res.data.info;
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }
            })
        }


        // 支付
        $ionicModal.fromTemplateUrl('lawyer-center/my-agency/pay-now.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // 发布代办
        $ionicModal.fromTemplateUrl('lawyer-center/my-agency/order-details-modal/post-agency.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.postagency = modal;
        });
        // 代办详情
        $ionicModal.fromTemplateUrl('lawyer-center/my-agency/order-details-modal/agency-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agencyDetials = modal;
        });
    })

    //关于平台
    .controller('lawyerAboutPlatform', function ($scope, $ionicModal) {
        // 使用向导
        $ionicModal.fromTemplateUrl('lawyer-center/about-platform/use-guide.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.useGuidemodal = modal;
        });
        // 关于平台
        $ionicModal.fromTemplateUrl('lawyer-center/about-platform/about-platform-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.aboutPlatformmodal = modal;
        });
    })
    //设置
    .controller('lawyerSetting', function ($scope, $rootScope, lawyerService, commService, $state) {
        lawyerService.myInfoByLawyer({}).then(function (res) {
            $scope.lawyer = res.data.lawyer;
        });

        $scope.outLogin = function () {
            localStorage.law_token = '';
            localStorage.law_role = '';
            $rootScope._role = null;
            $state.go('lawyerCenter.login');
        };

        $scope.bindwx = function () {
            lawyerService.lawyerBindWX({
                openId: localStorage.wxopenId ? localStorage.wxopenId : ''
            }).then(function (res) {
                this.lawyer.wxOpenId = localStorage.wxopenId;
                commService.alertPopup(res.code, res.msg);
            });
        }
    })
    // 委托代办
    .controller('concierge', function ($scope, $ionicModal, entrustService, commService) {

        $scope.entrust = {
            page: {currPage: 0, pages: 1, list: []},
            loadMore: function () {
                if (this.page.pages > 0 && this.page.currPage < this.page.pages) {
                    this.page.currPage += 1;
                    entrustService.entrustList({currPage: this.page.currPage}).then(function (res) {
                        Array.prototype.push.apply($scope.entrust.page.list, res.data.page.list);
                        res.data.page.list = $scope.entrust.page.list;
                        $scope.entrust.page = res.data.page;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {currPage: 0, pages: 1, list: []};
                this.loadMore();
            },
            detail: {
                info: {},
                lawyer: {},
                show: function (id) {
                    entrustService.entrustInfo({entrustId: id}).then(function (res) {
                        $scope.entrust.detail.info = res.data.info;
                        $scope.entrust.detail.lawyer = res.data.lawyer;
                        $scope.conciergedetailsmodal.show();
                    });
                },
                apply: function () {
                    entrustService.applyEntrust({entrustId: this.info.id}).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.entrust.detail.info.status = 2;
                            }
                        });
                    })
                }
            }
        };

        $scope.entrust.loadMore();


        // 委托详情
        $ionicModal.fromTemplateUrl('concierge/concierge-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.conciergedetailsmodal = modal;
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
        }
    })

;




