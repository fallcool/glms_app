'use strict';

angular.module('ng-laravel').service('CourseService', function($rootScope, $state, $stateParams, $window, Restangular,CacheFactory) {
    /*
     * Build collection /course
     */
    var _courseService = Restangular.all('course/');
    if (!CacheFactory.get('coursesCache')) {
        var coursesCache = CacheFactory('coursesCache');
    }

    /*
     * Get list of courses from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/course
        if (!coursesCache.get('list')) {
            return this.list();
        } else{
            return coursesCache.get('list');
        }
    };


    /*
     * Get list of courses
     */
    this.list = function() {
        // GET /api/course
        var data = _courseService.customGET('');;
        coursesCache.put('list',data);
        return data;
    };

    this.myList = function() {
        // GET /api/course
        var data = Restangular.all('my/course/list').customGET('');;
        //coursesCache.put('list',data);
        return data;
    };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page) {
        // GET /api/course?page=2
        return _courseService.getList({page:pageNumber,per_page:per_page});
    };


    this.cachedShow = function(id) {
        // GET /api/course/:id
        if (!coursesCache.get('show'+id)) {
            return this.show(id);
        } else{
            return coursesCache.get('show'+id);
        }
    };

    /*
     * Show specific course by Id
     */
    this.show = function(id) {
        // GET /api/course/:id
        var data = _courseService.get(id);
        coursesCache.put('show'+id,data);

        return data;
    };

    /*
     * Show specific course by Id
     */
    this.take = function(id) {
        // GET /api/course/:id
        //alert(id);Restangular.one("accounts", 123).customGET("messages")
        var data = Restangular.one("course", id).customGET("take");

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$route.reload();
        //coursesCache.put('show'+id,data);
        //$rootScope.goStateWithParam('app.showCourse', {id:id});

        //return data;
    };


    /*
     * Search in courses
     */
    this.search = function(query,per_page) {
        // GET /api/course/search?query=test&per_page=10
        if(query !=''){
            return _courseService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _courseService.getList();
        }
    }

});

