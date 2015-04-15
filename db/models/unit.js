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

function Unit(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        UnitID: null
        , Name: null
    };

    self.UnitID = function(unitid_) {
        var res = my.UnitID;
        if (arguments.length > 0) {
            if (unitid_ !== null) {
                Unit.ValidateUnitID(unitid_, true);
            }
            my.UnitID = unitid_;
            res = self;
        }
        return res;
    };

    self.Name = function(name_) {
        var res = my.Name;
        if (arguments.length > 0) {
            if (name_ !== null) {
                Unit.ValidateName(name_, true);
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

Unit.ValidateUnitID = function ValidateUnitID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Unit>.ValidateUnitID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Unit.ValidateName = function ValidateName(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Unit>.ValidateName requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----//
// Key //
//-----//

Unit.prototype.Key = function Key() {
    return ''
        + this.Name();
};


//--------//
// Equals //
//--------//

Unit.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Unit) && Utils.instance_of(right, Unit))) {
        throw new Error("Source.equals requires both arguments to be instance_of Unit");
    }

    return left.UnitID() === right.UnitID()
        && left.Name() === right.Name();
};

Unit.prototype.equals = function equals(other) {
    return Unit.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

Unit.prototype.serialize = function serialize() {
    return {
        UnitID: this.UnitID()
        , Name: this.Name()
    };
};


//----------//
// toString //
//----------//

Unit.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "Unit \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  UnitID: " + this.UnitID() + "\n"
        + indent + "  Name: " + this.Name() + "\n";
};


//---------//
// Exports //
//---------//

module.exports = Unit;
