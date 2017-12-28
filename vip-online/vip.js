/**
 * Created by xieiqng on 2017/6/23.
 */
var vipApp = angular.module('vipApp', ['ionic', 'ionic-citypicker' ]);

// vipApp.run(['$rootScope', '$state', function ($rootScope, $state) {

// }]);	



vipApp.controller('MyCtrl', ['$scope','$state','$ionicSideMenuDelegate',
	function($scope,$state,$ionicSideMenuDelegate){
		$scope.toggleRight = function () {
        	$ionicSideMenuDelegate.toggleRight();
        }
        var vm = $scope.vm = {};

		$scope.jump = (e)=>{
			$state.go(e)
		}
  
	}
])
.controller('enterpriseHelpCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('enterpriseHelpInfoCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('agentAccountCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('agentAccountEditCtrl', ['$scope','$state',function ($scope,$state) {}])

.controller('activityIndexCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('activityInfoCtrl', ['$scope','$state',function ($scope,$state) {}])

.controller('lawVideoCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('lawVideoInfoCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('lawVideoCommentCtrl', ['$scope','$state',function ($scope,$state) {}])

.controller('bbsCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('bbsListCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('bbsListInfoCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('bbsListInfoCommentCtrl', ['$scope','$state',function ($scope,$state) {}])
