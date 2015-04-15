'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , Location = require('../location');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

Location.NAMES = {
    RICHMOND: "Richmond, CA"
    , CHICAGO: "Chicago, IL"
    , NEW_YORK: "New York, NY"
};

Location.TZ = {
    LOS_ANGELES: "America/Los_Angeles"
    , CHICAGO: "America/Chicago"
    , NEW_YORK: "America/New_York"
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

Location.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Location>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <Location>._deserialize requires jsonData to be an object whose enumerable keys match Location's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//------//
// Mock //
//------//

function createMockLocation() {
    return new Location()
        .LocationID('1')
        .Name(Location.NAMES.RICHMOND)
        .Latitude('37.935758')
        .Longitude('-122.347749')
        .TZ(Location.TZ.LOS_ANGELES);
}


//---------//
// Exports //
//---------//

module.exports = Location;
module.exports.createMockLocation = createMockLocation;
