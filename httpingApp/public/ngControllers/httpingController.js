/**
 * Created by mattlam on 11/30/15.
 */
/*---------------------------------------------------------------------------
 Main httping Controller
 ----------------------------------------------------------------------------*/
angular.module('httpingApp')
.controller('HttpingCtrl', ['$scope', '$routeParams', 'Urls', 'Errors',
        'StatusCodes', function($scope, $routeParams, Urls, Errors, StatusCodes) {

        /*-----------------------------------------------------------------------
         Initialize $scope variables
         ------------------------------------------------------------------------*/
        // $scope.urls = 'Blah';
        $scope.urls = Urls.query();
        $scope.errors = Errors.query();
        $scope.codes = StatusCodes.query();

        console.log('Codes in Angular: ', $scope.codes);

        if ($routeParams.id) {
            $scope.statusCode = $routeParams.id;
        }

        /*-------------------------------------------------------------------------
         Event Handlers
         ------------------------------------------------------------------------*/

    }
]);
