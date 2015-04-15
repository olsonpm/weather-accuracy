'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers');


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
//   - Name
//
//---------------------------------------------------------------------------------//

function Source(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        SourceID: null
        , Name: null
    };

    self.SourceID = function(sourceid_) {
        var res = my.SourceID;
        if (arguments.length > 0) {
            if (sourceid_ !== null) {
                Source.ValidateSourceID(sourceid_, true);
            }
            my.SourceID = sourceid_;
            res = self;
        }
        return res;
    };

    self.Name = function(name_) {
        var res = my.Name;
        if (arguments.length > 0) {
            if (name_ !== null) {
                Source.ValidateName(name_, true);
            }
            my.Name = name_;
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

Source.ValidateSourceID = function ValidateSourceID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Source>.ValidateSourceID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Source.ValidateName = function ValidateName(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Source>.ValidateName requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----//
// Key //
//-----//

Source.prototype.Key = function Key() {
    return ''
        + this.Name();
};


//--------//
// Equals //
//--------//

Source.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Source) && Utils.instance_of(right, Source))) {
        throw new Error("Source.equals requires both arguments to be instance_of Source");
    }

    return left.SourceID() === right.SourceID()
        && left.Name() === right.Name();
};

Source.prototype.equals = function equals(other) {
    return Source.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

Source.prototype.serialize = function serialize() {
    return {
        SourceID: this.SourceID()
        , Name: this.Name()
    };
};


//----------//
// toString //
//----------//

Source.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "Source \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  SourceID: " + this.SourceID() + "\n"
        + indent + "  Name: " + this.Name() + "\n";
};


//---------//
// Exports //
//---------//

module.exports = Source;
