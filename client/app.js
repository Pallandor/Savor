var app = angular
  .module('savor', [
    'savor.toolbar',
    'savor.review',
    'savor.profile',
    'savor.user',
    // ADDED R.S
    'savor.uber',
    'savor.home',
    'auth0',
    'angular-storage',
    'angular-jwt',
    'ui.router',
    'ngDialog',
    'ngMaterial',
    'material.svgAssetsCache',
    'uiGmapgoogle-maps',
    'geolocation'
  ])


  .config(function($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider, uiGmapGoogleMapApiProvider) {

    authProvider.init({
      domain: 'savor-it.auth0.com',
      clientID: '9GEIyOmo6sWg0W912IKhAb3UF2mA37kr'
    });

    $urlRouterProvider.otherwise('/user');

    $stateProvider

    .state('profile', {
      url: '/profile',
      templateUrl: '/views/components/profile/profile.tpl.html',
      controller: 'profileController as user'
    })
    .state('user', {
      url: '/user',
      templateUrl: '/views/components/user/user.tpl.html',
      controller: 'userController',
    })
    .state('review', {
      url: '/review',
      templateUrl: '/views/components/review/review.tpl.html',
      controller: 'reviewController',
    })
    .state('test', {
      url: '/test',
      templateUrl: '/views/components/test/test.tpl.html',
      controller: 'testController',
    })
    .state('/', {
      url: '/?accessToken',
      templateUrl: '/views/components/home/home.tpl.html',
      controller: 'homeController',
      onEnter: ['$stateParams', '$state', 'uber', function($stateParams, $state, uber) {
         if ($stateParams.accessToken){
            // debugger; 
            uber.saveToken($stateParams.accessToken);
            alert('Uber session authorized! Redirecting to Uber Trip Page...'); 
            $state.go('uber'); 
          }
      }]
    })
    .state('uber', {
      url: '/uber',
      templateUrl: '/views/components/uber/uber.tpl.html',
      controller: 'uberController'
    });

    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCOQHHGcQGGgCWJPvOaMmy61P_1rXQgo7k'
    });

    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    };

    //  The redirect function is used to check for a rejection.status
    //  of 401 on any responses that come back from HTTP requests.
    //  If one is found, we use auth.signout to set isAuthenticated
    //  to false, remove the user’s profile and JWT, and take them
    //  to the home state.
    function redirect($q, $injector, auth, store, $location) {
      return {
        responseError: function(rejection) {
          if (rejection.status === 401) {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $location.path('/');
          }
          return $q.reject(rejection);
          }
      };
    }
    $provide.factory('redirect', redirect);
    $httpProvider.interceptors.push('jwtInterceptor');
    // need to check
    // $httpProvider.interceptors.push('redirect');
  })

  // The callback in $locationChangeStart gets evaluated
  // every time the page is refreshed, or when a new URL
  // is reached. Inside the callback we are looking for
  // a saved JWT, and if there is one, we check whether
  // it is expired. If the JWT isn’t expired, we set the
  // user’s auth state with their profile and token. If
  // the JWT is expired, we redirect to the home route.
  .run(function($rootScope, $state, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function(e, toState) {

      // // CHANGED (only sets)
      // if (toState.url === '/test'){
      //   $rootScope.toStateUrl = toState.url;
      // }

      // Get the JWT that is saved in local storage
      // and if it is there, check whether it is expired.
      // If it isn't, set the user's auth state
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        }
      } else {
        // Otherwise, redirect to the home route
        $location.path('/');
      }
    });
  })

  .controller('savorCtrl',['$scope', '$http', '$location', '$stateParams', function savorCtrl($scope, $http, $location, $stateParams) {
    //none of the functions below are being used...
    function getOne() {
      var id = $stateParams.id;
      $http.get('/api/restaurants/'+id).then(function(res) {
        $scope.restaurant = res.data;
      });
    }

    function addOne() {
      $http.post('/api/restaurants', $scope.restaurant).then(function(res) {
        window.location.href='#/restaurants';
      });
    }

    function update() {
      var id = $stateParams.id;
      $http.put('/api/restaurants/'+id, $scope.restaurant).then(function(res) {
        window.location.href='#/restaurants';
      });
    }

    function remove() {
      var id = $stateParams.id;
      $http.delete('/api/restaurants/' + id).success(function(response) {
        window.location.href='#/restaurants';
      });
    }

  }]);

// initialize socket.io-client
var socket = io();
