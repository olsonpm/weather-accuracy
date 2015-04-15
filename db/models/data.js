'use strict';

//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , Type = require('./type')
    , Source = require('./source')
    , YMD = require('./ymd')
    , Location = require('./location');


//------//
// Init //
//------//

var Utils = nh.utils;


//---------------------------------------------------------------------------------//
// MODEL
//---------------------------------------------------------------------------------//
//
// Front-end accessible
//   - Type
//   - Source
//   - YMD
//   - Location
//
//---------------------------------------------------------------------------------//

function Data(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        DataID: null
        , Type: null
        , Source: null
        , YMD: null
        , Location: null
    };

    self.DataID = function(dataid_) {
        var res = my.DataID;
        if (arguments.length > 0) {
            if (dataid_ !== null) {
                Data.ValidateDataID(dataid_, true);
            }
            my.DataID = dataid_;
            res = self;
        }
        return res;
    };

    self.Type = function(type_) {
        var res = my.Type;
        if (arguments.length > 0) {
            if (type_ !== null) {
                Data.ValidateType(type_, true);
            }
            my.Type = type_;
            res = self;
        }
        return res;
    };

    self.Source = function(source_) {
        var res = my.Source;
        if (arguments.length > 0) {
            if (source_ !== null) {
                Data.ValidateSource(source_, true);
            }
            my.Source = source_;
            res = self;
        }
        return res;
    };

    self.YMD = function(ymd_) {
        var res = my.YMD;
        if (arguments.length > 0) {
            if (ymd_ !== null) {
                Data.ValidateYMD(ymd_, true);
            }
            my.YMD = ymd_;
            res = self;
        }
        return res;
    };

    self.Location = function(location_) {
        var res = my.Location;
        if (arguments.length > 0) {
            if (location_ !== null) {
                Data.ValidateLocation(location_, true);
            }
            my.Location = location_;
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

Data.ValidateDataID = function ValidateDataID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Data>.ValidateDataID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Data.ValidateType = function ValidateType(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, Type)) {
        msg = 'Invalid Argument: <Data>.ValidateType requires an instance_of Type';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Data.ValidateSource = function ValidateSource(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, Source)) {
        msg = 'Invalid Argument: <Data>.ValidateSource requires an instance_of Source';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Data.ValidateYMD = function ValidateYMD(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, YMD)) {
        msg = 'Invalid Argument: <Data>.ValidateYMD requires an instance_of YMD';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Data.ValidateLocation = function ValidateLocation(input_, throwErr_) {
    var msg = '';
    if (!Utils.instance_of(input_, Location)) {
        msg = 'Invalid Argument: <Data>.ValidateLocation requires an instance_of Location';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//--------//
// Unique //
//--------//

Data.prototype.Key = function Key() {
    return ''
        + this.Type().Key()
        + this.Source().Key()
        + this.YMD().Key()
        + this.Location().Key();
};


//--------//
// Equals //
//--------//

Data.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Data) && Utils.instance_of(right, Data))) {
        throw new Error("Source.equals requires both arguments to be instance_of Data");
    }

    return left.DataID() === right.DataID()
        && Utils.bothNullOrEquals(left.Type(), right.Type(), Type.equals)
        && Utils.bothNullOrEquals(left.Source(), right.Source(), Source.equals)
        && Utils.bothNullOrEquals(left.YMD(), right.YMD(), YMD.equals)
        && Utils.bothNullOrEquals(left.Location(), right.Location(), Location.equals);
};

Data.prototype.equals = function equals(other) {
    return Data.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

Data.prototype.serialize = function serialize() {
    return {
        DataID: this.DataID()
        , Type: this.Type().serialize()
        , Source: this.Source().serialize()
        , YMD: this.YMD().serialize()
        , Location: this.Location().serialize()
    };
};


//----------//
// toString //
//----------//

Data.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "Data \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  DataID: " + this.DataID().toString(indentLevel) + "\n"
        + indent + "  Type: " + this.Type().toString(indentLevel)
        + indent + "  Source: " + this.Source().toString(indentLevel)
        + indent + "  YMD: " + this.YMD().toString(indentLevel)
        + indent + "  Location: " + this.Location().toString(indentLevel);
};


//---------//
// Exports //
//---------//

module.exports = Data;
