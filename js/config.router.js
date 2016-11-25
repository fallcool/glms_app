'use strict';

// database instance
var db = null;

app
    .run(function ($ionicPlatform, $rootScope, $stateParams, $state, Restangular, ionicToast, $cordovaNetwork, $cordovaSQLite, $ionicHistory,$ionicPopup) {
        /* API Base url to access to files or image */
        $rootScope.webRoot = 'http://angular.cnhost.gougu.com/';
        $rootScope.imageRoot = $rootScope.webRoot+  'uploads/images/';
        $rootScope.ngLaravelBackEndFileURL = 'http://188.40.252.106/ng-laravel/v1.3/laravel-backend/public/uploads/';
        $rootScope.ngLaravelUploadSrv = 'http://188.40.252.106/ng-laravel/v1.3/laravel-backend/public/api/uploadimage';
        $rootScope.ngLaravelDeleteImageSrv = 'http://188.40.252.106/ng-laravel/v1.3/laravel-backend/public/api/deleteimage/';

        // add listener for change page title and parent menu activation
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // Loading Option
        $rootScope.loading = {
            animation: 'fade-in',
            template: '<ion-spinner icon="android"></ion-spinner>',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        };

      //add functions
      $rootScope.goState = function(stateName) {
        $state.go(stateName);
      };

      $rootScope.goStateWithParam = function(stateName, params) {
        $state.go(stateName, params);
      };

      $rootScope.inArray = function (item, strArray) {
        var arr = strArray.split(',');
        var isCorrectAnswer = false;
        angular.forEach(arr, function (answer, key) {
          if (answer == item) {
            isCorrectAnswer = true;
          }
          //if (choice.checked == true) answers.push(choice.id);
        });

        return isCorrectAnswer;
      };


      // because my back-end is multilingual, we should set default language
        Restangular.setDefaultRequestParams({_format: 'json'});


        // ionic confirm close app with back button
        $ionicPlatform.registerBackButtonAction(function () {
            if ($state.current.name === "login") {
                navigator.app.exitApp();
            }
            else if ($ionicHistory.backView() === null) {
                // confirm popup alert
                $ionicPopup.confirm({
                    title: 'System warning',
                    template: 'Do you want to exit?'
                }).then(function(res) {
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                })
            }
            else {
                $ionicHistory.goBack();
            }
        }, 100);

        // ionic config
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // check your internet connection
            if ($cordovaNetwork.isOffline()) {
                ionicToast.show('Please check your internet connection and try again.', 'bottom', true, 5000);
            }

            // cordova SQLite setup
            $ionicPlatform.ready(function () {
                db = $cordovaSQLite.openDB({name: "nglaravel.db", location: 'default'});// database file name is 'nglaravel'
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
            });
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $authProvider, RestangularProvider, $ionicConfigProvider) {

        /**
         *
         *  ngAA Config
         */
        $authProvider.signinUrl = 'http://angular.cnhost.gougu.com/app_dev.php/api/login_check';
        $authProvider.signinState = 'login';
        $authProvider.signinRoute = '/login';
        $authProvider.signinTemplateUrl = 'shared/views/login.html';
        $authProvider.afterSigninRedirectTo = 'app.courses';
        $authProvider.afterSignoutRedirectTo = 'login';

        /**
         *
         * Restangular API URL
         */
        RestangularProvider.setBaseUrl('http://angular.cnhost.gougu.com/app_dev.php/api');
        /* force Restangular's getList to work with Laravel 5's pagination object  */
        RestangularProvider.addResponseInterceptor(parseApiResponse);
        function parseApiResponse(data, operation) {
            var response = data;
            if (operation === 'getList' && data.data) {
                response = data.data;
                response.metadata = _.omit(data, 'data');
            }
            return response;
        }


        /**
         * UI-Router config
         */
        // config prefix and unmatched route handler - UI-Router
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go('login');
        });
        $stateProvider
            .state('forget', {
                url: "/forget",
                templateUrl: "shared/views/forget.html"
            })
            .state('reset', {
                url: "/reset",
                templateUrl: "shared/views/reset.html"
            })
            .state('app', {
                url: '/app',
                abstract: true,
                data: {
                    authenticated: true
                },
                controller: 'AdminCtrl',
                templateUrl: 'shared/views/admin.html'
            })
          .state('app.courses', {
            url: "/courses",
            views: {
              'menuContent': {
                templateUrl: "modules/course/views/lists.html",
                controller: 'CourseListCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['CourseService',
                function (CourseService) {
                  return CourseService.cachedList().then(function (data) {
                    return data;
                  });
                }]
            }
          })
          .state('app.showCourse', {
            url: "/course/:id",
            views: {
              'menuContent': {
                templateUrl: "modules/course/views/show.html",
                controller: 'CourseShowCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['CourseService', '$stateParams',
                function (CourseService, $stateParams) {
                  return CourseService.show($stateParams.id).then(function (data) {
                    return data;
                  });
                }],
            }

          })
          .state('app.showKejian', {
            url: "/kejian/:id",
            views: {
              'menuContent': {
                templateUrl: "modules/course/views/showKejian.html",
                controller: 'KejianShowCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['KejianService', '$stateParams',
                function (KejianService, $stateParams) {
                  return KejianService.show($stateParams.id).then(function (data) {
                    return data;
                  });
                }],
            }

          })
          .state('app.exams', {
            url: "/exams",
            views: {
              'menuContent': {
                templateUrl: "modules/exam/views/lists.html",
                controller: 'ExamListCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['ExamService',
                function (ExamService) {
                  return ExamService.cachedList().then(function (data) {
                    return data;
                  });
                }]
            }
          })
          .state('app.completed_exams', {
            url: "/completed_exams",
            views: {
              'menuContent': {
                templateUrl: "modules/exam/views/completed_lists.html",
                controller: 'ExamCompletedListCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['ExamService',
                function (ExamService) {
                  return ExamService.completedList().then(function (data) {
                    return data;
                  });
                }]
            }
          })
          .state('app.takeQuestion', {
            url: "/question/:id/take",
            views: {
              'menuContent': {
                templateUrl: "modules/exam/views/takeQuestion.html",
                controller: 'QuestionTakeCtrl'
              }
            },
            cache: false
          })
          .state('app.questions', {
            url: "/questions",
            views: {
              'menuContent': {
                templateUrl: "modules/exam/views/questions.html"
              }
            },
            cache: false
          })
          .state('app.showQuiz', {
            url: "/quiz/:id",
            views: {
              'menuContent': {
                templateUrl: "modules/exam/views/showQuiz.html",
                controller: 'QuizShowCtrl'
              }
            },
            cache: false,
            resolve: {
              resolvedItems: ['ExamService', '$stateParams',
                function (ExamService, $stateParams) {
                  return ExamService.showQuiz($stateParams.id).then(function (data) {
                    return data;
                  });
                }]
            }
          })
    });
