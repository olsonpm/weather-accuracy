'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , MeasurementName = require('../measurement-name')
    , Unit = require('./unit');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

MeasurementName.VALUES = {
    HIGH_TEMP: 'high_temperature'
    , LOW_TEMP: 'low_temperature'
    , MEAN_WIND_SPEED: 'mean_wind_speed'
};

MeasurementName.SYMBOLS = {
    METRIC_TEMP: '°C'
    , METRIC_WIND_SPEED: 'km/h'
};

MeasurementName.NICE = {};
MeasurementName.NICE[MeasurementName.VALUES.HIGH_TEMP] = 'high temperature';
MeasurementName.NICE[MeasurementName.VALUES.LOW_TEMP] = 'low temperature';
MeasurementName.NICE[MeasurementName.VALUES.MEAN_WIND_SPEED] = 'mean wind speed';

MeasurementName.SYMBOLS_PER_VALUE = {};
MeasurementName.SYMBOLS_PER_VALUE[MeasurementName.VALUES.HIGH_TEMP] = MeasurementName.SYMBOLS.METRIC_TEMP;
MeasurementName.SYMBOLS_PER_VALUE[MeasurementName.VALUES.LOW_TEMP] = MeasurementName.SYMBOLS.METRIC_TEMP;
MeasurementName.SYMBOLS_PER_VALUE[MeasurementName.VALUES.MEAN_WIND_SPEED] = MeasurementName.SYMBOLS.METRIC_WIND_SPEED;

//-----------------------//
// Prototyped Extensions //
//-----------------------//

MeasurementName.prototype.NiceValue = function NiceValue() {
    return MeasurementName.NICE[this.Value()];
};

MeasurementName.prototype.Symbol = function Symbol() {
    return MeasurementName.SYMBOLS_PER_VALUE[this.Value()];
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

MeasurementName.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <MeasurementName>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <MeasurementName>._deserialize requires jsonData to be an object whose enumerable keys match MeasurementName's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        switch (aKey) {
            case 'Unit':
                self.Unit(new Unit(jsonData[aKey]));
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

function createMockMeasurementName(aUnit) {
    return new MeasurementName()
        .MeasurementNameID('1')
        .Value(MeasurementName.VALUES.HIGH_TEMP)
        .Unit(aUnit);
}


//---------//
// Exports //
//---------//

module.exports = MeasurementName;
module.exports.createMockMeasurementName = createMockMeasurementName;
