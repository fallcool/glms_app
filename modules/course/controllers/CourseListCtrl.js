"use strict";

var app = angular.module('ng-laravel');
app.controller('CourseListCtrl', function ($scope, CourseService, resolvedItems,$rootScope,ionicToast,$ionicLoading,$ionicPopup,$ionicPopover) {
    

    /*
     * Define initial value
     */
    $scope.query = '';
    $ionicPopover.fromTemplateUrl('popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.toggleSearch = function() {
        $scope.searchShow = $scope.searchShow === false ? true: false;
    };

    /*
     * Get all Courses
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.courses = resolvedItems;
    $scope.pagination = $scope.courses.metadata;
    $scope.maxSize = 5;


    /*
     * Get all Course and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */
    CourseService.list().then(function (data) {
        $scope.courses = data;
        $scope.pagination = $scope.courses.metadata;
    });


    /*
     * Remove selected courses
     */
    $scope.delete = function (task) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: 'Remove file permanently'
        });
        confirmPopup.then(function(res) {
            if(res) {
                ionicToast.show('Processing...', 'bottom', true,5000);
                CourseService.delete(task);
            }
        });
    };


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


    /*
     * Search in courses
     */
    $scope.search = function (query) {
        $ionicLoading.show($rootScope.loading);
        CourseService.search(query, $scope.perPage).then(function (data) {
            $scope.courses = data;
            $scope.pagination = $scope.courses.metadata;
            $ionicLoading.hide();
        });
    };
    
    
    // /**********************************************************
    //  * Event Listener
    //  **********************************************************/
        // Get list of selected task to do actions
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(taskId) {
        // toggle selection for a given task by Id
        var idx = $scope.selection.indexOf(taskId);
        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.selection.push(taskId);
        }
    };

    // update list when task deleted
    $scope.$on('task.delete', function () {
        ionicToast.show('Record removed! Refreshing...', 'bottom', false, 3500);
        CourseService.list().then(function (data) {
            $scope.courses = data;
            $scope.selection = [];
        });
    });

    // update list when task not deleted
    $scope.$on('task.not.delete', function () {
        ionicToast.show('Record doesn\'t removed!', 'bottom', false, 2500);
        CourseService.list().then(function (data) {
            $scope.courses = data;
            $scope.selection = [];
        });
    });


});
