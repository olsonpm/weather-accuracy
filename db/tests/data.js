'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var Data = require('../models/extensions/data')
    , Type = require('../models/extensions/type')
    , Source = require('../models/extensions/source')
    , YMD = require('../models/extensions/ymd')
    , Location = require('../models/extensions/location')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("Data", function() {
    var constData
        , constSerializedData;

    setup(function() {
        var mockType = Type.createMockType();
        var mockSource = Source.createMockSource();
        var mockYmd = YMD.createMockYmd();
        var mockLocation = Location.createMockLocation();

        constData = Data.createMockData(
            mockType
            , mockSource
            , mockYmd
            , mockLocation
        );

        constSerializedData = {
            DataID: '1'
            , Type: mockType.serialize()
            , Source: mockSource.serialize()
            , YMD: mockYmd.serialize()
            , Location: mockLocation.serialize()
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualData = new Data(constSerializedData);
        assert.isTrue(actualData.equals(constData));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constData.serialize(), constSerializedData);
    });
});
