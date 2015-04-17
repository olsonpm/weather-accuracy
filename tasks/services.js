'use strict';


//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , insertDates = require('../services/insert-dates')
    , nh = require('node-helpers')
    , confs = require('../utils/pg-confs')
    , bunyan = require('bunyan')
    , gatherDataService = require('../services/gather-data')
    , GatherDataScheduler = require('../services/gather-data-scheduler')
    , DALLocation = require('../db/models/dal/location');


//------//
// Init //
//------//

var PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , Environment = nh.Environment
    , bunyanStreams = nh.bunyanStreams;


//------//
// Main //
//------//

var insertCurrentDates = new PromiseTask()
    .id('insertCurrentDates')
    .task(function() {
        var envInst = new Environment()
            .HardCoded(this.globalArgs().env);

        var pgWrapInst = confs[envInst.curEnv()].GeneratePGWrapper();
        return insertDates(pgWrapInst)
            .finally(function() {
                pgWrapInst.end();
            });
    });

var gatherAllData = new PromiseTask()
    .id('gatherAllData')
    .task(function() {
        var envInst = new Environment()
            .HardCoded(this.globalArgs().env);

        var pgWrapInst = confs[envInst.curEnv()].GeneratePGWrapper();
        var dalLocationInst = new DALLocation(pgWrapInst);
        dalLocationInst.getAllLocations()
            .then(function(lazyLocations) {
                return gatherDataService(lazyLocations.toArray(), pgWrapInst, envInst);
            })
            .finally(function() {
                pgWrapInst.end();
            });
    });

var startScheduler = new PromiseTask()
    .id('startScheduler')
    .task(function() {
        var envInst = new Environment()
            .HardCoded(this.globalArgs().env);

        var appName = "weatherAccuracy";
        var bstream = bunyanStreams(appName, envInst.curEnv());
        var log = bunyan.createLogger({
            name: appName
            , src: bstream.source
            , streams: [{
                level: bstream.level
                , stream: bstream.stream
                , type: bstream.type
            }]
        });

        var pgWrapInst = confs[envInst.curEnv()].GeneratePGWrapper();
        var dalLocationInst = new DALLocation(pgWrapInst);
        dalLocationInst.getAllLocations()
            .then(function(lazyLocations) {
                var gds = new GatherDataScheduler(pgWrapInst, envInst);
                gds.startScheduler();
            });
    });


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(insertCurrentDates, gatherAllData, startScheduler);
