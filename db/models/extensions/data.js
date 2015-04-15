'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , Data = require('../data')
    , Type = require('./type')
    , Source = require('./source')
    , YMD = require('./ymd')
    , Location = require('./location');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

Data.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Data>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <Data>._deserialize requires jsonData to be an object whose enumerable keys match Data's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        switch (aKey) {
            case 'Type':
                self.Type(new Type(jsonData[aKey]));
                break;
            case 'Source':
                self.Source(new Source(jsonData[aKey]));
                break;
            case 'YMD':
                self.YMD(new YMD(jsonData[aKey]));
                break;
            case 'Location':
                self.Location(new Location(jsonData[aKey]));
                break;
            default:
                self[aKey](jsonData[aKey]);
                break;
        }
    });
};


//------//
// Mock //
//------//

function createMockData(aType, aSource, aYmd, aLocation) {
    return new Data()
        .DataID('1')
        .Type(aType)
        .Source(aSource)
        .YMD(aYmd)
        .Location(aLocation);
}


//---------//
// Exports //
//---------//

module.exports = Data;
module.exports.createMockData = createMockData;
