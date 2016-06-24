'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , moment = require('moment')
    , DALymd = require('../../db/models/dal/ymd')
    , insertDates = require('../../services/insert-dates')
    , bPromise = require('bluebird')
    , confs = require('../../utils/pg-confs');


//------//
// Init //
//------//

var assert = chai.assert;

bPromise.longStackTraces();
chai.config.includeStack = true;


//------//
// Main //
//------//

var pgWrapInst = confs.mocha.GeneratePGWrapper();
var dalYmdInst = new DALymd(pgWrapInst);

test("main", function main() {
    var initialMoment = moment(0, 'H').subtract(1, 'day');
    var expectedMoments = [
        initialMoment
        , moment(0, 'H').add(1, 'day')
        , moment(0, 'H').add(2, 'days')
        , moment(0, 'H').add(3, 'days')
        , moment(0, 'H').add(4, 'days')
        , moment(0, 'H').add(5, 'days')
    ];

    return insertDates(pgWrapInst)
        .then(function() {
            return dalYmdInst.getYmdsFromDate(initialMoment.format('YYYYMMDD'));
        })
        .then(function(lazyYmds) {
            var ymdArray = lazyYmds.sort(function(left, right) {
                return left.Value() - right.Value();
            }).toArray();

            for (var i = 0; i < 6; i++) {
                assert.strictEqual(ymdArray[i].Value(), expectedMoments[i].format('YYYYMMDD'));
            }
            return lazyYmds;
        })
        .then(function(lazyYmds) {
            var deletedYmds = lazyYmds
                .map(function(aYmd) {
                    return dalYmdInst.deleteByID(aYmd.YMDid(), true);
                })
                .toArray();

            return bPromise.all(deletedYmds);
        });
});
