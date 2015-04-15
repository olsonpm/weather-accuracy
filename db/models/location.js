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
//   - Latitude
//   - Longitude
//   - Name
//
//---------------------------------------------------------------------------------//

function Location(jsonData) {
    var self = this;

    this._my = {};
    var my = {
        LocationID: null
        , Latitude: null
        , Longitude: null
        , Name: null
        , TZ: null
    };

    self.LocationID = function(locationid_) {
        var res = my.LocationID;
        if (arguments.length > 0) {
            if (locationid_ !== null) {
                Location.ValidateLocationID(locationid_, true);
            }
            my.LocationID = locationid_;
            res = self;
        }
        return res;
    };

    self.Latitude = function(latitude_) {
        var res = my.Latitude;
        if (arguments.length > 0) {
            if (latitude_ !== null) {
                Location.ValidateLatitude(latitude_, true);
            }
            my.Latitude = latitude_;
            res = self;
        }
        return res;
    };

    self.Longitude = function(longitude_) {
        var res = my.Longitude;
        if (arguments.length > 0) {
            if (longitude_ !== null) {
                Location.ValidateLongitude(longitude_, true);
            }
            my.Longitude = longitude_;
            res = self;
        }
        return res;
    };

    self.Name = function(name_) {
        var res = my.Name;
        if (arguments.length > 0) {
            if (name_ !== null) {
                Location.ValidateName(name_, true);
            }
            my.Name = name_;
            res = self;
        }
        return res;
    };

    self.TZ = function(tz_) {
        var res = my.TZ;
        if (arguments.length > 0) {
            if (tz_ !== null) {
                Location.ValidateTZ(tz_, true);
            }
            my.TZ = tz_;
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

Location.ValidateLocationID = function ValidateLocationID(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Location>.LocationID requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Location.ValidateLatitude = function ValidateLatitude(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Location>.Latitude requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Location.ValidateLongitude = function ValidateLongitude(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Location>.Longitude requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Location.ValidateName = function ValidateName(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Location>.Name requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};

Location.ValidateTZ = function ValidateTZ(input_, throwErr_) {
    var msg = '';
    if (typeof input_ !== 'string') {
        msg = 'Invalid Argument: <Location>.TZ requires a typeof string argument';
    }

    if (throwErr_ && msg) {
        throw new Error(msg);
    }

    return msg;
};


//--------//
// Unique //
//--------//

Location.prototype.Key = function Key() {
    return ''
        + this.Latitude()
        + this.Longitude();
};


//--------//
// Equals //
//--------//

Location.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Location) && Utils.instance_of(right, Location))) {
        throw new Error("Source.equals requires both arguments to be instance_of Location");
    }

    return left.LocationID() === right.LocationID()
        && left.Latitude() === right.Latitude()
        && left.Longitude() === right.Longitude()
        && left.Name() === right.Name();
};

Location.prototype.equals = function equals(other) {
    return Location.equals(this, other);
};


//-----------//
// Serialize //
//-----------//

Location.prototype.serialize = function serialize() {
    return {
        LocationID: this.LocationID()
        , Latitude: this.Latitude()
        , Longitude: this.Longitude()
        , Name: this.Name()
        , TZ: this.TZ()
    };
};


//----------//
// toString //
//----------//

Location.prototype.toString = function toString(indentLevel) {
    indentLevel = indentLevel || 0;
    var header = (indentLevel === 0)
        ? "Location \n"
        : "\n";
    var indent = Utils.repeatString("  ", indentLevel++);

    return header
        + indent + "  LocationID: " + this.LocationID() + "\n"
        + indent + "  Name: " + this.Name() + "\n";
};


//---------//
// Exports //
//---------//

module.exports = Location;
