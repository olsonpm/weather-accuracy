'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var YMD = require('../models/extensions/ymd')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("YMD", function() {
    var constYMD
        , constSerializedYMD
        , constSerializedYMD_2;

    setup(function() {
        constYMD = YMD.createMockYmd();

        constSerializedYMD = {
            YMDid: '1'
            , Value: '20150101'
        };

        constSerializedYMD_2 = {
            YMDid: null
            , Value: '20150102'
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualYmd = new YMD(constSerializedYMD);
        assert.isTrue(actualYmd.equals(constYMD));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constYMD.serialize(), constSerializedYMD);
        assert.deepEqual(new YMD().Value('20150102').serialize(), constSerializedYMD_2);
    });
});
