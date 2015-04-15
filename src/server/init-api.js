'use strict';

//----------//
// Comments //
//----------//

/*
 * TODO: figure out system for api routes
 */


//---------//
// Imports //
//---------//

var DALDataPoint = require('../../db/models/dal/data-point')
    , DALLocation = require('../../db/models/dal/location')
    , DALType = require('../../db/models/dal/type')
    , DALymd = require('../../db/models/dal/ymd')
    , DALMeasurementName = require('../../db/models/dal/measurement-name')
    , DALSource = require('../../db/models/dal/source')
    , confs = require('../../utils/pg-confs')
    , YMD = require('../../db/models/extensions/ymd')
    , moment = require('moment')
    , nh = require('node-helpers')
    , bunyan = require('bunyan');


//------//
// Init //
//------//

var BunyanStreams = nh.BunyanStreams;


//------//
// Main //
//------//

function initApi(app, curEnv) {
    var pgWrapperInst = confs[curEnv].GeneratePGWrapper()
        , dalDataPointInst = new DALDataPoint(pgWrapperInst)
        , dalLocationInst = new DALLocation(pgWrapperInst)
        , dalTypeInst = new DALType(pgWrapperInst)
        , dalYmdInst = new DALymd(pgWrapperInst)
        , dalMeasurementNameInst = new DALMeasurementName(pgWrapperInst)
        , dalSourceInst = new DALSource(pgWrapperInst);

    var appName = 'weatherAccuracy';
    var bstream = BunyanStreams(appName, curEnv);
    var log = bunyan.createLogger({
        name: appName
        , src: bstream.source
        , streams: [{
            level: bstream.level
            , stream: bstream.stream
            , type: bstream.type
        }]
    });

    app.get('/api/graph-data', function(req, res) {
        var bDataPoints;

        // validation
        if (!(req.query.dateFrom && req.query.dateTo)) {
            throw new Error("Invalid Arguments: /graph-data requires two query strings dateFrom and dateTo");
        }
        YMD.ValidateValue(req.query.dateFrom, true);
        YMD.ValidateValue(req.query.dateTo);
        var momentFrom = YMD.getMoment(req.query.dateFrom);
        var momentTo = YMD.getMoment(req.query.dateTo);

        if (!momentFrom.isBefore(momentTo)) {
            throw new Error("Invalid Arguments: /graph-data requires dateFrom to be before dateTo");
        } else if (Math.abs(momentFrom.diff(momentTo, 'days')) > 31) {
            throw new Error("Invalid Arguments: /graph-data requires the number of days between dateFrom and dateTo to be no longer than 31 days");
        }

        // query string is valid
        bDataPoints = dalDataPointInst.getDataPointsBetweenDates(req.query.dateFrom, req.query.dateTo)
            .then(function(lazyDataPoints) {
                var resDataPoints = lazyDataPoints.map(function(aDataPoint) {
                        return aDataPoint.serialize();
                    })
                    .toArray();
                res.send(resDataPoints);
            });
    });

    app.get('/api/locations', function(req, res) {
        var bLocations = dalLocationInst.getAllLocations()
            .then(function(lazyLocations) {
                var resLocations = lazyLocations.map(function(aLocation) {
                        return aLocation.serialize();
                    })
                    .toArray();
                res.send(resLocations);
            });
    });

    app.get('/api/types', function(req, res) {
        var bTypes = dalTypeInst.getClientOptionTypes()
            .then(function(lazyTypes) {
                var resTypes = lazyTypes.map(function(aType) {
                        return aType.serialize();
                    })
                    .toArray();
                res.send(resTypes);
            });
    });

    app.get('/api/measurement-names', function(req, res) {
        var bMeasurementNames = dalMeasurementNameInst.getAllMeasurementNames()
            .then(function(lazyMeasurementNames) {
                var resMeasurementNames = lazyMeasurementNames.map(function(aMeasurementName) {
                        return aMeasurementName.serialize();
                    })
                    .toArray();
                res.send(resMeasurementNames);
            });
    });

    app.get('/api/ymd-range', function(req, res) {
        var bYmds = dalYmdInst.getYmdRangeWithFullData()
            .then(function(dateRange) {
                var resYmds = {
                    min: dateRange.min.serialize()
                    , max: dateRange.max.serialize()
                };

                res.send(resYmds);
            });
    });

    app.get('/api/sources', function(req, res) {
        var bSources = dalSourceInst.getAllSources()
            .then(function(lazySources) {
                var resSources = lazySources.map(function(aSource) {
                        return aSource.serialize();
                    })
                    .toArray();

                res.send(resSources);
            });
    });
}


//---------//
// Exports //
//---------//

module.exports = initApi;
