"use strict";
angular.module("ngTouch", [])
    .directive("ngTouchstart", function ($parse) {
        return function(scope, element, attr) {
            var clickHandler = $parse(attr.ngTouchstart);

            element.on('touchstart', function(event) {
                scope.$apply(function() {
                    clickHandler(scope, {$event: event});
                });
            });
        };
    })
    .directive("ngTouchmove", function ($parse) {
        return function(scope, element, attr) {
            var clickHandler = $parse(attr.onTouchMove);
            element.on('touchmove', function(event) {
                scope.$apply(function() {
                    clickHandler(scope, {$event: event});
                });
            });
        };

    })
    .directive("ngTouchend", function ($parse) {

        return function(scope, element, attr) {
            var clickHandler = $parse(attr.ngTouchend);

            element.on('touchend', function(event) {
                scope.$apply(function() {
                    clickHandler(scope, {$event: event});
                });
            });
        };

    });