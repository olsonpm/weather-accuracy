'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , moment = require('moment')
    , bPromise = require('bluebird')
    , YMD = require('../db/models/extensions/ymd')
    , DALymd = require('../db/models/dal/ymd');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils;


//------//
// Main //
//------//

function insertDates(curPGWrapper) {
    if (!Utils.instance_of(curPGWrapper, PGWrapper)) {
        throw new Error('Invalid Argument: insertDate expects instance_of PGWrapper');
    }

    var dalYmdInst = new DALymd(curPGWrapper);
    var initialMoment = moment(0, 'H').subtract(1, 'day');
    return dalYmdInst.getYmdsFromDate(initialMoment.format('YYYYMMDD'))
        .then(function(lazyDates) {
            var bDates = [];
            lazyDates = lazyDates.map(function(aYmd) {
                return aYmd.Value();
            });

            for (var i = 0; i < 8; i++) {
                if (i === 1) {
                    initialMoment.add(1, 'day');
                    continue;
                }
                var tmpDate = initialMoment.format('YYYYMMDD');
                if (!lazyDates.contains(tmpDate)) {
                    bDates.push(
                        dalYmdInst.insert(new YMD().Value(tmpDate))
                    );
                }
                initialMoment.add(1, 'day');
            }

            var res;
            if (bDates.length > 0) {
                res = bPromise.all(bDates);
            } else {
                res = bPromise.resolve();
            }
            return res;
        });
}


//---------//
// Exports //
//---------//

module.exports = insertDates;
