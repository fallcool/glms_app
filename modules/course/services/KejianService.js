'use strict';

angular.module('ng-laravel').service('KejianService', function($rootScope, Restangular,CacheFactory) {
    /*
     * Build collection /kejian
     */
    var _kejianService = Restangular.all('kejian/');
    if (!CacheFactory.get('kejiansCache')) {
        var kejiansCache = CacheFactory('kejiansCache');
    }

    /*
     * Get list of kejians from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/kejian
        if (!kejiansCache.get('list')) {
            return this.list();
        } else{
            return kejiansCache.get('list');
        }
    };


    /*
     * Get list of kejians
     */
    this.list = function() {
        // GET /api/kejian
        var data = _kejianService.getList();
        kejiansCache.put('list',data);
        return data;
    };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page) {
        // GET /api/kejian?page=2
        return _kejianService.getList({page:pageNumber,per_page:per_page});
    };


    this.cachedShow = function(id) {
        // GET /api/kejian/:id
        if (!kejiansCache.get('show'+id)) {
            return this.show(id);
        } else{
            return kejiansCache.get('show'+id);
        }
    };

    /*
     * Show specific kejian by Id
     */
    this.show = function(id) {
        // GET /api/kejian/:id
        var data = _kejianService.get(id);
        kejiansCache.put('show'+id,data);

        return data;
    };


    /*
     * Search in kejians
     */
    this.search = function(query,per_page) {
        // GET /api/kejian/search?query=test&per_page=10
        if(query !=''){
            return _kejianService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _kejianService.getList();
        }
    }

});

