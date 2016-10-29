'use strict';


//---------//
// Imports //
//---------//

var Routes = require('../../shared/routes');


//------//
// Init //
//------//

var routesInst = new Routes();


//------//
// Main //
//------//

module.exports = function(app) {
  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    var routeSeq = routesInst.routeSeq();

    routeSeq
      .where(function(r) { return r.name !== 'otherwise'; })
      .each(function(r) {
        $routeProvider.when(r.url, {
          templateUrl: r.path
        });
      });

    // Best guess for special cases
    //   special cases are routes with the names 'otherwise' and 'home'
    var home = routeSeq.find(function(r) { return r.name === 'home'; });
    if (home) {
      $routeProvider.when('/', {
        redirectTo: '/home'
      });
    }
    var otherwise = routeSeq.find(function(r) { return r.name === 'otherwise'; });
    if (otherwise) {
      $routeProvider.otherwise({
        templateUrl: otherwise.path
      });
    }

    $locationProvider.html5Mode(true);
  }]);
};
