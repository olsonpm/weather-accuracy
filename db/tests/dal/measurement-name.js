'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , MeasurementName = require('../../models/extensions/measurement-name')
    , Unit = require('../../models/extensions/unit')
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

suite("DALMeasurementName", function() {
    var dalMeasurementNameInst = new DALMeasurementName(devConf.GeneratePGWrapper());
    var CONST_MEASUREMENT_NAMES = [
        new MeasurementName().MeasurementNameID('1').Value('high_temperature').Unit(new Unit().UnitID('1'))
        , new MeasurementName().MeasurementNameID('2').Value('low_temperature').Unit(new Unit().UnitID('1'))
        , new MeasurementName().MeasurementNameID('3').Value('mean_wind_speed').Unit(new Unit().UnitID('2'))
        , new MeasurementName().Value('mean_temperature').Unit(new Unit().UnitID('1'))
    ];

    test("getAllMeasurementNames", function getAllMeasurementNames() {
        return dalMeasurementNameInst.getAllMeasurementNames()
            .then(function(lazyMeasurementNames) {
                var measurementNameArray = lazyMeasurementNames.toArray();
                for (var i = 0; i < 3; i++) {
                    assert.strictEqual(measurementNameArray[i].MeasurementNameID(), CONST_MEASUREMENT_NAMES[i].MeasurementNameID());
                    assert.strictEqual(measurementNameArray[i].Value(), CONST_MEASUREMENT_NAMES[i].Value());
                    assert.strictEqual(measurementNameArray[i].Unit().UnitID(), CONST_MEASUREMENT_NAMES[i].Unit().UnitID());
                }
            });
    });

    test("getMeasurementNameFromID", function getMeasurementNameFromID() {
        var bMeasurementNames = [];

        for (var i = 0; i < 3; i++) {
            bMeasurementNames.push(
                bPromise.join(
                    dalMeasurementNameInst.getMeasurementNameFromID(CONST_MEASUREMENT_NAMES[i].MeasurementNameID())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].MeasurementNameID(), CONST_MEASUREMENT_NAMES[res[1]].MeasurementNameID());
                    assert.strictEqual(res[0].Value(), CONST_MEASUREMENT_NAMES[res[1]].Value());
                    assert.strictEqual(res[0].Unit().UnitID(), CONST_MEASUREMENT_NAMES[res[1]].Unit().UnitID());
                })
            );
        }

        return bPromise.all(bMeasurementNames);
    });

    test("getMeasurementNameFromValue", function getMeasurementNameFromValue() {
        var bMeasurementNames = [];

        for (var i = 0; i < 3; i++) {
            bMeasurementNames.push(
                bPromise.join(
                    dalMeasurementNameInst.getMeasurementNameFromValue(CONST_MEASUREMENT_NAMES[i].Value())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].MeasurementNameID(), CONST_MEASUREMENT_NAMES[res[1]].MeasurementNameID());
                    assert.strictEqual(res[0].Value(), CONST_MEASUREMENT_NAMES[res[1]].Value());
                    assert.strictEqual(res[0].Unit().UnitID(), CONST_MEASUREMENT_NAMES[res[1]].Unit().UnitID());
                })
            );
        }

        return bPromise.all(bMeasurementNames);
    });

    test("insert", function insert() {
        return dalMeasurementNameInst.insert(CONST_MEASUREMENT_NAMES[3])
            .then(function(aMeasurementName) {
                assert.isAbove(aMeasurementName.MeasurementNameID(), 3);
            });
    });

    test("deleteByValue", function deleteByValue() {
        return dalMeasurementNameInst.deleteByValue(CONST_MEASUREMENT_NAMES[3].Value(), true);
    });

    test("deleteByID", function deleteByID() {
        return dalMeasurementNameInst.insert(CONST_MEASUREMENT_NAMES[3])
            .then(function(aMeasurementName) {
                return dalMeasurementNameInst.deleteByID(aMeasurementName.MeasurementNameID(), true);
            });
    });

});
