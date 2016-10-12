(function() {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ngRoute'])
    .config(config)
    .run( function($rootScope, $location) {

   // register listener to watch route changes
       $rootScope.$on( "$routeChangeStart", function(event, next, current) {
         if ( !$rootScope.isAuthenticated ) {
               $location.path( "/login" );
           }
       });
    })
    .filter('capitalize', function() {
       return function(input) {
           return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
       }
    });

    config.$inject = ['$routeProvider', '$httpProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider'];

    function config($routeProvider, $httpProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider) {

      // Initialization for the Lock widget
      lockProvider.init({
        clientID: AUTH0_CLIENT_ID,
        domain: AUTH0_DOMAIN
      });

      // Configuration for angular-jwt
      jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/login'
      });

      // Add the jwtInterceptor to the array of HTTP interceptors
      // so that JWTs are attached as Authorization headers
      $httpProvider.interceptors.push('jwtInterceptor');

      $routeProvider
        .when('/', {
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .when('/login', {
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        })
        .when('/ping', {
          controller: 'pingController',
          templateUrl: 'components/ping/ping.html'
        })
        .when('/profile', {
          controller: 'profileController',
          templateUrl: 'components/profile/profile.html',
          css: 'css/profileStyle.css'
        })
        .when('/inventory', {
          controller: 'inventoryController',
          templateUrl: 'components/inventory/inventory.html'
        })
        .otherwise({
          redirectTo: '/'
       });
    }

    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });

    $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("navbar-collapse collapse in");
        if (_opened === true && !clickover.hasClass("navbar-toggle")) {
            $("button.navbar-toggle").click();
        }
    });

})();
