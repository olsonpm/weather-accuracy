'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , Source = require('../source');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

// ideally these would be dynamically created via the database.  That is more work than it's worth for now though.
Source.NAMES = {
    WUNDERGROUND: 'weather_underground'
    , HAM: 'ham_weather'
    , FIO: 'forecast_io'
};

// also ideally the following would be database fields.  That would require a little more refactoring than it's worth
//   considering I don't have future plans for this project
Source.NICE = {};
Source.NICE[Source.NAMES.WUNDERGROUND] = 'Weather Underground';
Source.NICE[Source.NAMES.HAM] = 'Ham Weather';
Source.NICE[Source.NAMES.FIO] = 'Forecast IO';

Source.SHORT = {};
Source.SHORT[Source.NAMES.WUNDERGROUND] = 'WU';
Source.SHORT[Source.NAMES.HAM] = 'HW';
Source.SHORT[Source.NAMES.FIO] = 'FIO';


//-----------------------//
// Prototyped Extensions //
//-----------------------//

Source.prototype.NiceName = function NiceName() {
    return Source.NICE[this.Name()];
};
Source.prototype.ShortName = function ShortName() {
    return Source.SHORT[this.Name()];
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

Source.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Source>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <Source>._deserialize requires jsonData to be an object whose enumerable keys match Source's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//------//
// Mock //
//------//

function createMockSource() {
    return new Source()
        .SourceID('1')
        .Name(Source.NAMES.WUNDERGROUND);
}


//---------//
// Exports //
//---------//

module.exports = Source;
module.exports.createMockSource = createMockSource;
