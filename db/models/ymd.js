'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , moment = require('moment');


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
//   - Value
//
//---------------------------------------------------------------------------------//

function YMD(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        YMDid: null
        , Value: null
    };

    self.YMDid = function(ymdid_) {
        var res = my.YMDid;
        if (arguments.length > 0) {
            if (ymdid_ !== null) {
                YMD.ValidateYMDid(ymdid_, true);
            }
            my.YMDid = ymdid_;
            res = self;
        }
        return res;
    };

    self.Value = function(value_) {
        var res = my.Value;
        if (arguments.length > 0) {
            if (Utils.instance_of(value_, Date)) {
                value_ = moment(value_).format('YYYYMMDD');
            }

            if (value_ !== null) {
                YMD.ValidateValue(value_, true);
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

YMD.ValidateYMDid = function ValidateYMDid(input_, throwErr_) {
    var msg = '';

    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <YMD>.ValidateYMDid requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

YMD.ValidateValue = function ValidateValue(input, throwErr) {
    var msg = '';

    if (!(typeof input === 'string' && input.match(/^\d{8}$/) && moment(input, 'YYYYMMDD').isValid())) {
        msg = "Invalid Argument: <YMD>.ValidateValue requires a valid date in the format 'YYYYMMDD'";
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----//
// Key //
//-----//

YMD.prototype.Key = function Key() {
    return ''
        + this.Value();
};


//--------//
// Equals //
//--------//

YMD.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, YMD) && Utils.instance_of(right, YMD))) {
        throw new Error("Source.equals requires both arguments to be instance_of YMD");
    }

    return left.YMDid() === right.YMDid()
        && left.Value() === right.Value();
};

YMD.prototype.equals = function equals(other) {
    return YMD.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

YMD.prototype.serialize = function serialize() {
    return {
        YMDid: this.YMDid()
        , Value: this.Value()
    };
};


//----------//
// toString //
//----------//

YMD.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "YMD \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  YMDid: " + this.YMDid() + "\n"
        + indent + "  Value: " + this.Value() + "\n";
};


//---------//
// Exports //
//---------//

module.exports = YMD;
