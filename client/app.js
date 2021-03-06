let app = angular.module('blood', ['ngRoute'])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider


  .when('/bloodmap', {
    templateUrl: 'bloodMap/bloodMap.html',
    controller: 'BloodMapController',
    controllerAs: 'BloodMapCtrl'
  })

  .when('/profile', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileController',
      controllerAs: 'ProfileCtrl'
  })
  .when('/hospital/signup', {
    templateUrl: 'hospital_auth/signup/signup.html',
    controller: 'HospitalAuthController',
    controllerAs: 'HospitalAuthCtrl'
  })
  .when('/hospital/login', {
    templateUrl: 'hospital_auth/login/login.html',
    controller: 'HospitalAuthController',
    controllerAs: 'HospitalAuthCtrl'
  })
  .when('/hospital/edit', {
    templateUrl: '/hospital_edit/edit.html',
    controller: 'HospitalEditController',
    controllerAs: 'HospitalEditCtrl'
  })
  .when('/donor/login', {
    templateUrl: '/donor_auth/login/login.html',
    controller: 'DonorAuthController',
    controllerAs: 'DonorAuthCtrl'
  })
  .when('/donor/signup', {
    templateUrl: '/donor_auth/signup/signup.html',
    controller: 'DonorAuthController',
    controllerAs: 'DonorAuthCtrl'
  })
  .when('/stock', {
    templateUrl: 'stock/stock.html',
    controller: 'StockController',
    controllerAs: 'StockCtrl'
  })
  .when('/splash', {
    templateUrl: 'splash/splash.html'
  })
  .otherwise({
      redirectTo: '/'
  });


});
