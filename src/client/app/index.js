'use strict';

//---------//
// Imports //
//---------//

var angular = require('angular')
    , nh = require('node-helpers')
    , bunyan = require('bunyan')
    , config = require('../../../package.json')
    , path = require('path');


//------//
// Init //
//------//

var bunyanStreams = nh.bunyanStreams;
var curEnv = (new nh.Environment()).curEnv();

var appName = "weatherAccuracy";
var bstream = bunyanStreams(appName, curEnv);
var log = bunyan.createLogger({
    name: appName
    , src: bstream.source
    , streams: [{
        level: bstream.level
        , stream: bstream.stream
        , type: bstream.type
    }]
});

// initialize personal jquery plugins
require('personal-jquery-plugins').initAll((require('jquery')));

var app = angular.module('weatherAccuracy', [require('angular-route')]);
// load the template cache
require('./templates');

//------------//
// Add Routes //
//------------//

require('./routes')(app, curEnv);


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
