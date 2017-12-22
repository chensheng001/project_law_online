/**
 * Created by xieiqng on 2017/6/23.
 */
lawApp = angular.module('becomeMember', ['ionic', 'ionic-citypicker', 'ngTouch']);

// 拦截器配置
lawApp.factory('httpInterceptor', function ($q, $rootScope) {
    var httpInterceptor = {
        'responseError': function (response) {
            return $q.reject(response);
        },
        'response': function (response) {
            if (response.data.code == -800 || response.data.code == -700) {
                $rootScope.$emit('checkOut');
                return $q.reject(response);
            } else {
                return response;
            }
        },
        'request': function (config) {
            if (config.method == 'POST' && localStorage.union_token) {
                config.headers.token = localStorage.union_token;
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

lawApp.run(['$rootScope', '$ionicHistory', '$state', 'commService', function ($rootScope, $ionicHistory, $state, commService) {

    $rootScope.api_host = 'http://www.gdfxzx.com/fxcu';
    // $rootScope.api_host = 'http://127.0.0.1:8090';

    $rootScope.$on('checkOut', function () {
        localStorage.union_token = '';
        localStorage.union_role = '';
        $rootScope._role = null;
        commService.alertPopup(-800, '请先登录').then(function () {
            $state.go('memberLogin', {}, {location: 'replace'});
        });
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
    commService.getSystemOptions().then(function (res) {
        $rootScope._so = res.data.so;
    });

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.name == "lawyerCenter.index") {
                if (localStorage.union_role == 'user') {
                    $state.go('memberCenter.index', {}, {location: 'replace'});
                    event.preventDefault();
                    return;
                }
            }
            if (toState.name == "memberCenter.index") {
                if (localStorage.union_role == 'lawyer') {
                    $state.go('lawyerCenter.index', {}, {location: 'replace'});
                    event.preventDefault();
                    return;
                }
            }

        });


}]);

lawApp.filter('javaDate', function ($filter) {
    return function (input, format) {
        if (input) {
            var timestamp = input;
            return $filter("date")(timestamp, format);
        } else {
            return "";
        }
    }
});

lawApp.filter('timeStr', function ($filter) {
    return function (input, format) {
        if (input) {
            var timestamp = input;
            return $filter("date")(timestamp, format);
        } else {
            return "";
        }
    }
});

lawApp.controller('becomeMemberCtrl', function ($rootScope, $scope, $ionicModal, userService, commService) {

    $scope.slideBoxClick = function (index) {
        console.log(index)
        switch (index) {
            case 0:
                $scope.showIntroductionModal('./become-member/introduction/persen-introduct.html');
                break;
            case 1:
                $scope.showIntroductionModal('./become-member/introduction/experience-introduct.html');
                break;
            case 2:
                $scope.showIntroductionModal('./become-member/introduction/basics-introduct.html');
                break;
            case 3:
                $scope.showIntroductionModal('./become-member/introduction/vip-introduct.html');
                break;
            case 4:
                $scope.showIntroductionModal('./become-member/introduction/adviser-introduct.html');
                break;
            case 5:
                $scope.showIntroductionModal('./become-member/introduction/mechanism-introduct.html');
                break;
        }
    };

    $scope.showIntroductionModal = function (url) {
        $ionicModal.fromTemplateUrl(url, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.introductModal = modal;
            $scope.introductModal.show();
        });
    };

    userService.userPrices().then(function (res) {
        if (res.code < 0) {
            commService.alertPopup(res.code, res.msg);
        } else {
            $scope.prices = res.data.prices;
        }
    })


})
// 个人会员
    .controller('personalRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        $scope.persen = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                userService.personalRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // 企业体验会员
    .controller('experienceRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };
        $scope.attemp = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                userService.attemptBusiRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // 基础企业会员
    .controller('basicsRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };
        $scope.basics = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                userService.basicBusiRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // VIP顾问会员
    .controller('vipRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };
        $scope.vip = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                userService.vipAdviserRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // 顾问会员
    .controller('adviserRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };
        $scope.adviser = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                userService.adviserRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // 机构服务会员
    .controller('mechanismRegister', function ($scope, $state, $ionicModal, commService, userService) {
        $ionicModal.fromTemplateUrl('./become-member/popover/agree.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.agreeModal = modal;
        });
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };
        $scope.business = {
            info: {},
            submit: function () {
                if (!$scope.isAgree) {
                    commService.alertPopup(-1, '请同意电子合同条款');
                    return;
                }
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                userService.busiServiceRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberLogin', {}, {location: 'replace'})
                        }
                    })
                })
            }
        };
    })
    // 律师会员
    .controller('lawyerRegister', function ($scope, $state, commService, lawyerService) {
        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '办公地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.lawyer = {
            info: {},
            submit: function () {
                this.info.domainIds = '';
                angular.forEach($scope.domains, function (data) {
                    if (data.checked) {
                        $scope.lawyer.info.domainIds = $scope.lawyer.info.domainIds + data.id + ',';
                    }
                });
                this.info.province = $scope.vm.CityPickData.areaData[0];
                this.info.city = $scope.vm.CityPickData.areaData[1];
                this.info.area = $scope.vm.CityPickData.areaData[2];
                lawyerService.lawyerRegister(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg);
                })
            }
        };
    })
    .controller('memberLogin', function ($rootScope, $scope, $ionicModal, $ionicHistory, $state, $ionicPopover, lawyerService, commService, userService, payOrderService) {

        $ionicModal.fromTemplateUrl('member-login/select-lawyer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectLawyerModel = modal;
        });

        if (localStorage.union_token) {
            if (localStorage.union_role == 'user') {
                $state.go('memberCenter.index', {}, {location: 'replace'});
                return;
            }
            if (localStorage.union_role == 'lawyer') {
                $state.go('lawyerCenter.index', {}, {location: 'replace'});
                return;
            }
        }

        $scope.selectLawyer = {
            lawyer: {},
            page: {number: -1, totalPages: 1, content: []},
            show: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
                $scope.selectLawyerModel.show();
            },
            hide: function () {
                $scope.selectLawyerModel.hide();
            },
            select: function (item) {
                this.lawyer = item;
                userService.selectLawyer({
                    name: $scope.login.info.name,
                    password: $scope.login.info.password,
                    lawyerId: item.id
                }).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        $scope.selectLawyerModel.hide();
                    })
                });
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    lawyerService.lawyerList({currPage: this.page.number}).then(function (res) {
                        $scope.selectLawyer.page = commService.addPage($scope.selectLawyer.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };


        $scope.wxPay = {
            info: {}
        };

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功').then(function () {
                            $scope.selectLawyer.show();
                        })
                    }
                }
            );
        }

        $scope.login = {
            info: {},
            submit: function () {
                userService.login(this.info).then(function (res) {
                    if ($scope.login.info.type == '10') {
                        if (res.code >= 0) {
                            localStorage.union_token = res.data.token;
                            localStorage.union_role = "lawyer";
                            $rootScope._role = "lawyer";
                        }
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $state.go('lawyerCenter.index', {}, {location: 'replace'});
                            }
                        })
                    } else {
                        if (res.code == -10) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                // 前去支付
                                payOrderService.payByOrderNo({
                                    orderNo: res.data.orderNo,
                                    openId: localStorage.wxopenId
                                }).then(function (res) {
                                    if (res.code < 0) {
                                        commService.alertPopup(res.code, res.msg);
                                    } else {
                                        $scope.wxPay.info = res.data.payInfo;
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
                            })
                        } else if (res.code == -11) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                //前去选择律师
                                $scope.selectLawyer.show();
                            })
                        } else {
                            if (res.code >= 0) {
                                localStorage.union_token = res.data.token;
                                localStorage.union_role = "user";
                                $rootScope._role = "user";
                            }
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $state.go('memberCenter.index');
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    // 会员中心（会员）
    .controller('memberCenter', function ($scope, $state, $ionicModal, $ionicHistory, userService, commService) {
        if (localStorage.union_token) {
            if (localStorage.union_role == 'lawyer') {
                $state.go('lawyerCenter.index', {}, {location: 'replace'});
                return;
            }
        }

        $scope.slideBoxClick = function () {
            switch ($scope.user.type) {
                case 1:
                    $scope.showIntroductionModal('./become-member/introduction/persen-introduct.html');
                    break;
                case 2:
                    $scope.showIntroductionModal('./become-member/introduction/experience-introduct.html');
                    break;
                case 3:
                    $scope.showIntroductionModal('./become-member/introduction/basics-introduct.html');
                    break;
                case 4:
                    $scope.showIntroductionModal('./become-member/introduction/adviser-introduct.html');
                    break;
                case 5:
                    $scope.showIntroductionModal('./become-member/introduction/vip-introduct.html');
                    break;
                case 6:
                    $scope.showIntroductionModal('./become-member/introduction/mechanism-introduct.html');
                    break;
            }
        };

        $scope.showIntroductionModal = function (url) {
            $ionicModal.fromTemplateUrl(url, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.introductModal = modal;
                $scope.introductModal.show();
            });
        };

        userService.userInfo().then(function (res) {
            if (res.code < 0) {
                commService.alertPopup(res.code, res.msg);
            } else {
                $scope.user = res.data.user;
            }
        })
    })
    // 我的资料（会员）
    .controller('memberMyInfo', function ($scope, userService, commService) {
        userService.userInfo().then(function (res) {
            $scope.user = res.data.user;
        });

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.user.photoUrl = res;
                userService.updateUserPhoto({photoUrl: res}).then(function (rep) {
                });
            });
        };

    })
    // 服务大全（会员）
    .controller('allServiceCtrl', function ($scope) {

    })
    // 服务大全（提问咨询）
    .controller('questionsConsult', function ($scope, userService, serviceService, commService) {
        var init = function () {
            userService.getUserNum({serviceId: 1}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
        };

        init();

        $scope.que = {
            info: {},
            submit: function () {
                serviceService.consult(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.que.info = {};
                            init();
                        }
                    })
                })
            }
        }
    })
    // 服务大全（电话咨询）
    .controller('phoneConsult', function ($scope, userService, serviceService, commService) {
        var init = function () {
            userService.getUserNum({serviceId: 2}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
            userService.myLawyer().then(function (res) {
                $scope.lawyer = res.data.lawyer;
            })
        };

        init();

        $scope.payService = function () {
            serviceService.mobileConsult().then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        init();
                    }
                })
            })
        }

    })
    // 服务大全（预约会面）
    .controller('appointmentMeetting', function ($scope, userService, serviceService, commService) {
        var init = function () {
            userService.getUserNum({serviceId: 3}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
            userService.myLawyer().then(function (res) {
                $scope.lawyer = res.data.lawyer;
            })
        };

        init();

        $scope.info = {};

        $scope.payService = function () {
            serviceService.viewMeeting($scope.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        init();
                    }
                })
            })
        }

    })
    .controller('downloadCtrl', function ($scope, $ionicPopover, serviceService, userService, commService) {
        $ionicPopover.fromTemplateUrl('member-center/allService/popover/contract.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        var init = function () {
            serviceService.contracts().then(function (res) {
                $scope.contracts = res.data.map;
            })
        };
        init();

        $scope.detail = {
            info: {},
            show: function (item) {
                this.info = item;
                userService.getUserNum({serviceId: 4}).then(function (res) {
                    $scope.userNum = res.data.userNum;
                });
                $scope.popover.show();
            },
            payService: function () {
                $scope.popover.hide();
                $state.go('memberCenter.buyProductService');
            },
            downLoad: function (id) {
                serviceService.payContract({id: id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            userService.getUserNum({serviceId: 4}).then(function (res) {
                                $scope.userNum = res.data.userNum;
                            });
                        }
                    })
                })
            }
        }
    })
    .controller('draftContract', function ($scope, $ionicPopover, serviceService, userService, commService) {

        var init = function () {
            serviceService.serviceInfo({id: 5}).then(function (res) {
                $scope.service = res.data.service;
            });
            userService.getUserNum({serviceId: 5}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
        };
        init();

        $scope.info = {};

        $scope.submit = function () {
            serviceService.contractWrite(this.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        userService.getUserNum({serviceId: 5}).then(function (res) {
                            $scope.userNum = res.data.userNum;
                        });
                    }
                })
            })
        }
    })
    .controller('checkContract', function ($scope, $ionicPopover, serviceService, userService, commService) {
        var serviceId = 6;
        var init = function () {
            serviceService.serviceInfo({id: serviceId}).then(function (res) {
                $scope.service = res.data.service;
            });
            userService.getUserNum({serviceId: serviceId}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
        };
        init();
        $scope.submit = function () {
            serviceService.contractInverstigate().then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        userService.getUserNum({serviceId: serviceId}).then(function (res) {
                            $scope.userNum = res.data.userNum;
                        });
                    }
                })
            })
        }
    })
    .controller('checkWind', function ($scope, $ionicPopover, $filter, serviceService, userService, commService) {
        var serviceId = 7;
        var init = function () {
            serviceService.serviceInfo({id: serviceId}).then(function (res) {
                $scope.service = res.data.service;
            });
            userService.getUserNum({serviceId: serviceId}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
        };
        init();

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地点'],
            title: '见面地点',
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.info = {};
        $scope.submit = function () {
            $scope.info.method = $scope.checkType ? 2 : 1;
            $scope.info.meetTime = $scope.info.meetTime ? $filter('date')($scope.info.meetTime, 'yyyy-MM-dd') : '';
            $scope.info.province = vm.CityPickData.areaData[0];
            $scope.info.city = vm.CityPickData.areaData[1];
            $scope.info.area = vm.CityPickData.areaData[2];
            serviceService.riskContract($scope.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        userService.getUserNum({serviceId: serviceId}).then(function (res) {
                            $scope.userNum = res.data.userNum;
                        });
                    }
                })
            })
        }
    })
    .controller('normalService', function ($scope, $ionicNavBarDelegate, $ionicPopover, $stateParams, $filter, serviceService, userService, commService) {
        var serviceId = $stateParams.id;
        var init = function () {
            $scope.serviceId = serviceId;
            serviceService.serviceInfo({id: serviceId}).then(function (res) {
                $scope.service = res.data.service;
                $ionicNavBarDelegate.changeTitle($scope.service.name);
            });
            userService.getUserNum({serviceId: serviceId}).then(function (res) {
                $scope.userNum = res.data.userNum;
            });
        };
        init();

        $scope.info = {};
        $scope.submit = function () {
            $scope.info.serviceId = serviceId;
            serviceService.payService($scope.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        userService.getUserNum({serviceId: serviceId}).then(function (res) {
                            $scope.userNum = res.data.userNum;
                        });
                    }
                })
            })
        }
    })

    // 案件列表
    .controller('caseListCtrl', function ($scope, $ionicModal, caseLogService, caseService, commService, lawyerService) {

        $scope.dict = {
            status: {
                '-1': '审核失败',
                '0': '待审核',
                '1': '律师处理中',
                '2': '已完成'
            }
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.case = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    caseService.userCaseList({
                        type: this.type,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.case.page = commService.addPage($scope.case.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

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
                        caseService.addUserPicture({
                            caseId: $scope.detail.caseId,
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
                    $scope.imgmodalTitle = '会员的图片资料';
                    $scope.imgmodalType = 1;
                    $scope.imgmodal.show();
                }
            },
            msgs: {
                msg: {content: ''},
                page: {number: -1, totalPages: 1, content: []},
                submit: function () {
                    caseService.userAddCaseMsg({
                        caseId: $scope.detail.caseId,
                        content: $scope.detail.msgs.msg.content
                    }).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.detail.msgs.msg.content = '';
                                $scope.detail.msgs.page = {number: -1, totalPages: 1, content: []};
                                $scope.detail.msgs.loadMore();
                            }
                        });
                    })
                },
                loadMore: function () {
                    if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                        this.page.number += 1;
                        caseService.caseMsgList({
                            caseId: $scope.detail.caseId,
                            currPage: this.page.number
                        }).then(function (res) {
                            $scope.detail.msgs.page = commService.addPage($scope.detail.msgs.page, res.data.page);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }
                },
                doRefresh: function () {
                    this.page = {number: -1, totalPages: 1, content: []};
                    this.loadMore();
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
                    caseLogService.caseLogs({caseId: $scope.detail.caseId}).then(function (res) {
                        $scope.detail.logs.list = res.data.cases;
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
            publish: function () {
                caseService.publishCase({
                    name: this.case.name,
                    mobile: this.case.mobile,
                    idCard: this.case.idCard,
                    content: this.case.content,
                    domainId: this.case.domainId,
                    province: vm.CityPickData.areaData[0],
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

        // case详情
        $ionicModal.fromTemplateUrl('./member-center/case-list/case-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseListmodal = modal;
        });
        // 案件进展日志
        $ionicModal.fromTemplateUrl('./member-center/case-list/case-logs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseLogModal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('./member-center/case-list/imgs-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imgmodalTitle = '';
            $scope.imgmodalType = 0;
            $scope.imgmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('./member-center/case-list/addImg-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addImgModel = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('./member-center/case-list/release-case.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.releasemodal = modal;
        });

    })
    // 我的订单列表（会员）
    .controller('myOrdersCtrl', function ($scope, $sce, $ionicModal, orderService, commService) {
        // 悬赏订单详情
        $ionicModal.fromTemplateUrl('member-center/my-orders/order-details-modal/reward-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.rewardDetials = modal;
        });
        // 电话订单详情
        $ionicModal.fromTemplateUrl('member-center/my-orders/order-details-modal/phone-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.phoneDetials = modal;
        });
        // 会见订单详情
        $ionicModal.fromTemplateUrl('member-center/my-orders/order-details-modal/meeting-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.meetingDetials = modal;
        });
        // 下载合同订单详情
        $ionicModal.fromTemplateUrl('member-center/my-orders/order-details-modal/download-contract-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.downloadDetials = modal;
        });
        // 通用服务订单详情
        $ionicModal.fromTemplateUrl('member-center/my-orders/order-details-modal/service-order-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.serviceOrderDetail = modal;
        });

        $scope.sce = $sce.trustAsResourceUrl;
        $scope.order = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    orderService.userOrderList({
                        type: this.type,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.order.page = commService.addPage($scope.order.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.order.doRefresh();

        $scope.detail = {
            orderId: 0,
            data: {},
            openDetail: function (id, serviceId) {
                orderService.userOrderInfo({id: id}).then(function (res) {
                    $scope.detail.data = res.data;
                });
                switch (serviceId) {
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
                    case 4:
                        // 合同下载
                        $scope.downloadDetials.show();
                        break;
                    default:
                        //其他服务订单
                        $scope.serviceOrderDetail.show();
                        break;
                }
            }
        };


    })

    // 用户听过的问题
    .controller('heardIssueCtrl', function ($scope, $sce, $ionicModal, questionService, commService) {

        $scope.sce = $sce.trustAsResourceUrl;

        $scope.detail = {
            question: {},
            lawyer: {},
            repay: {}
        };

        $ionicModal.fromTemplateUrl('./member-center/heard-issue/heard-issue-details.html', {
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
                $scope.detail.payRecord = res.data.payRecord;
            });
            $scope.modal.show();
        };

        $scope.que = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    questionService.userQuestionList({currPage: this.page.number}).then(function (res) {
                        $scope.que.page = commService.addPage($scope.que.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };
        $scope.que.loadMore();
    })
    // 我的个人律师
    .controller('myLawyerCtrl', function ($scope, $sce, $ionicModal, userService, evaluateService, commService, lawyerService) {
        // 提交用户评价modal
        $ionicModal.fromTemplateUrl('./member-center/myLawyer/post-rating.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.postratingmodal = modal;
        });

        // 更换律师modal
        $ionicModal.fromTemplateUrl('./member-center/myLawyer/replace-lawyer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.replaceLawyerModal = modal;
        });

        // 选择律师model
        $ionicModal.fromTemplateUrl('./member-center/myLawyer/select-lawyer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectLawyerModal = modal;
        });

        $scope.evaluate = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    evaluateService.lawyerEvaluateList({
                        lawyerId: $scope.lawyer.id,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.evaluate.page = commService.addPage($scope.evaluate.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                userService.myLawyer().then(function (res) {
                    $scope.lawyer = res.data.lawyer;
                    $scope.evaluate.page = {number: -1, totalPages: 1, content: []};
                    $scope.evaluate.loadMore();
                });
            }
        };

        $scope.evaluate.doRefresh();

        $scope.postRating = {
            info: {},
            show: function () {
                this.info = {grade: '5'};
                $scope.postratingmodal.show()
            },
            submit: function () {
                this.info.lawyerId = $scope.lawyer.id;
                evaluateService.userEvaluate(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.postratingmodal.hide();
                        }
                    })
                })
            }
        };

        $scope.replace = {
            info: {lawyerId: 0},
            show: function () {
                this.info = {};
                $scope.replaceLawyerModal.show();
            },
            noLawyer: function () {
                this.lawyer.lawyer = {};
            },
            lawyer: {
                lawyer: {},
                page: {number: -1, totalPages: 1, content: []},
                show: function () {
                    this.page = {number: -1, totalPages: 1, content: []};
                    this.loadMore();
                    $scope.selectLawyerModal.show();
                },
                select: function (item) {
                    this.lawyer = item;
                    $scope.selectLawyerModal.hide();
                },
                loadMore: function () {
                    if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                        this.page.number += 1;
                        lawyerService.lawyerList({currPage: this.page.number}).then(function (res) {
                            $scope.replace.lawyer.page = commService.addPage($scope.replace.lawyer.page, res.data.page);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        })
                    }
                },
                doRefresh: function () {
                    this.page = {number: -1, totalPages: 1, content: []};
                    this.loadMore();
                }
            },
            submit: function () {
                if (this.lawyer.lawyer.id) {
                    this.info.lawyerId = this.lawyer.lawyer.id;
                }
                userService.changeLawyer(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.replaceLawyerModal.hide();
                        }
                    })
                })
            }

        }

    })
    // 其他需求
    .controller('demandReleaseCtrl', function ($scope, $sce, $filter, $ionicModal, userService, needService, commService) {
        // 需求详情model
        $ionicModal.fromTemplateUrl('./member-center/demand-release/modal/details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.detailsmodal = modal;
        });

        $scope.need = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    needService.needList({
                        type: this.type,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.need.page = commService.addPage($scope.need.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.need.loadMore();
        userService.userInfo().then(function (res) {
            $scope.user = res.data.user;
        });


        $scope.detail = {
            need: {},
            business: {},
            show: function (id) {
                needService.userNeedInfo({needId: id}).then(function (res) {
                    $scope.detail.need = res.data.need;
                    $scope.detail.business = res.data.business;
                    $scope.detailsmodal.show();
                });
            }
        };


    })
    // 发布需求
    .controller('releaseFromCtrl', function ($scope, $sce, $state, $filter, $ionicModal, needService, commService, lawyerService) {

        // 公司列表
        $ionicModal.fromTemplateUrl('member-center/demand-release/modal/companySelectList.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.companySelectListmodal = modal;
        });

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择城市'],
            title: '地区',
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.publish = {
            info: {},
            business: {
                info: {id: 0},
                show: function () {
                    this.doRefresh();
                    $scope.companySelectListmodal.show();
                },
                page: {number: -1, totalPages: 1, content: []},
                loadMore: function () {
                    if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                        this.page.number += 1;
                        lawyerService.businessList({currPage: this.page.number}).then(function (res) {
                            $scope.publish.business.page = commService.addPage($scope.publish.business.page, res.data.page);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }
                },
                doRefresh: function () {
                    this.page = {number: -1, totalPages: 1, content: []};
                    this.loadMore();
                },
                select: function (item) {
                    this.info = item;
                    $scope.companySelectListmodal.hide();
                }
            },
            submit: function () {
                this.info.province = vm.CityPickData.areaData[0];
                this.info.city = vm.CityPickData.areaData[1];
                this.info.area = vm.CityPickData.areaData[2];
                if (!this.info.endTime) {
                    this.info.endTime = '';
                }
                if (this.info.endTime && this.info.endTime instanceof Date) {
                    console.log(typeof this.info.endTime);
                    this.info.endTime = $filter('date')(this.info.endTime, 'yyyy-MM-dd');
                }
                this.info.forUserId = this.business.info.id;
                needService.publishNeed(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $state.go('memberCenter.demandRelease');
                        }
                    })
                })
            }
        }
    })
    //我对接的需求
    .controller('myDockingCtrl', function ($scope, $sce, $ionicModal, needService, commService) {
        $scope.need = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    needService.getNeedList({currPage: this.page.number}).then(function (res) {
                        $scope.need.page = commService.addPage($scope.need.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        }
    })
    //我对接的需求详情
    .controller('myDockingDetailCtrl', function ($scope, $sce, $ionicModal, $stateParams, needService, commService) {

        var init = function () {
            needService.getNeedInfo({needId: $stateParams.id}).then(function (res) {
                $scope.need = res.data.need;
                $scope.user = res.data.user;
            });
        };

        init();

        $scope.confirm = {
            info: {},
            submit: function () {
                this.info.type = $scope.isPay ? 1 : 2;
                needService.makeGetNeed(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            init();
                        }
                    })
                })
            }
        }


    })
    // 购买产品服务
    .controller('buyProductServiceCtrl', function ($scope, $sce, $ionicModal, serviceService, payOrderService, commService) {
        // 详情modal
        $ionicModal.fromTemplateUrl('./member-center/buy-product-service/modal/product-service-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.detailsmodal = modal;
        });

        $scope.wxPay = {
            info: {}
        };

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功');
                    }
                }
            );
        }

        $scope.detail = {
            info: {},
            show: function (serviceId) {
                serviceService.servicePrice({serviceId: serviceId}).then(function (res) {
                    $scope.detail.info = res.data;
                });
                $scope.detailsmodal.show();
            },
            nowPay: function (id) {
                payOrderService.payServicePack({servicePackId: id, openId: localStorage.wxopenId}).then(function (res) {
                    if (res.code < 0) {
                        commService.alertPopup(res.code, res.msg);
                    } else {
                        $scope.wxPay.info = res.data.payInfo;
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

    })
    // 会员中心（设置）
    .controller('memberCenterSetting', function ($scope, $rootScope, $state) {
        $scope.outLogin = function () {
            localStorage.union_token = '';
            localStorage.union_role = '';
            $rootScope._role = null;
            $state.go('memberLogin', {}, {location: 'replace'});
        }
    })
    //律师会员中心
    .controller('lawyerCenterIndex', function ($scope, $state, $ionicModal, $ionicHistory, lawyerService, commService) {
        $ionicHistory.viewHistory().backView = null;
        if (localStorage.union_token) {
            if (localStorage.union_role == 'user') {
                $state.go('memberCenter.index');
                return;
            }
        }
        lawyerService.myInfo().then(function (res) {
            if (res.code < 0) {
                commService.alertPopup(res.code, res.msg);
            } else {
                $scope.lawyer = res.data.info;
            }
        });

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.lawyer.photoUrl = res;
                lawyerService.updateLawyerPhoto({photoUrl: res}).then(function (rep) {
                });
            });
        };
    })
    // 我的资料（律师）
    .controller('lawyerMyInfo', function ($scope, $ionicModal, lawyerService, commService) {
        var vm = $scope.vm = {};
        var init = function () {
            lawyerService.myInfo().then(function (res) {
                if (res.code < 0) {
                    commService.alertPopup(res.code, res.msg);
                    return;
                }
                $scope.user = res.data.user;
                $scope.lawyer = res.data.info;
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
            })
        };
        init();

        $scope.saveInfo = function () {
            $scope.lawyer.domainIds = '';
            angular.forEach($scope.domains, function (data) {
                if (data.checked) {
                    $scope.lawyer.domainIds = $scope.lawyer.domainIds + data.id + ',';
                }
            });
            lawyerService.saveInfo({
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
    // 我的订单列表（律师）
    .controller('lawyerOrders', function ($scope, $sce, $ionicModal, lawyerService, commService, orderService) {
        // 悬赏订单详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/my-orders/order-details-modal/reward-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.rewardDetials = modal;
        });
        // 电话订单详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/my-orders/order-details-modal/phone-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.phoneDetials = modal;
        });
        // 会见订单详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/my-orders/order-details-modal/meeting-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.meetingDetials = modal;
        });
        // 订单详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/my-orders/order-details-modal/order-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.orderDetailModel = modal;
        });
        $scope.sce = $sce.trustAsResourceUrl;

        $scope.order = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    orderService.lawyerOrderList({
                        type: this.type,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.order.page = commService.addPage($scope.order.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.order.loadMore();

        $scope.detail = {
            data: {},
            show: function (id, serviceId) {
                this.complete.info = {};
                orderService.lawyerOrderInfo({orderId: id}).then(function (res) {
                    $scope.detail.data = res.data;
                });
                switch (serviceId) {
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
                    default:
                        // 订单详情
                        $scope.orderDetailModel.show();
                        break;
                }
            },
            complete: {
                info: {},
                submit: function (orderId) {
                    this.info.orderId = orderId;
                    orderService.orderComplete(this.info).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.order.doRefresh();
                                $scope.phoneDetials.hide();
                            }
                        });
                    })
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
                            $scope.order.doRefresh();
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
    })

    // 案件列表
    .controller('lawyerCaseListCtrl', function ($scope, $ionicModal, commService, caseService, caseLogService) {
        // case详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/case-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseListmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/imgs-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imgmodalTitle = '';
            $scope.imgmodalType = 0;
            $scope.imgmodal = modal;
        });
        // img详情
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/addImg-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addImgModel = modal;
        });
        // 案件进展
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/case-logs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseLogModal = modal;
        });
        // 添加案件进展
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/add-log.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addLogModal = modal;
        });
        // 添加案件进展
        $ionicModal.fromTemplateUrl('member-center-lawyer/case-list/release-case.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.releasemodal = modal;
        });

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.detail.lawyerPic.add.info.pictureUrl = res;
            });
        };

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.case = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    caseService.lawyerCaseList({type: this.type, currPage: this.page.number}).then(function (res) {
                        $scope.case.page = commService.addPage($scope.case.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.case.doRefresh();

        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.detail.lawyerPic.add.info.pictureUrl = res;
            });
        };

        $scope.detail = {
            info: {},
            show: function (id) {
                caseService.lawyerCaseInfo({caseId: id}).then(function (res) {
                    $scope.detail.info = res.data.case;
                    $scope.detail.msgs.loadMore();
                    $scope.caseListmodal.show();
                })
            },
            userPic: {
                list: [],
                getList: function () {
                    caseService.casePictures({caseId: $scope.detail.info.id, type: 1}).then(function (res) {
                        $scope.detail.userPic.list = res.data.list;
                    })
                },
                show: function () {
                    this.getList();
                    $scope.imgmodalTitle = '会员的图片资料';
                    $scope.imgmodalType = 1;
                    $scope.imgmodal.show();
                }
            },
            lawyerPic: {
                list: [],
                getList: function () {
                    caseService.casePictures({caseId: $scope.detail.info.id, type: 2}).then(function (res) {
                        $scope.detail.lawyerPic.list = res.data.list;
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
                                $scope.detail.lawyerPic.getList();
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
                        caseService.addLawyerPicture({
                            caseId: $scope.detail.info.id,
                            name: this.info.name,
                            pictureUrl: this.info.pictureUrl
                        }).then(function (res) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $scope.detail.lawyerPic.getList();
                                    $scope.addImgModel.hide();
                                }
                            })
                        })
                    }
                }
            },
            msgs: {
                page: {number: -1, totalPages: 1, content: []},
                loadMore: function () {
                    if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                        this.page.number += 1;
                        caseService.caseMsgList({
                            caseId: $scope.detail.info.id, currPage: this.page.number
                        }).then(function (res) {
                            $scope.detail.msgs.page = commService.addPage($scope.detail.msgs.page, res.data.page);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }
                },
                doRefresh: function () {
                    this.page = {number: -1, totalPages: 1, content: []};
                    this.loadMore();
                },
                publish: {
                    msg: {content: ''},
                    submit: function () {
                        caseService.lawyerAddCaseMsg({
                            caseId: $scope.detail.info.id,
                            content: this.msg.content
                        }).then(function (res) {
                            commService.alertPopup(res.code, res.msg).then(function () {
                                if (res.code >= 0) {
                                    $scope.detail.msgs.publish.msg.content = '';
                                    $scope.detail.msgs.doRefresh();
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
                    caseLogService.caseLogs({caseId: $scope.detail.info.id}).then(function (res) {
                        $scope.detail.logs.list = res.data.cases;
                    })
                },
                addShow: function () {
                    this.info = {};
                    $scope.addLogModal.show();
                },
                add: function () {
                    this.info.caseId = $scope.detail.info.id;
                    caseLogService.addCaseLog(this.info).then(function (res) {
                        commService.alertPopup(res.code, res.msg).then(function () {
                            if (res.code >= 0) {
                                $scope.detail.logs.load();
                                $scope.addLogModal.hide();
                            }
                        })
                    })
                }
            }
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
            publish: function () {
                caseService.publishCaseByLawyer({
                    name: this.case.name,
                    mobile: this.case.mobile,
                    idCard: this.case.idCard,
                    content: this.case.content,
                    domainId: this.case.domainId,
                    province: vm.CityPickData.areaData[0],
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
    })
    //我的钱包
    .controller('myWalletCtrl', function ($scope, $ionicModal, lawyerService, commService) {
        $ionicModal.fromTemplateUrl('./member-center-lawyer/my-wallet/money-back.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moneybackmodal = modal;
        });

        $scope.wallet = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    lawyerService.tranList({
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.wallet.page = commService.addPage($scope.wallet.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        var init = function () {
            lawyerService.myInfo().then(function (res) {
                $scope.lawyer = res.data.info
            });
            $scope.wallet.doRefresh();
        };

        init();

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
                            init();
                            $scope.moneybackmodal.hide();
                        }
                    })
                })
            }
        };
    })
    //代办列表
    .controller('entrustList', function ($scope, $ionicModal, lawyerEntrustService, commService) {
        $ionicModal.fromTemplateUrl('./member-center-lawyer/entrust/entrust-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.entrustModal = modal;
        });

        $scope.entrusts = {
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    lawyerEntrustService.entrustList({currPage: this.page.number}).then(function (res) {
                        $scope.entrusts.page = commService.addPage($scope.entrusts.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        }

        $scope.entrusts.loadMore();

        $scope.detail = {
            info: {},
            lawyer: {},
            show: function (id) {
                lawyerEntrustService.entrustInfo({entrustId: id}).then(function (res) {
                    $scope.detail.info = res.data.info;
                    $scope.detail.lawyer = res.data.lawyer;
                    $scope.entrustModal.show();
                })
            },
            apply: function () {
                lawyerEntrustService.applyEntrust({entrustId: this.info.id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.detail.info.status = 2;
                        }
                    })
                })
            }
        }

    })
    //我的代办(律师)
    .controller('lawyerEntrust', function ($scope, $filter, $ionicModal, lawyerEntrustService, commService) {
        // 代办详情
        $ionicModal.fromTemplateUrl('./member-center-lawyer/entrust/lawyer-entrust/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.entrustModal = modal;
        });

        // 发布代办页面
        $ionicModal.fromTemplateUrl('./member-center-lawyer/entrust/lawyer-entrust/publish.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.entrustPublishModal = modal;
        });


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
                'getBrandWCPayRequest', $scope.detail.wxPay.wxPayInfo,
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

        $scope.entrusts = {
            type: 0,
            page: {number: -1, totalPages: 1, content: []},
            selectTab: function (type) {
                this.type = type;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    lawyerEntrustService.myEntrustList({
                        type: this.type,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.entrusts.page = commService.addPage($scope.entrusts.page, res.data.page);
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

        $scope.detail = {
            info: {},
            lawyer: {},
            show: function (id) {
                lawyerEntrustService.entrustInfo({entrustId: id}).then(function (res) {
                    $scope.detail.info = res.data.info;
                    $scope.detail.lawyer = res.data.lawyer;
                    $scope.entrustModal.show();
                })
            },
            confirm: function () {
                lawyerEntrustService.confirmEntrust({entrustId: this.info.id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.entrusts.detail.info.status = 3;
                        }
                    })
                })
            },
            cancel: function (id) {
                lawyerEntrustService.cancelEntrust({entrustId: id}).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            init();
                        }
                    })
                })
            },
            wxPay: {
                wxPayInfo: {},
                pay: function (id) {
                    lawyerEntrustService.entrustPay({
                        entrustId: id,
                        openId: localStorage.wxopenId
                    }).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.detail.wxPay.wxPayInfo = res.data.payInfo;
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

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择代办区域'],
            title: '代办区域',
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };

        $scope.publish = {
            info: {},
            show: function () {
                this.info = {};
                $scope.entrustPublishModal.show();
            },
            submit: function () {
                this.info.province = vm.CityPickData.areaData[0];
                this.info.city = vm.CityPickData.areaData[1];
                this.info.area = vm.CityPickData.areaData[2];
                this.info.endTime = $filter('date')(this.info.endTime, 'yyyy-MM-dd');
                lawyerEntrustService.publishEntrust(this.info).then(function (res) {
                    if (res.code < 0) {
                        commService.alertPopup(res.code, res.msg);
                    } else {
                        $scope.detail.wxPay.pay(res.data.entrustId);
                    }
                })

            }
        };

        var init = function () {
            $scope.entrusts.page = {number: -1, totalPages: 1, content: []};
            $scope.entrusts.loadMore();
        };

        init();


    })
    // 设置
    .controller('lawyerCenterSetting', function ($scope, $rootScope, $state) {
        $scope.outLogin = function () {
            localStorage.union_token = '';
            localStorage.union_role = '';
            $rootScope._role = null;
            $state.go('memberLogin', {}, {location: 'replace'});
        }
    })
    // 日常法典
    .controller('daily', function ($scope, $ionicModal, commService, questionService, userService) {

        $scope.search = {
            domainId: 0,
            page: {number: -1, totalPages: 1, content: []},
            searchDomain: function (domainId) {
                this.domainId = domainId;
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore()
            },
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    questionService.statuteBookList({
                        domainId: this.domainId,
                        currPage: this.page.number
                    }).then(function (res) {
                        $scope.search.page = commService.addPage($scope.search.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.search.loadMore();

        commService.domains().then(function (res) {
            $scope.domains = res.data.domains;
        });

        $scope.answer = {
            questionId: 0,
            user: {},
            question: {},
            repay: {}
        };

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.repay.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功!').then(function () {
                            $state.go('memberCenter.heardIssue');
                        })
                    }
                }
            );
        }

        $scope.repay = {
            wxPay: {
                info: {},
                pay: function (id) {
                    userService.payListenRepay({repayId: id, openId: localStorage.wxopenId}).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.repay.wxPay.info = res.data.payInfo;
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
                $scope.answer.repay = res.data.page.content[0]
            });
            $scope.checkanswermodal.show();
        };


    })
    // 法聚观点
    .controller('lawyerViewPoint', function ($scope, $state, $ionicModal, $stateParams, commService, questionService, userService) {

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', $scope.vp.wxPay.info,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        commService.alertPopup(1, '支付成功,请前去我的中心查看').then(function () {
                            $state.go('memberCenter.heardIssue')
                        })
                    }
                }
            );
        }

        $scope.vp = {
            questionId: $stateParams.id,
            question: {},
            repays: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.repays.totalPages > 0 && this.repays.number < this.repays.totalPages) {
                    this.repays.number += 1;
                    questionService.questionRepayList({
                        questionId: this.question.id,
                        currPage: this.repays.number
                    }).then(function (res) {
                        $scope.vp.repays = commService.addPage($scope.vp.repays, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                this.repays = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            },
            wxPay: {
                info: {},
                pay: function (id) {
                    userService.payListenRepay({repayId: id, openId: localStorage.wxopenId}).then(function (res) {
                        if (res.code < 0) {
                            commService.alertPopup(res.code, res.msg);
                        } else {
                            $scope.vp.wxPay.info = res.data.payInfo;
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
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    questionService.lawViewpointList({currPage: this.page.number}).then(function (res) {
                        $scope.vps.page = commService.addPage($scope.vps.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            },
            doRefresh: function () {
                questionService.lawViewpoint({questionId: $scope.vp.questionId}).then(function (res) {
                    $scope.vp.question = res.data.question;
                });
                this.page = {number: -1, totalPages: 1, content: []};
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
    .controller('selectUtils', function ($q, $scope, $ionicModal, $state) {
        $ionicModal.fromTemplateUrl('./select-util/friend-link.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.friendLinkModel = modal;
        });

    })
    .controller('memberActionCtrl', function ($scope, activityService, commService) {
        $scope.activity = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    activityService.activityList({currPage: this.page.number}).then(function (res) {
                        $scope.activity.page = commService.addPage($scope.activity.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };
        $scope.activity.doRefresh();
    })
    .controller('memberActionDetailsCtrl', function ($scope, $ionicModal, activityService, commService, $stateParams) {

        activityService.activityInfo({activityId: $stateParams.id}).then(function (res) {
            $scope.activity = res.data.activity;
        });

        $ionicModal.fromTemplateUrl('./member-action/modal/joinForm.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.joinFormModel = modal;
        });

        $scope.join = {
            info: {},
            show: function (id) {
                this.info.activityId = id;
                $scope.joinFormModel.show();
            },
            submit: function () {
                activityService.joinActivity(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.joinFormModel.hide();
                        }
                    });
                })
            }
        }
    })

    .controller('eliteCtrl', function ($scope, $ionicModal, eliteService, commService) {
        $ionicModal.fromTemplateUrl('./elite/modal/joinForm.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.joinFormModel = modal;
        });

        var vm = $scope.vm = {};
        vm.CityPickData = {
            areaData: ['请选择地区'],
            title: '公司地址',
            defaultAreaData: ['北京市', '北京市', '东城区'],
            hardwareBackButtonClose: false,
            cityPickers: localStorage.cityPickers
        };


        $scope.elite = {
            page: {number: -1, totalPages: 1, content: []},
            loadMore: function () {
                if (this.page.totalPages > 0 && this.page.number < this.page.totalPages) {
                    this.page.number += 1;
                    eliteService.eliteList({currPage: this.page.number}).then(function (res) {
                        $scope.elite.page = commService.addPage($scope.elite.page, res.data.page);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
            },
            doRefresh: function () {
                this.page = {number: -1, totalPages: 1, content: []};
                this.loadMore();
            }
        };

        $scope.elite.doRefresh();

        $scope.join = {
            info: {},
            show: function () {
                this.info = {};
                $scope.joinFormModel.show();
            },
            submit: function () {
                this.info.province = vm.CityPickData.areaData[0];
                this.info.city = vm.CityPickData.areaData[1];
                this.info.area = vm.CityPickData.areaData[2];
                eliteService.joinElite(this.info).then(function (res) {
                    commService.alertPopup(res.code, res.msg).then(function () {
                        if (res.code >= 0) {
                            $scope.joinFormModel.hide();
                        }
                    });
                })
            }
        }
    })
    .controller('searchLogin', function ($scope, $q, $state, commService, searchService) {
        $scope.info = {};
        $scope.getCode = function () {
            var deferred = $q.defer();
            searchService.sendCode({mobile: $scope.info.mobile}).then(function (res) {
                deferred.resolve(res.code);
                commService.alertPopup(res.code, res.msg)
            });
            return deferred.promise;
        };

        $scope.submit = function () {
            searchService.login($scope.info).then(function (res) {
                commService.alertPopup(res.code, res.msg).then(function () {
                    if (res.code >= 0) {
                        localStorage.search_mobile = res.data.mobile;
                        $state.go('search.list');
                    }
                })
            })
        }
    })
    .controller('searchList', function ($scope, $state, commService, searchService) {
        $scope.case = {
            json: [],
            doRefresh: function () {
                this.json = [];
                searchService.caseList({mobile: localStorage.search_mobile}).then(function (res) {
                    $scope.case.json = JSON.parse(res.data.data);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        };
        $scope.case.doRefresh();
    })
    .controller('searchInfo', function ($scope, $ionicModal, $state, $stateParams, commService, searchService) {
        $ionicModal.fromTemplateUrl('./search/addImg.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addImgModel = modal;
        });
        $ionicModal.fromTemplateUrl('./search/img-list.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imgmodal = modal;
        });
        $ionicModal.fromTemplateUrl('./search/case-log.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.caseLogModal = modal;
        });


        $scope.detail = {
            id: $stateParams.id,
            type: $stateParams.type,
            info: {},
            load: function () {
                searchService.caseInfo({caseId: this.id, caseType: this.type}).then(function (res) {
                    $scope.detail.info = JSON.parse(res.data.c);
                })
            },
            myPic: {
                list: [],
                getList: function () {
                    searchService.casePictures({
                        caseId: $scope.detail.id,
                        caseType: $scope.detail.type,
                        type: 1
                    }).then(function (res) {
                        $scope.detail.myPic.list = JSON.parse(res.data.pictures).list;
                    })
                },
                add: {
                    img: {name: '', pictureUrl: ''},
                    show: function () {
                        this.img = {name: '', pictureUrl: ''};
                        $scope.addImgModel.show();
                    },
                    add: function () {
                        searchService.addPicture({
                            caseId: $scope.detail.id,
                            caseType: $scope.detail.type,
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
                    searchService.delPicture({picId: id, caseType: $scope.detail.type}).then(function (res) {
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
            lawyerPic: {
                list: [],
                getList: function () {
                    searchService.casePictures({
                        caseId: $scope.detail.id,
                        caseType: $scope.detail.type,
                        type: 2
                    }).then(function (res) {
                        $scope.detail.lawyerPic.list = JSON.parse(res.data.pictures).list;
                    })
                },
                show: function () {
                    $scope.imgmodalTitle = '律师的图片资料';
                    $scope.imgmodalType = 2;
                    this.getList();
                    $scope.imgmodal.show();
                }
            },
            logs: {
                list: [],
                show: function () {
                    this.load();
                    $scope.caseLogModal.show();
                },
                load: function () {
                    searchService.caseLogs({
                        caseId: $scope.detail.id,
                        caseType: $scope.detail.type
                    }).then(function (res) {
                        $scope.detail.logs.list = JSON.parse(res.data.logs);
                    })
                }
            }
        };
        $scope.fileChanged = function (ele) {
            commService.uploadFile(ele.files[0]).then(function (res) {
                $scope.detail.myPic.add.img.pictureUrl = res;
            });
        };

        $scope.detail.load();

    })
