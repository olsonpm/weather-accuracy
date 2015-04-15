'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var Type = require('../models/extensions/type')
    , chai = require('chai');


//------//
// Init //
//------//

var assert = chai.assert;
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("Type", function() {
    var constType
        , constSerializedType;

    setup(function() {
        constType = Type.createMockType();

        constSerializedType = {
            TypeID: '1'
            , Name: Type.NAMES.ACTUAL
        };
    });
    test("construct_from_json", function construct_from_json() {
        var actualType = new Type(constSerializedType);
        assert.isTrue(actualType.equals(constType));
    });
    test("serialize", function serialize() {
        assert.deepEqual(constType.serialize(), constSerializedType);
    });
});
