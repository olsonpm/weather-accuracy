'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , DataPoint = require('../../models/extensions/data-point')
    , Data = require('../../models/extensions/data')
    , MeasurementName = require('../../models/extensions/measurement-name')
    , Unit = require('../../models/extensions/unit')
    , DALDataPoint = require('../../models/dal/data-point')
    , DALMeasurementName = require('../../models/dal/measurement-name')
    , bPromise = require('bluebird')
    , devConf = require('../../../utils/pg-confs').dev;


//------//
// Init //
//------//

var assert = chai.assert;

bPromise.longStackTraces();
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("DALDataPoint", function() {
    var pgWrapperInst = devConf.GeneratePGWrapper();
    var dalDataPointInst = new DALDataPoint(pgWrapperInst);
    var dalMeasurementNameInst = new DALMeasurementName(pgWrapperInst);

    var CONST_DATA_POINTS = [
        new DataPoint().DataPointID('1').Data(new Data().DataID('1')).Value('11').MeasurementName(new MeasurementName().MeasurementNameID('1'))
        , new DataPoint().DataPointID('2').Data(new Data().DataID('1')).Value('4').MeasurementName(new MeasurementName().MeasurementNameID('2'))
        , new DataPoint().DataPointID('3').Data(new Data().DataID('1')).Value('14').MeasurementName(new MeasurementName().MeasurementNameID('3'))
        , new DataPoint().Data(new Data().DataID('1')).Value('10')
    ];

    var CONST_MEASUREMENT_NAME = new MeasurementName().Value('mean_temperature').Unit(new Unit().UnitID('1'));

    test("getDataPointsBetweenDates", function getDataPointsBetweenDates() {
        return dalDataPointInst.getDataPointsBetweenDates('20150101', '20150106')
            .then(function(lazyData) {
                assert.strictEqual(lazyData.length(), 972);
            });
    });

    test("getDataPointFromID", function getDataPointFromID() {
        var bDataPoints = [];

        for (var i = 0; i < 3; i++) {
            bDataPoints.push(
                bPromise.join(
                    dalDataPointInst.getDataPointFromID(CONST_DATA_POINTS[i].DataPointID())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].DataPointID(), CONST_DATA_POINTS[res[1]].DataPointID());
                    assert.strictEqual(res[0].Data().DataID(), CONST_DATA_POINTS[res[1]].Data().DataID());
                    assert.strictEqual(res[0].Value(), CONST_DATA_POINTS[res[1]].Value());
                    assert.strictEqual(res[0].MeasurementName().MeasurementNameID(), CONST_DATA_POINTS[res[1]].MeasurementName().MeasurementNameID());
                })
            );
        }

        return bPromise.all(bDataPoints);
    });

    test("insert then deleteByID", function insert_then_deleteByID() {
        return dalMeasurementNameInst.insert(CONST_MEASUREMENT_NAME)
            .then(function(aMeasurementName) {
                return dalDataPointInst.insert(CONST_DATA_POINTS[3].MeasurementName(aMeasurementName));
            })
            .then(function(aDataPoint) {
                assert.isAbove(aDataPoint.DataPointID(), 972);
                return dalDataPointInst.deleteByID(aDataPoint.DataPointID());
            })
            .then(function() {
                return dalMeasurementNameInst.deleteByID(CONST_MEASUREMENT_NAME.MeasurementNameID());
            });
    });

});
