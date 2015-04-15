'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , DataPoint = require('../data-point')
    , Data = require('./data')
    , MeasurementName = require('./measurement-name');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

DataPoint.ValidateConvertedValue = function ValidateConvertedValue(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <DataPoint>.ValidateConvertedValue requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

DataPoint.ValidateConvertedUnit = function ValidateConvertedUnit(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <DataPoint>.ValidateConvertedUnit requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

DataPoint.deserialize = function deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: the DataPoint constructor requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: the DataPoint constructor requires jsonData to either be undefined, or a json object whose enumerable keys match Data's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        switch (aKey) {
            case 'Data':
                self.Data(new Data(jsonData[aKey]));
                break;
            case 'MeasurementName':
                self.MeasurementName(new MeasurementName(jsonData[aKey]));
                break;
            default:
                self[aKey](jsonData[aKey]);
                break;
        }
    });
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DataPoint.prototype.ConvertedValue = function ConvertedValue(convertedvalue_) {
    var my = this._my;

    var res = (typeof my.ConvertedValue === 'undefined')
        ? null
        : my.ConvertedValue;

    if (typeof convertedvalue_ !== 'undefined') {
        if (convertedvalue_ !== null) {
            DataPoint.ValidateConvertedValue(convertedvalue_, true);
        }
        my.ConvertedValue = convertedvalue_;
        res = this;
    }
    return res;
};

DataPoint.prototype.ConvertedUnit = function ConvertedUnit(convertedunit_) {
    var my = this._my;

    var res = (typeof my.ConvertedUnit === 'undefined')
        ? null
        : my.ConvertedUnit;

    if (typeof convertedunit_ !== 'undefined') {
        if (convertedunit_ !== null) {
            DataPoint.ValidateConvertedUnit(convertedunit_, true);
        }
        my.ConvertedUnit = convertedunit_;
        res = this;
    }
    return res;
};

DataPoint.prototype.CurrentValue = function CurrentValue() {
    if (arguments.length > 0) {
        throw new Error('Invalid Call: <DataPoint>.Data is read-only');
    }
    return this.ConvertedValue() || this.Value();
};

DataPoint.prototype.CurrentUnit = function CurrentUnit() {
    if (arguments.length > 0) {
        throw new Error('Invalid Call: <DataPoint>.Unit is read-only');
    }
    return this.ConvertedUnit() || this.MeasurementName().Unit().Name();
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

DataPoint.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <DataPoint>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <DataPoint>._deserialize requires jsonData to be an object whose enumerable keys match DataPoint's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        switch (aKey) {
            case 'Data':
                self.Data(new Data(jsonData[aKey]));
                break;
            case 'MeasurementName':
                self.MeasurementName(new MeasurementName(jsonData[aKey]));
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

function createMockDataPoint(aData, aMeasurementName) {
    return new DataPoint()
        .DataPointID('1')
        .Value('10')
        .Data(aData)
        .MeasurementName(aMeasurementName);
}


//---------//
// Exports //
//---------//

module.exports = DataPoint;
module.exports.createMockDataPoint = createMockDataPoint;
