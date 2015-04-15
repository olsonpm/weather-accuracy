'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var Location = require('../models/extensions/location')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("Location", function() {
    var constLocation
        , constSerializedLocation;

    setup(function() {
        constLocation = Location.createMockLocation();

        constSerializedLocation = {
            LocationID: '1'
            , Name: Location.NAMES.RICHMOND
            , Latitude: '37.935758'
            , Longitude: '-122.347749'
            , TZ: Location.TZ.LOS_ANGELES
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualLocation = new Location(constSerializedLocation);
        assert.isTrue(actualLocation.equals(constLocation));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constLocation.serialize(), constSerializedLocation);
    });
});
