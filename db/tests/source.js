'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var Source = require('../models/extensions/source')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("Source", function() {
    var constSource
        , constSerializedSource;

    setup(function() {
        constSource = Source.createMockSource();

        constSerializedSource = {
            SourceID: '1'
            , Name: Source.NAMES.WUNDERGROUND
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualSource = new Source(constSerializedSource);
        assert.isTrue(actualSource.equals(constSource));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constSource.serialize(), constSerializedSource);
    });
});
