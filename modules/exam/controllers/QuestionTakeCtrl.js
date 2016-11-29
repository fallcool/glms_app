"use strict";

var app = angular.module('ng-laravel');
app.controller('QuestionTakeCtrl',function($scope, QuestionService, ExamService, $http,$rootScope,$stateParams,$filter,$cordovaCamera,$cordovaImagePicker,$ionicPlatform,$cordovaFileTransfer,ionicToast,htmlValidationError){



    /*
     * Edit mode Exam
     * Get from resolvedItems function in this page route (config.router.js)
     */
    //$scope.tq = resolvedItems.entity;
    $scope.tqq = $rootScope.tqqs[$stateParams.id];

    if ( $scope.tqq.question.question_type == '多选题' && typeof $scope.tqq.answer !== 'undefined') {
        var answers =  $scope.tqq.answer.split(",");
        angular.forEach(answers, function(answer) {
            angular.forEach($scope.tqq.question.choices, function (choice, key) {
                if (answer == choice.id) {
                    choice.checked = true;
                    console.log(choice);
                }
                //if (choice.checked == true) answers.push(choice.id);
            })
        })
    }



    //$scope.form= resolvedItems.form.children;
    //$scope.form.answer = $scope.tq.answer;
    console.log($scope.tqq);

    $scope.timerRunning = true;

    $scope.$on('timer-tick', function (event, args) {
        $rootScope.timeleft -=  1;
       // console.log( $rootScope.timeleft );
    });

    //$scope.answer = resolvedItems.entity.answer;
    //scope.choices = resolvedItems.entity.question.choices;

    $scope.submit = function() {
        if ($scope.tqq.question.question_type == '多选题') {
            console.log($scope.tqq);
            var answers = new Array();
            angular.forEach($scope.tqq.question.choices, function(choice, key) {
                if (choice.checked == true ) answers.push(choice.id);
            });
            $scope.tqq.answer = answers.join(',');
        }

        console.log($scope.tqq);
        var data = QuestionService.submit($scope.tqq);
        //alert(id);


    };

    $scope.finish = function() {
        ExamService.finish();

    };

    $scope.review = function() {
        $rootScope.goState('app.questions');
    };
    /*
     * Get exam and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     * Because of ion-autocomplete we couldn't use cache feature
     */
    // ExamService.show($stateParams.id).then(function(data) {
    //     $scope.exam = data;
    //     $scope.exam.start_date = new Date(data.start_date);
    //     $scope.exam.end_date = new Date(data.end_date);
    //     // use to initial user, category in ion-autocomplete
    //     $scope.userTemp = $scope.exam.user_id;
    //     $scope.categoryTemp = $scope.exam.category_id;
    //     // gallery initial
    //     $scope.arrayFiles = [];
    //     angular.forEach($scope.exam.gallery,function (value, key) {
    //         $scope.arrayFiles.push({
    //             filePath: $rootScope.ngLaravelBackEndFileURL+value.filename,
    //             progress: 100,
    //             filename: value.filename, // parse filename from file path
    //             uploaded: true,
    //             serverId: value.filename
    //         });
    //     });
    // });

    if ( $rootScope.timeleft <= 0 ) {
        alert('测验已超时！');
        $scope.finish();
    }

});

