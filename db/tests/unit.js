'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var Unit = require('../models/extensions/unit')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("Unit", function() {
    var constUnit
        , constSerializedUnit;

    setup(function() {
        constUnit = Unit.createMockUnit();

        constSerializedUnit = {
            UnitID: '1'
            , Name: Unit.NAMES.CELSIUS
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualUnit = new Unit(constSerializedUnit);
        assert.isTrue(actualUnit.equals(constUnit));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constUnit.serialize(), constSerializedUnit);
    });
});
