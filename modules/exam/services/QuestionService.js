'use strict';

angular.module('ng-laravel').service('QuestionService', function($rootScope, $state, $stateParams, $window, Restangular,CacheFactory) {
    /*
     * Build collection /question
     */
    var _questionService = Restangular.all('testerquizquestion/');
    if (!CacheFactory.get('questionsCache')) {
        var questionsCache = CacheFactory('questionsCache');
    }

    /*
     * Get list of questions from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/question
        if (!questionsCache.get('list')) {
            return this.list();
        } else{
            return questionsCache.get('list');
        }
    };


    /*
     * Get list of questions
     */
    this.list = function() {
        // GET /api/question
        var data = _questionService.customGET('');
        questionsCache.put('list',data);
        return data;
    };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page) {
        // GET /api/question?page=2
        return _questionService.getList({page:pageNumber,per_page:per_page});
    };


    this.cachedShow = function(id) {
        // GET /api/question/:id
        if (!questionsCache.get('show'+id)) {
            return this.show(id);
        } else{
            return questionsCache.get('show'+id);
        }
    };

    /*
     * Show specific question by Id
     */
    this.show = function(id) {
        // GET /api/question/:id
        var data = _questionService.get(id);
        questionsCache.put('show'+id,data);

        return data;
    };

    /*
     * Show specific question by Id
     */
    this.take = function(id,timer) {
        // GET /api/question/:id
        //alert(id);Restangular.one("accounts", 123).customGET("messages")
        var data = Restangular.one("testerquizquestion", id).customGET("take/"+timer);
        //$rootScope.goStateWithParam('app.takeQuestion', {'id':data.id, 'timer':data.timer});
       // $window.location.reload();
        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$route.reload();
        //questionsCache.put('show'+id,data);
        //$rootScope.goStateWithParam('app.showQuestion', {id:id});

        return data;
    };

    /*
     * Create category (POST)
     */
    this.submit = function(tqq) {
        // POST /api/category/:id
        Restangular.one("testerquizquestion", tqq.id).customPOST(tqq, "submit").then(function() {
            $rootScope.tqqs[$stateParams.id].answer = tqq.answer;
            //var data = QuestionService.submit(form, id);
            //alert('sdfasdf');
            if ( $stateParams.id < $rootScope.tqqs.length -1 ) {
                $rootScope.goStateWithParam('app.takeQuestion', {'id': $stateParams.id * 1 + 1 });
            } else {
                alert('已到最后一题！请点击"全部试题"检查之前的答题或者点击“交卷”完成答题');
            }
        },function(response) {
            $rootScope.$broadcast('question.validationError',response.data.error);
        });
    };

});

