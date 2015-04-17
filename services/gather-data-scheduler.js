'use strict';


//---------//
// Imports //
//---------//

var moment = require('moment-timezone')
    , DALLocation = require('../db/models/dal/location')
    , nh = require('node-helpers')
    , insertDates = require('../services/insert-dates')
    , confs = require('../utils/pg-confs')
    , bPromise = require('bluebird')
    , Schedule = require('node-schedule')
    , jstz = require('jstimezonedetect').jstz
    , gatherDataService = require('./gather-data');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils
    , lazy = nh.lazyExtensions
    , LogProvider = nh.LogProvider;


//------//
// Main //
//------//

function GatherDataScheduler(pgWrapInst, envInst) {
    this.pgWrapInst = pgWrapInst;
    this.envInst = envInst;
    this.log = new LogProvider()
        .EnvInst(envInst)
        .getLogger();
}


//------------------//
// Public Functions //
//------------------//

GatherDataScheduler.prototype.startScheduler = function startScheduler() {
    var self = this;

    var dalLocationInst = new DALLocation(self.pgWrapInst);

    dalLocationInst.getAllLocations()
        .then(function(lazyLocations) {
            self._scheduleDayInsertions();
            self._scheduleDataInsertions(lazyLocations);
        });
};


//-----------------//
// Private Helpers //
//-----------------//

GatherDataScheduler.prototype._scheduleDayInsertions = function _scheduleDayInsertions() {
    var self = this;
    var log = self.log;

    var curMoment = moment();
    var localHourForMidnightUtc = moment(new Date(Date.UTC(curMoment.year(), curMoment.month(), curMoment.day(), 0))).hour();

    log.info('Local hour equal to midnight UTC: ' + localHourForMidnightUtc);

    Schedule.scheduleJob({
        dayOfWeek: [new Schedule.Range(0, 6)]
        , hour: localHourForMidnightUtc
    }, function() {
        log.info("Inserting ymd's into the database");
        insertDates(self.pgWrapInst);
    });
};

GatherDataScheduler.prototype._scheduleDataInsertions = function _scheduleDataInsertions(lazyLocations) {
    var self = this;
    var log = self.log;

    var curMoment = moment();
    var curDateAtNoonObj = {
        year: curMoment.year()
        , month: curMoment.month()
        , day: curMoment.day()
        , hour: 12
    };
    var localTZ = jstz.determine().name();

    log.info('local Time Zone: ' + localTZ);

    lazyLocations
        .groupBy(function(aLocation) {
            return aLocation.TZ();
        })
        .each(function(locationArray) {
            var locationTZ = locationArray[0].TZ();
            var localHourForLocation = moment.tz(curDateAtNoonObj, locationTZ).tz(localTZ).hour();

            log.info('Local hour equal to noon in ' + locationTZ + ': ' + localHourForLocation);

            var jobLocationsStr = lazy(locationArray)
                .map(function(aLocation) {
                    return aLocation.Name();
                })
                .join(' - ');

            Schedule.scheduleJob({
                dayOfWeek: [new Schedule.Range(0, 6)]
                , hour: localHourForLocation
            }, function() {
                log.info("Gathering data for " + jobLocationsStr);
                gatherDataService(locationArray, self.pgWrapInst, self.envInst);
            });
        });
};


//---------//
// Exports //
//---------//

module.exports = GatherDataScheduler;
