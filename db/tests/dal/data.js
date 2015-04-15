'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , chai = require('chai')
    , Data = require('../../models/extensions/data')
    , Type = require('../../models/extensions/type')
    , Source = require('../../models/extensions/source')
    , YMD = require('../../models/extensions/ymd')
    , Location = require('../../models/extensions/location')
    , DALData = require('../../models/dal/data')
    , DALLocation = require('../../models/dal/location')
    , bPromise = require('bluebird')
    , devConf = require('../../../utils/pg-confs').dev;


//------//
// Init //
//------//

var lazy = nh.lazyExtensions
    , PGConf = nh.psqlWrapper.PGConf
    , assert = chai.assert;

bPromise.longStackTraces();
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("DALData", function() {
    var pgWrapperInst = devConf.GeneratePGWrapper();
    var dalDataInst = new DALData(pgWrapperInst);
    var dalLocationInst = new DALLocation(pgWrapperInst);

    var CONST_DATA = [
        new Data().DataID('1').Type(new Type().TypeID('1')).Source(new Source().SourceID('1')).YMD(new YMD().YMDid('1')).Location(new Location().LocationID('1'))
        , new Data().DataID('2').Type(new Type().TypeID('1')).Source(new Source().SourceID('1')).YMD(new YMD().YMDid('1')).Location(new Location().LocationID('2'))
        , new Data().DataID('3').Type(new Type().TypeID('1')).Source(new Source().SourceID('1')).YMD(new YMD().YMDid('1')).Location(new Location().LocationID('3'))
        , new Data().Type(new Type().TypeID('1')).Source(new Source().SourceID('1')).YMD(new YMD().YMDid('1'))
    ];

    var CONST_LOCATION = new Location().LocationID('4').Latitude('30.2500').Longitude('-97.7500').Name('Austin, TX');

    test("getDataBetweenDates", function getDataBetweenDates() {
        return dalDataInst.getDataBetweenDates('20150101', '20150106')
            .then(function(lazyData) {
                assert.strictEqual(lazyData.length(), 324);
            });
    });

    test("getDataBetweenDatesFromSource", function getDataBetweenDatesFromSource() {
        return dalDataInst.getDataBetweenDatesFromSource('20150101', '20150106', new Source().SourceID('1'))
            .then(function(lazyData) {
                assert.strictEqual(lazyData.length(), 108);
            });
    });

    test("getDataFromID", function getDataFromID() {
        var bData = [];

        for (var i = 0; i < 3; i++) {
            bData.push(
                bPromise.join(
                    dalDataInst.getDataFromID(CONST_DATA[i].DataID())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].DataID(), CONST_DATA[res[1]].DataID());
                    assert.strictEqual(res[0].Type().TypeID(), CONST_DATA[res[1]].Type().TypeID());
                    assert.strictEqual(res[0].Source().SourceID(), CONST_DATA[res[1]].Source().SourceID());
                    assert.strictEqual(res[0].YMD().YMDid(), CONST_DATA[res[1]].YMD().YMDid());
                    assert.strictEqual(res[0].Location().LocationID(), CONST_DATA[res[1]].Location().LocationID());
                })
            );
        }

        return bPromise.all(bData);
    });

    test("insert then deleteByID", function insert_then_deleteByID() {
        return dalLocationInst.insert(CONST_LOCATION)
            .then(function(aLocation) {
                return dalDataInst.insert(CONST_DATA[3].Location(aLocation));
            })
            .then(function(aData) {
                assert.isAbove(aData.DataID(), 324);
                return dalDataInst.deleteByID(aData.DataID());
            })
            .then(function() {
                return dalLocationInst.deleteByLatLong(CONST_LOCATION);
            });
    });

});
