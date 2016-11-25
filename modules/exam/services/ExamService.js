'use strict';

angular.module('ng-laravel').service('ExamService', function($rootScope, $state, $stateParams, $window, Restangular,CacheFactory) {
    /*
     * Build collection /exam
     */
    var _examService = Restangular.all('quiz/');
    if (!CacheFactory.get('examsCache')) {
        var examsCache = CacheFactory('examsCache');
    }

    /*
     * Get list of exams from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/exam
        if (!examsCache.get('list')) {
            return this.list();
        } else{
            return examsCache.get('list');
        }
    };




    /*
     * Get list of exams
     */
    this.list = function() {
        // GET /api/exam
        var data = _examService.customGET('');
        examsCache.put('list',data);
        return data;
    };

  this.completedList = function() {
    // GET /api/exam
    var data = _examService.customGET('completed');
    //examsCache.put('list',data);
    return data;
  };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page) {
        // GET /api/exam?page=2
        return _examService.getList({page:pageNumber,per_page:per_page});
    };


    this.cachedShow = function(id) {
        // GET /api/exam/:id
        if (!examsCache.get('show'+id)) {
            return this.show(id);
        } else{
            return examsCache.get('show'+id);
        }
    };

    /*
     * Show specific exam by Id
     */
    this.show = function(id) {
        // GET /api/exam/:id
        var data = _examService.get(id);
        examsCache.put('show'+id,data);

        return data;
    };

    /*
     * Show specific exam by Id
     */
    this.take = function(id) {
        // GET /api/exam/:id
        //alert(id);Restangular.one("accounts", 123).customGET("messages")
        var data = Restangular.one("testerquiz", id).customGET("take");


        //alert(data.toString());
        //goStateWithParam('app.takeQuestion', {'id':data.id, 'timer':data.timer});

       // $window.location.reload();
        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$route.reload();
        //examsCache.put('show'+id,data);
        //$rootScope.goStateWithParam('app.showExam', {id:id});

        return data;
    };

    this.showQuiz = function(id) {

        var data = Restangular.one("testerquiz", id).customGET("");

        return data;
    };

    this.finish = function() {
        var answers = new Array();
        $rootScope.tqqs.forEach( function( tqq ) {
            var new_answer =  new Object();
            new_answer.id = tqq.id;
            new_answer.answer = tqq.answer;
            answers.push(new_answer);
        });
        console.log(answers);
        Restangular.one("testerquiz", $rootScope.tqId).customPOST(answers, "finish").then(function(data) {
            return data;
        },function(response) {
            return response;
        });
    };

});

