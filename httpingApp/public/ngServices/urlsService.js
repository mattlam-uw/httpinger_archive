/*-----------------------------------------------------------------------------
 Resource service to be used by AngularJS controllers to make calls to /urls
 http API
 ----------------------------------------------------------------------------*/
angular.module('httpingApp')
.factory('Urls', ['$resource', function($resource) {
    return $resource('/urls/:id', null, { 'update': { 'method': 'PUT' } });
}]);