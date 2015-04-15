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

function Type(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        TypeID: null
        , Name: null
    };

    self.TypeID = function(typeid_) {
        var res = my.TypeID;
        if (arguments.length > 0) {
            if (typeid_ !== null) {
                Type.ValidateTypeID(typeid_, true);
            }
            my.TypeID = typeid_;
            res = self;
        }
        return res;
    };

    self.Name = function(name_) {
        var res = my.Name;
        if (arguments.length > 0) {
            if (name_ !== null) {
                Type.ValidateName(name_, true);
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

Type.ValidateTypeID = function ValidateTypeID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Type>.ValidateTypeID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Type.ValidateName = function ValidateName(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Type>.ValidateName requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----//
// Key //
//-----//

Type.prototype.Key = function Key() {
    return ''
        + this.Name();
};


//--------//
// Equals //
//--------//

Type.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Type) && Utils.instance_of(right, Type))) {
        throw new Error("Source.equals requires both arguments to be instance_of Type");
    }

    return left.TypeID() === right.TypeID()
        && left.Name() === right.Name();
};

Type.prototype.equals = function equals(other) {
    return Type.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

Type.prototype.serialize = function serialize() {
    return {
        TypeID: this.TypeID()
        , Name: this.Name()
    };
};


//----------//
// toString //
//----------//

Type.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "Type \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  TypeID: " + this.TypeID() + "\n"
        + indent + "  Name: " + this.Name() + "\n";
};


//---------//
// Exports //
//---------//

module.exports = Type;
