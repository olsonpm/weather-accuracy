'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , Type = require('../type');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

Type.NAMES = {
    ACTUAL: 'actual'
    , FORECAST_DAY_1: 'forecast_1_day_out'
    , FORECAST_DAY_2: 'forecast_2_days_out'
    , FORECAST_DAY_3: 'forecast_3_days_out'
    , FORECAST_DAY_4: 'forecast_4_days_out'
    , FORECAST_DAY_5: 'forecast_5_days_out'
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

Type.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Type>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <Type>._deserialize requires jsonData to be an object whose enumerable keys match Type's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//------//
// Mock //
//------//

function createMockType() {
    return new Type()
        .TypeID('1')
        .Name(Type.NAMES.ACTUAL);
}


//---------//
// Exports //
//---------//

module.exports = Type;
module.exports.createMockType = createMockType;
