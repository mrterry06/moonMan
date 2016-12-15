// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('moonMan', ['ionic', 'nvd3', 'moonMan.controllers', 'moonMan.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state("pinPad", {
      url: '/pinPad',
      templateUrl: 'templates/pinPad.html',
      controller: 'pinPadCtrl'
    })
    .state("initial", {
      url: '/initial',
      templateUrl: 'templates/initial.html',
      controller: 'gatherInfo'
    })
    .state("test", {
      url: '/test',
      templateUrl: "templates/test.html",
      controller: "testCtrl"
    })

    .state("weekday", {
      url: '/weekday',
      templateUrl: 'templates/weekday.html',
      controller: 'gatherInfo'
    })

    .state("goal", {
      url: '/goal',
      templateUrl: 'templates/goal.html',
      controller: 'gatherInfo'
    })
    .state("paycheck", {
      url: '/paycheck',
      templateUrl: 'templates/paycheck.html',
      controller: 'gatherInfo'
    })

    .state("finance", {
      url: '/finance',
      abstract: true,
      templateUrl: 'templates/finance.html',
      controller: 'financeCtrl'
    })

    .state("finance.account", {
      url: '/account',
      views: {
          "finance-content": {
             templateUrl: 'templates/account.html',
              controller: 'accountCtrl'
        }
      }
    })


    .state("finance.update", {
      url: '/update',
      views: {
        "finance-content": {
          templateUrl: 'templates/update.html',
          controller: 'updateCtrl'
        }
      }
    })

    .state("finance.outcome", {
      url: '/outcome',
      views: {
          "finance-content": {  
        templateUrl: 'templates/outcome.html',
        controller: 'outcomeCtrl'
        }
      }
    })

    .state("finance.account-more", {
      url: '/account-more',
      views: {
          "finance-content": {
            templateUrl: 'templates/menu/account-more.html',
            controller: 'accountMore'
          }
      }
    })

    .state("finance.settings", {
      url: '/account-more',
      views: {
          "finance-content": {
            templateUrl: 'templates/menu/settings.html',
            controller: 'settingsCtrl'
          }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/initial');

});
