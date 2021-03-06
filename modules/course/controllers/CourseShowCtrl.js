"use strict";

var app = angular.module('ng-laravel');
app.controller('CourseShowCtrl',function($scope,CourseService, $http,$rootScope,$stateParams,$filter,$cordovaCamera,$cordovaImagePicker,$ionicPlatform,$cordovaFileTransfer,ionicToast,resolvedItems,htmlValidationError){


    /*
     * Define initial value
     */
    $scope.tmp = {};
    $scope.statusList = [{id:0,name:'Open'},{id:1,name:'Close'}];
    $scope.arrayFiles = [];



    /*
     * Edit mode Course
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.course = resolvedItems;
			console.log(resolvedItems);

    $scope.take = function(id) {
        //alert(id);
        CourseService.take(id).then(function (data) {
          $window.location.reload();
      });
    }

    $scope.showKejian = function(kejian) {
        if (typeof kejian.pdf !== 'undefined'  ) {
            var ref = window.open(
                $rootScope.webRoot
                + 'kejian/' + kejian.id + '/pdf',
                '_blank',
                'location=no,closebuttoncaption=Close,enableViewportScale=yes');
        } else {
            $rootScope.goStateWithParam('app.showKejian', {id:kejian.id});
        }

    }

    /*
     * Get course and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     * Because of ion-autocomplete we couldn't use cache feature
     */
    // CourseService.show($stateParams.id).then(function(data) {
    //     $scope.course = data;
    //     $scope.course.start_date = new Date(data.start_date);
    //     $scope.course.end_date = new Date(data.end_date);
    //     // use to initial user, category in ion-autocomplete
    //     $scope.userTemp = $scope.course.user_id;
    //     $scope.categoryTemp = $scope.course.category_id;
    //     // gallery initial
    //     $scope.arrayFiles = [];
    //     angular.forEach($scope.course.gallery,function (value, key) {
    //         $scope.arrayFiles.push({
    //             filePath: $rootScope.ngLaravelBackEndFileURL+value.filename,
    //             progress: 100,
    //             filename: value.filename, // parse filename from file path
    //             uploaded: true,
    //             serverId: value.filename
    //         });
    //     });
    // });

});

