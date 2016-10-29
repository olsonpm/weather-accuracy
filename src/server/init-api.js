'use strict';

//
// TODO: figure out system for api routes
//


//---------//
// Imports //
//---------//

var confs = require('../../utils/pg-confs')
  , DALDataPoint = require('../../db/models/dal/data-point')
  , DALLocation = require('../../db/models/dal/location')
  , DALType = require('../../db/models/dal/type')
  , DALymd = require('../../db/models/dal/ymd')
  , DALMeasurementName = require('../../db/models/dal/measurement-name')
  , DALSource = require('../../db/models/dal/source')
  , YMD = require('../../db/models/extensions/ymd')
  ;


//------//
// Main //
//------//

const initApi = app => {
  var pgWrapperInst = confs[global.env].GeneratePGWrapper()
    , dalDataPointInst = new DALDataPoint(pgWrapperInst)
    , dalLocationInst = new DALLocation(pgWrapperInst)
    , dalTypeInst = new DALType(pgWrapperInst)
    , dalYmdInst = new DALymd(pgWrapperInst)
    , dalMeasurementNameInst = new DALMeasurementName(pgWrapperInst)
    , dalSourceInst = new DALSource(pgWrapperInst);

  app.get('/api/graph-data', (req, res) => {
    // validation
    if (!(req.query.dateFrom && req.query.dateTo)) {
      throw new Error("Invalid Arguments: /graph-data requires two query strings dateFrom and dateTo");
    }

    YMD.ValidateValue(req.query.dateFrom, true);
    YMD.ValidateValue(req.query.dateTo);

    var momentFrom = YMD.getMoment(req.query.dateFrom)
      , momentTo = YMD.getMoment(req.query.dateTo);

    if (!momentFrom.isBefore(momentTo)) {
      throw new Error("Invalid Arguments: /graph-data requires dateFrom to be before dateTo");
    } else if (Math.abs(momentFrom.diff(momentTo, 'days')) > 31) {
      throw new Error("Invalid Arguments: /graph-data requires the number of days between dateFrom and dateTo to be no longer than 31 days");
    }

    // query string is valid
    dalDataPointInst.getDataPointsBetweenDates(req.query.dateFrom, req.query.dateTo)
    .then(lazyDataPoints => {
        var resDataPoints = lazyDataPoints.map(aDataPoint => aDataPoint.serialize())
          .toArray();
        res.send(resDataPoints);
      });
  });

  app.get('/api/locations', (req, res) => {
    dalLocationInst.getAllLocations()
      .then(lazyLocations => {
        var resLocations = lazyLocations.map(aLocation => aLocation.serialize())
          .toArray();
        res.send(resLocations);
      });
  });

  app.get('/api/types', (req, res) => {
    dalTypeInst.getClientOptionTypes()
      .then(lazyTypes => {
        var resTypes = lazyTypes.map(aType => aType.serialize()).toArray();
        res.send(resTypes);
      });
  });

  app.get('/api/measurement-names', (req, res) => {
    dalMeasurementNameInst.getAllMeasurementNames()
      .then(lazyMeasurementNames => {
        var resMeasurementNames = lazyMeasurementNames
          .map(aMeasurementName => aMeasurementName.serialize())
          .toArray();
        res.send(resMeasurementNames);
      });
  });

  app.get('/api/ymd-range', (req, res) => {
    dalYmdInst.getYmdRangeWithFullData()
      .then(dateRange => {
        var resYmds = {
          min: dateRange.min.serialize()
          , max: dateRange.max.serialize()
        };

        res.send(resYmds);
      });
  });

  app.get('/api/sources', (req, res) => {
    dalSourceInst.getAllSources()
      .then(lazySources => {
        var resSources = lazySources.map(aSource => aSource.serialize())
          .toArray();

        res.send(resSources);
      });
  });
};


//---------//
// Exports //
//---------//

module.exports = initApi;
