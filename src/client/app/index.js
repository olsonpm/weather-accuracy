'use strict';


//---------//
// Imports //
//---------//

var angular = require('angular')
  , nh = require('node-helpers')
  ;


//------//
// Init //
//------//

var appName = 'weatherAccuracy';
var log = new nh.LogProvider()
  .AppName(appName)
  .getLogger();

// initialize personal jquery plugins
require('personal-jquery-plugins').initAll((require('jquery')));

var app = angular.module(appName, [require('angular-route')]);
// load the template cache
require('./templates');


//------------//
// Add Routes //
//------------//

require('./routes')(app);


//-----------------//
// Add Controllers //
//-----------------//

require('./components/application-controller')(app, log);


//----------------//
// Add Directives //
//----------------//

require('./components/error404')(app, log);
require('./components/directives/interactive-graph')(app, log);
require('./components/directives/graph-options')(app, log);
require('./components/directives/graphs')(app, log);
