'use strict';

// database instance
var db = null;

app
    .constant("webroot",'http://angular.cnhost.gougu.com/')
    .run(function ($ionicPlatform, $rootScope, $stateParams, $state, Restangular, ionicToast, webroot, $cordovaNetwork, $cordovaSQLite, $ionicHistory,$ionicPopup) {
        /* API Base url to access to files or image */
        $rootScope.webRoot = webroot;
        $rootScope.imageRoot = $rootScope.webRoot+  'uploads/images/';

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

      $rootScope.goBack = function() {

            $ionicHistory.goBack();
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


        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $authProvider, RestangularProvider, $ionicConfigProvider, webroot) {

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            webroot + '**',
        ]);

        /**
         *
         *  ngAA Config
         */
        $authProvider.signinUrl = webroot + 'app_dev.php/api/login_check';
        $authProvider.signinState = 'login';
        $authProvider.signinRoute = '/login';
        $authProvider.signinTemplateUrl = 'shared/views/login.html';
        $authProvider.afterSigninRedirectTo = 'app.courses';
        $authProvider.afterSignoutRedirectTo = 'login';

        /**
         *
         * Restangular API URL
         */
        RestangularProvider.setBaseUrl(webroot + 'app_dev.php/api');
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
            .state('app.mycourses', {
                url: "/mycourses",
                views: {
                    'menuContent': {
                        templateUrl: "modules/course/views/myLists.html",
                        controller: 'MyCourseListCtrl'
                    }
                },
                cache: false,
                resolve: {
                    resolvedItems: ['CourseService',
                        function (CourseService) {
                            return CourseService.myList().then(function (data) {
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
    })
    .directive('backButton', function(){
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {
                element.bind('click', goBack);

                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })
;
