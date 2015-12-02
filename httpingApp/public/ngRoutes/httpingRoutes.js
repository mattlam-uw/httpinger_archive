/*-----------------------------------------------------------------------------
 Routing for Links views depending on requested URL
 ----------------------------------------------------------------------------*/
angular.module('httpingApp').config(function($routeProvider) {
    // For non-specified URL, render httpingMain.html
    $routeProvider.when('/', {
        templateUrl: 'ngViews/httpingMain.html',
        controller: 'HttpingCtrl'
    }, true);

    // For any other URL, render httpingMain.html
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
