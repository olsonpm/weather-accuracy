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

    this.localTz = jstz.determine().name();
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
    var localHourForMidnightUtc = moment(Date.UTC(curMoment.year(), curMoment.month(), curMoment.day(), 0)).hour();

    log.info('Local hour equal to midnight UTC: ' + localHourForMidnightUtc);

    Schedule.scheduleJob({
        dayOfWeek: [new Schedule.Range(0, 6)]
        , hour: localHourForMidnightUtc
        , minute: 0
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

    // for now we are going to assume the eastern timezone.  Heroku's servers reported live there
    //   and their local time zone is unfortunately UTC
    log.info('local System Time Zone: ' + self.localTz);

    lazyLocations
        .groupBy(function(aLocation) {
            return aLocation.TZ();
        })
        .each(function(locationArray) {
            var locationTZ = locationArray[0].TZ();

            var left = moment(curDateAtNoonObj);
            var right = moment.tz(curDateAtNoonObj, locationTZ);
            var diffHours = left.diff(right, 'hours');
            var localHourForLocation = moment(curDateAtNoonObj).subtract(diffHours, 'hours').hour();

            log.info('Local hour equal to noon in ' + locationTZ + ': ' + localHourForLocation);
            log.debug('*hardcoding local hour 22');

            var jobLocationsStr = lazy(locationArray)
                .map(function(aLocation) {
                    return aLocation.Name();
                })
                .join(' - ');

            Schedule.scheduleJob({
                dayOfWeek: [new Schedule.Range(0, 6)]
                , hour: 22
                , minute: 12
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
