'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , Unit = require('../unit');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

Unit.NAMES = {
    CELSIUS: 'celsius'
    , KPH: 'kilometers_per_hour'
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

Unit.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Unit>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <Unit>._deserialize requires jsonData to be an object whose enumerable keys match Unit's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//------//
// Mock //
//------//

function createMockUnit() {
    return new Unit()
        .UnitID('1')
        .Name(Unit.NAMES.CELSIUS);
}


//---------//
// Exports //
//---------//

module.exports = Unit;
module.exports.createMockUnit = createMockUnit;
