'use strict';


//--------//
// Import //
//--------//

var nh = require('node-helpers')
    , YMD = require('../ymd')
    , moment = require('moment');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------------//
// Static Extensions //
//-------------------//

YMD.getMoment = function static_getMoment(aYmd) {
    YMD.ValidateValue(aYmd, true);

    return moment(aYmd, 'YYYYMMDD');
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

YMD.prototype.getMoment = function getMoment() {
    if (!this._moment) {
        this._moment = moment(this.Value(), 'YYYYMMDD');
    }

    return this._moment;
};


//-------------------------------//
// Private Prototyped Extensions //
//-------------------------------//

YMD.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <YMD>._deserialize requires jsonData to be an instance_of Object");
    }

    var allKeysMatch = lazy(Object.keys(jsonData))
        .every(function(aKey) {
            return Utils.in_array(aKey, Object.keys(my));
        });

    if (!allKeysMatch) {
        throw new Error("Invalid Argument: <YMD>._deserialize requires jsonData to be an object whose enumerable keys match YMD's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//------//
// Mock //
//------//

function createMockYmd() {
    return new YMD()
        .YMDid('1')
        .Value('20150101');
}

//---------//
// Exports //
//---------//

module.exports = YMD;
module.exports.createMockYmd = createMockYmd;
