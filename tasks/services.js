'use strict';


//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , insertDates = require('../services/insert-dates')
    , nh = require('node-helpers')
    , confs = require('../utils/pg-confs')
    , gatherAllDataService = require('../services/gather-all-data');


//------//
// Init //
//------//

var PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , Environment = nh.Environment;


//------//
// Main //
//------//

var insertCurrentDates = new PromiseTask()
    .id('insertCurrentDates')
    .task(function() {
        var env = new Environment({
            hardCoded: this.globalArgs().env
        });

        var pgWrapInst = confs[env.curEnv()].GeneratePGWrapper();
        return insertDates(pgWrapInst)
            .finally(function() {
                pgWrapInst.end();
            });
    });

var gatherAllData = new PromiseTask()
    .id('gatherAllData')
    .task(function() {
        var envInst = new Environment({
            hardCoded: this.globalArgs().env
        });

        var pgWrapInst = confs[envInst.curEnv()].GeneratePGWrapper();
        return gatherAllDataService(pgWrapInst, envInst)
            .finally(function() {
                pgWrapInst.end();
            });
    });


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(insertCurrentDates, gatherAllData);
