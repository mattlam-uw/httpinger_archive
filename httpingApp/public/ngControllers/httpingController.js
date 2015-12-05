/**
 * Created by mattlam on 11/30/15.
 */
/*---------------------------------------------------------------------------
 Main httping Controller
 ----------------------------------------------------------------------------*/
angular.module('httpingApp')
.controller('HttpingCtrl', ['$scope', '$routeParams', 'Urls', 'Errors',
        'StatusCodes', 'ErrorCount',
        function($scope, $routeParams, Urls, Errors, StatusCodes, ErrorCount) {

        /*-----------------------------------------------------------------------
         Initialize $scope variables
         ------------------------------------------------------------------------*/
        // $scope.urls = 'Blah';
        $scope.urls = Urls.query();
        $scope.errors = Errors.query();
        $scope.count = ErrorCount.query();

        if ($routeParams.id) {
            $scope.statusCode = $routeParams.id;
        }

        /*-------------------------------------------------------------------------
         Event Handlers
         ------------------------------------------------------------------------*/

    }
]);
