"use strict";

var app = angular.module('ng-laravel');
app.controller('CourseListCtrl', function ($scope, CourseService, resolvedItems,$rootScope,ionicToast,$ionicLoading,$ionicPopup,$ionicPopover) {

    /*
     * Get all Courses
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.courses = resolvedItems;
    $scope.pagination = $scope.courses.metadata;
    $scope.maxSize = 10;

    /*
     * Pagination task list
     */
    $scope.perPage = 10;
    $scope.pageChanged = function () {
        CourseService.pageChange($scope.pagination.current_page + 1, $scope.perPage).then(function (data) {
            angular.forEach(data,function (value, key) {
                $scope.courses.push(value)
            });
            $scope.pagination = data.metadata;
        });
    };

});
