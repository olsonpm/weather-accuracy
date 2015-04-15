'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var MeasurementName = require('../models/extensions/measurement-name')
    , Unit = require('../models/extensions/unit')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("MeasurementName", function() {
    var constMeasurementName
        , constSerializedMeasurementName;

    setup(function() {
        var mockUnit = Unit.createMockUnit();
        constMeasurementName = MeasurementName.createMockMeasurementName(mockUnit);

        constSerializedMeasurementName = {
            MeasurementNameID: '1'
            , Value: MeasurementName.VALUES.HIGH_TEMP
            , Unit: mockUnit.serialize()
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualMeasurementName = new MeasurementName(constSerializedMeasurementName);
        assert.isTrue(actualMeasurementName.equals(constMeasurementName));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constMeasurementName.serialize(), constSerializedMeasurementName);
    });
});
