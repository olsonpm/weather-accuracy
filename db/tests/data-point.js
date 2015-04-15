'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var DataPoint = require('../models/extensions/data-point')
    , Data = require('../models/extensions/data')
    , MeasurementName = require('../models/extensions/measurement-name')
    , Type = require('../models/extensions/type')
    , Source = require('../models/extensions/source')
    , YMD = require('../models/extensions/ymd')
    , Location = require('../models/extensions/location')
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

suite("DataPoint", function() {
    var constDataPoint
        , constSerializedDataPoint;

    setup(function() {
        var mockData = Data.createMockData(
            Type.createMockType()
            , Source.createMockSource()
            , YMD.createMockYmd()
            , Location.createMockLocation()
        );
        var mockMeasurementName = MeasurementName.createMockMeasurementName(
            Unit.createMockUnit()
        );
        constDataPoint = DataPoint.createMockDataPoint(mockData, mockMeasurementName);

        constSerializedDataPoint = {
            DataPointID: '1'
            , Value: '10'
            , Data: mockData.serialize()
            , MeasurementName: mockMeasurementName.serialize()
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualDataPoint = new DataPoint(constSerializedDataPoint);
        assert.isTrue(actualDataPoint.equals(constDataPoint));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constDataPoint.serialize(), constSerializedDataPoint);
    });
});
