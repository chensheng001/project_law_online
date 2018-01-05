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

.controller('bbsUserCenterCtrl', ['$scope','$state',function ($scope,$state) {}])
.controller('bbsNewInfoCtrl', ['$scope','$state',function ($scope,$state) {

	console.log(121212)


document.getElementById("photo").addEventListener("click", function()
{
    console.log(123)
});





	var clickInput = function(){
		console.log('123321')
	}

	var upload = function(c, d){
	    "use strict";

	    var $c = document.querySelector(c),
        	$d = document.querySelector(d),
        	file = $c.files[0],
        	reader = new FileReader();

	    reader.readAsDataURL(file);
	    reader.onload = function(e){
	        $d.setAttribute("src", e.target.result);
	    };
	};

}])
.controller('postCtrl', ['$scope','$state',function ($scope,$state) {}])
