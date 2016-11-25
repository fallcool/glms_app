"use strict";

var app = angular.module('ng-laravel');
app.controller('ExamListCtrl', function ($scope, ExamService, resolvedItems,$rootScope,ionicToast,$ionicLoading,$ionicPopup,$ionicPopover) {


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
     * Get all Exams
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.exams = resolvedItems;
    $scope.pagination = $scope.exams.metadata;
    $scope.maxSize = 5;


    /*
     * Get all Exam and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */
    ExamService.list().then(function (data) {
        $scope.exams = data;
        $scope.pagination = $scope.exams.metadata;
    });


    $scope.take = function(id) {
        //alert(id);
        ExamService.take(id).then(function (data) {
            $rootScope.tqId = data.id;
            $rootScope.tqqs = data.testerQuizQuestions;
            $rootScope.timeleft = data.timer;
            $rootScope.quiz = data.quiz;
            console.log($rootScope.timeleft);
            //$scope.exams = data;
            //$scope.pagination = $scope.exams.metadata;
            //alert(data.timer);
            $rootScope.goStateWithParam('app.takeQuestion', {id:0});
        });

    }


    $scope.show = function(id) {
        ExamService.show(id).then(function (data) {
            $rootScope.tqId = data.id;
            $rootScope.tqqs = data.testerQuizQuestions;
            $rootScope.timeleft = data.timer;
            console.log($rootScope.timeleft);
            //$scope.exams = data;
            //$scope.pagination = $scope.exams.metadata;
            //alert(data.timer);
            $rootScope.goStateWithParam('app.showQuiz', {id:0});
        });
    }
    /*
     * Pagination task list
     */
    $scope.perPage = 10;
    $scope.pageChanged = function () {
        ExamService.pageChange($scope.pagination.current_page + 1, $scope.perPage).then(function (data) {
            angular.forEach(data,function (value, key) {
                $scope.exams.push(value)
            });
            $scope.pagination = data.metadata;
        });
    };





});
