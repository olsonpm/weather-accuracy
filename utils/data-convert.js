'use strict';

//----------//
// Comments //
//----------//

/*
 * I've not yet decided on where I draw the line for performance vs error checking.  I much prefer type-safe languages, so I'm going to leave in
 *   the error checking for now.  It would be trivial to set a configuration variable or even skip validation dependent on the environment
 *   being run in (dev/test/prod).
 */


//---------//
// Imports //
//---------//

var DataPoint = require('../models/extensions/data-point')
    , nh = require('node-helpers')
    , roundn = require('compute-roundn');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//------//
// Main //
//------//

data_convert = {};

data_convert.kmph_to_mph = function kmph_to_mph(dataPoints) {
    var errStr = "Invalid Argument: data_convert.kmph_to_mph requires ";
    if (!Utils.instance_of(dataPoints, lazy.Sequence)) {
        throw new Error(errStr + "an instance_of lazy.Sequence");
    } else if (!dataPoints.allInstanceOf(DataPoint)) {
        throw new Error(errStr + " all members to be instance_of DataPoint");
    } else if (!dataPoints.all(function(dp) {
            return dp.OriginalUnit() === DataPoint.UnitsEnum.KMPH;
        })) {
        throw new Error(errStr + " all members to have Unit equal to DataPoint.UnitsEnum.KMPH");
    } else if (!dataPoints.all(function(dp) {
                return typeof dp.OriginalData() === 'number');
        })) {
    throw new Error(errStr + " all members to have Data be instance_of Number");
}

return dataPoints.each(function(dp) {
    return dp
        .ConvertedUnit(DataPoint.UnitsEnum.MPH)
        .ConvertedData(roundn((dp.OriginalData() * 1.609344), 0));
});
};

data_convert.celsius_to_fahrenheit = function celsius_to_fahrenheit(dataPoints) {
    var errStr = "Invalid Argument: data_convert.celsius_to_fahrenheit requires ";
    if (!Utils.instance_of(dataPoints, lazy.Sequence)) {
        throw new Error(errStr + "an instance_of lazy.Sequence");
    } else if (!dataPoints.allInstanceOf(DataPoint)) {
        throw new Error(errStr + " all members to be instance_of DataPoint");
    } else if (!dataPoints.all(function(dp) {
            return dp.OriginalUnit() === DataPoint.UnitsEnum.CELSIUS;
        })) {
        throw new Error(errStr + " all members to have Unit equal to DataPoint.UnitsEnum.CELSIUS");
    } else if (!dataPoints.all(function(dp) {
                return typeof dp.OriginalData() === 'number');
        })) {
    throw new Error(errStr + " all members to have Data be instance_of Number");
}

return dataPoints.each(function(dp) {
    return dp
        .ConvertedUnit(DataPoint.UnitsEnum.FAHRENHEIT)
        .ConvertedData(roundn(((dp.OriginalData() * (9 / 5)) + 32), 0));
});
};


//---------//
// Exports //
//---------//

module.exports = data_convert;
