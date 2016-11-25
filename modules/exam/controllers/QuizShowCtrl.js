"use strict";

var app = angular.module('ng-laravel');
app.controller('QuizShowCtrl', function ($scope, ExamService, resolvedItems,$rootScope,ionicToast,$ionicLoading,$ionicPopup,$ionicPopover) {
    



    /*
     * Get all Exams
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.tq = resolvedItems.entity;
    console.log($scope.tq);
    angular.forEach($scope.tq.tester_quiz_questions, function(tqq) {
        if ( tqq.question.question_type == '多选题' && typeof tqq.answer !== 'undefined') {
            var answers =  tqq.answer.split(",");
            angular.forEach(answers, function(answer) {
                angular.forEach(tqq.question.choices, function (choice, key) {
                    if (answer == choice.id) {
                        choice.checked = true;
                        console.log(choice);
                    }
                    //if (choice.checked == true) answers.push(choice.id);
                })
            })
        }
    })

});
