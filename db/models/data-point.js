'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , Data = require('./data')
    , MeasurementName = require('./measurement-name');


//------//
// Init //
//------//

var Utils = nh.utils;


//---------------------------------------------------------------------------------//
// MODEL
//---------------------------------------------------------------------------------//
//
// Front-end accessible
//   - Data
//   - Value
//   - MeasurementName
//
//---------------------------------------------------------------------------------//

function DataPoint(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        DataPointID: null
        , Data: null
        , Value: null
        , MeasurementName: null
    };

    self.DataPointID = function(datapointid_) {
        var res = my.DataPointID;
        if (arguments.length > 0) {
            if (datapointid_ !== null) {
                DataPoint.ValidateDataPointID(datapointid_, true);
            }
            my.DataPointID = datapointid_;
            res = self;
        }
        return res;
    };

    self.Data = function(data_) {
        var res = my.Data;
        if (arguments.length > 0) {
            if (data_ !== null) {
                DataPoint.ValidateData(data_, true);
            }
            my.Data = data_;
            res = self;
        }
        return res;
    };

    self.Value = function(value_) {
        var res = my.Value;
        if (arguments.length > 0) {
            if (value_ !== null) {
                DataPoint.ValidateValue(value_, true);
            }
            my.Value = value_;
            res = self;
        }
        return res;
    };

    self.MeasurementName = function(measurementname_) {
        var res = my.MeasurementName;
        if (arguments.length > 0) {
            if (measurementname_ !== null) {
                DataPoint.ValidateMeasurementName(measurementname_, true);
            }
            my.MeasurementName = measurementname_;
            res = self;
        }
        return res;
    };

    if (typeof jsonData !== 'undefined') {
        if (typeof this._deserialize === 'undefined') {
            throw new Error("Invalid State: this._deserialize doesn't exist.  Make sure you are loading this model via its extension");
        }

        this._deserialize(jsonData, my);
    }
}


//------------//
// Validation //
//------------//

DataPoint.ValidateDataPointID = function ValidateDataPointID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <DataPoint>.ValidateDataPointID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

DataPoint.ValidateData = function ValidateData(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, Data)) {
        msg = 'Invalid Argument: <DataPoint>.ValidateData requires an instance_of Data';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

DataPoint.ValidateValue = function ValidateValue(input_, throwErr_) {
    if (Utils.isNumeric(input_)) {
        input_ = '' + input_;
    }

    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <DataPoint>.ValidateValue requires a typeof string or isNumeric argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

DataPoint.ValidateMeasurementName = function ValidateMeasurementName(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, MeasurementName)) {
        msg = 'Invalid Argument: <DataPoint>.ValidateMeasurementName requires an instance_of MeasurementName';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//--------//
// Unique //
//--------//

DataPoint.prototype.Key = function Key() {
    return ''
        + this.Data().Key()
        + this.MeasurementName().Key();
};


//--------//
// Equals //
//--------//

DataPoint.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, DataPoint) && Utils.instance_of(right, DataPoint))) {
        throw new Error("Source.equals requires both arguments to be instance_of DataPoint");
    }

    return left.DataPointID() === right.DataPointID()
        && Utils.bothNullOrEquals(left.Data(), right.Data(), Data.equals)
        && left.Value() === right.Value()
        && Utils.bothNullOrEquals(left.MeasurementName(), right.MeasurementName(), MeasurementName.equals);
};

DataPoint.prototype.equals = function equals(other) {
    return DataPoint.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

DataPoint.prototype.serialize = function serialize() {
    return {
        DataPointID: this.DataPointID()
        , Value: this.Value()
        , Data: this.Data().serialize()
        , MeasurementName: this.MeasurementName().serialize()
    };
};


//----------//
// toString //
//----------//

DataPoint.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "DataPoint \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  DataPointID: " + this.DataPointID() + "\n"
        + indent + "  Value: " + this.Value() + "\n"
        + indent + "  Data: " + this.Data().toString(indentLevel)
        + indent + "  MeasurementName: " + this.MeasurementName().toString(indentLevel);
};


//---------//
// Exports //
//---------//

module.exports = DataPoint;
