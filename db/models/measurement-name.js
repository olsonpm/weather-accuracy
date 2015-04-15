'use strict';

//---------//
// Import //
//---------//

var nh = require('node-helpers')
    , Unit = require('./unit');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//---------------------------------------------------------------------------------//
// MODEL
//---------------------------------------------------------------------------------//
//
// Front-end accessible
//   - Unit
//   - Value
//
//---------------------------------------------------------------------------------//

function MeasurementName(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        MeasurementNameID: null
        , Unit: null
        , Value: null
    };

    self.MeasurementNameID = function(measurementnameid_) {
        var res = my.MeasurementNameID;
        if (arguments.length > 0) {
            if (measurementnameid_ !== null) {
                MeasurementName.ValidateMeasurementNameID(measurementnameid_, true);
            }
            my.MeasurementNameID = measurementnameid_;
            res = self;
        }
        return res;
    };

    self.Unit = function(unit_) {
        var res = my.Unit;
        if (arguments.length > 0) {
            if (unit_ !== null) {
                MeasurementName.ValidateUnit(unit_, true);
            }
            my.Unit = unit_;
            res = self;
        }
        return res;
    };

    self.Value = function(value_) {
        var res = my.Value;
        if (arguments.length > 0) {
            if (value_ !== null) {
                MeasurementName.ValidateValue(value_, true);
            }
            my.Value = value_;
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

MeasurementName.ValidateMeasurementNameID = function ValidateMeasurementNameID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <MeasurementName>.ValidateMeasurementNameID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

MeasurementName.ValidateUnit = function ValidateUnit(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, Unit)) {
        msg = 'Invalid Argument: <MeasurementName>.ValidateUnit requires an instance_of Unit';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

MeasurementName.ValidateValue = function ValidateValue(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <MeasurementName>.Value requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----//
// Key //
//-----//

MeasurementName.prototype.Key = function Key() {
    return ''
        + this.ValidateValue();
};


//--------//
// Equals //
//--------//

MeasurementName.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, MeasurementName) && Utils.instance_of(right, MeasurementName))) {
        throw new Error("MeasurementName.equals requires both arguments to be instance_of MeasurementName");
    }

    return left.MeasurementNameID() === right.MeasurementNameID()
        && left.Value() === right.Value()
        && Utils.bothNullOrEquals(left.Unit(), right.Unit(), Unit.equals);
};

MeasurementName.prototype.equals = function equals(other) {
    return MeasurementName.equals(this, other);
};


//----------//
// toString //
//----------//

MeasurementName.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "MeasurementName \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  MeasurementNameID: " + this.MeasurementNameID() + "\n"
        + indent + "  Value: " + this.Value() + "\n"
        + indent + "  Unit: " + this.Unit().toString(indentLevel);
};


//-----------//
// Serialize //
//-----------//

MeasurementName.prototype.serialize = function serialize() {
    return {
        MeasurementNameID: this.MeasurementNameID()
        , Value: this.Value()
        , Unit: this.Unit().serialize()
    };
};


//----------//
// toString //
//----------//

MeasurementName.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "MeasurementName \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  MeasurementNameID: " + this.MeasurementNameID() + "\n"
        + indent + "  Value: " + this.Value() + "\n"; + indent + "  Unit: " + this.Unit().toString(indentLevel)
};


//---------//
// Exports //
//---------//

module.exports = MeasurementName;
