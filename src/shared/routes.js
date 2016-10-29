'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
  , path = require('path');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//------//
// Main //
//------//

function ARoute(name_, url_, path_) {
  this.name = name_;
  this.url = '/' + url_;
  this.path = path.join('app/components/', path_ + '.html');
}

function Routes() {
  var my = { routeSeq: null };

  this.routeSeq = function routeSeq(nothing) {
    if (typeof nothing !== 'undefined') {
      throw new Error("Invalid Argument: <Routes>.routeSeq is read-only");
    }

    // if my.routeSeq hasn't been initialized yet, then let's initialize it
    if (my.routeSeq === null) {
      var objRoutes = require('./routesObj.json');
      my.routeSeq = [];
      Object.keys(objRoutes).forEach(function(r) {
        my.routeSeq.push(new ARoute(
          r
          , objRoutes[r].url
          , objRoutes[r].path
        ));
      });

      my.routeSeq = lazy(my.routeSeq);
    }

    return my.routeSeq;
  };
}


//---------//
// Exports //
//---------//

module.exports = Routes;
