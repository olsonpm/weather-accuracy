'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , chai = require('chai')
    , moment = require('moment')
    , YMD = require('../../models/extensions/ymd')
    , DALymd = require('../../models/dal/ymd')
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

suite("DALymd", function() {
    var dalYMDInst = new DALymd(devConf.GeneratePGWrapper());

    test("getAllYMDs", function getAllYMDs() {
        return dalYMDInst.getAllYMDs()
            .then(function(lazyYMDs) {
                var ymdArray = lazyYMDs.toArray();
                assert.strictEqual(ymdArray[0].YMDid(), '1');
                assert.strictEqual(ymdArray[1].YMDid(), '2');
                assert.strictEqual(ymdArray[2].YMDid(), '3');
                assert.strictEqual(ymdArray[3].YMDid(), '4');
                assert.strictEqual(ymdArray[4].YMDid(), '5');
                assert.strictEqual(ymdArray[5].YMDid(), '6');

                assert.strictEqual(ymdArray[0].Value(), '20150101');
                assert.strictEqual(ymdArray[1].Value(), '20150102');
                assert.strictEqual(ymdArray[2].Value(), '20150103');
                assert.strictEqual(ymdArray[3].Value(), '20150104');
                assert.strictEqual(ymdArray[4].Value(), '20150105');
                assert.strictEqual(ymdArray[5].Value(), '20150106');
            });
    });

    test("getYmdsFromDate", function getYmdsFromDate() {
        return dalYMDInst.getYmdsFromDate('20150102')
            .then(function(lazyYMDs) {
                var ymdArray = lazyYMDs.toArray();

                assert.strictEqual(ymdArray[0].YMDid(), '2');
                assert.strictEqual(ymdArray[1].YMDid(), '3');
                assert.strictEqual(ymdArray[2].YMDid(), '4');
                assert.strictEqual(ymdArray[3].YMDid(), '5');
                assert.strictEqual(ymdArray[4].YMDid(), '6');

                assert.strictEqual(ymdArray[0].Value(), '20150102');
                assert.strictEqual(ymdArray[1].Value(), '20150103');
                assert.strictEqual(ymdArray[2].Value(), '20150104');
                assert.strictEqual(ymdArray[3].Value(), '20150105');
                assert.strictEqual(ymdArray[4].Value(), '20150106');
            });
    });

    test("getYMDFromID", function getYMDFromID() {
        var d1 = dalYMDInst.getYmdFromID('1')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150101');
                assert.strictEqual(res.YMDid(), '1');
            });
        var d2 = dalYMDInst.getYmdFromID('2')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150102');
                assert.strictEqual(res.YMDid(), '2');
            });
        var d3 = dalYMDInst.getYmdFromID('3')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150103');
                assert.strictEqual(res.YMDid(), '3');
            });
        var d4 = dalYMDInst.getYmdFromID('4')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150104');
                assert.strictEqual(res.YMDid(), '4');
            });
        var d5 = dalYMDInst.getYmdFromID('5')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150105');
                assert.strictEqual(res.YMDid(), '5');
            });
        var d6 = dalYMDInst.getYmdFromID('6')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150106');
                assert.strictEqual(res.YMDid(), '6');
            });

        return bPromise.join(d1, d2, d3, d4, d5, d6);
    });

    test("getYMDFromValue", function getYMDFromValue() {
        var d1 = dalYMDInst.getYmdFromValue('20150101')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150101');
                assert.strictEqual(res.YMDid(), '1');
            });
        var d2 = dalYMDInst.getYmdFromValue('20150102')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150102');
                assert.strictEqual(res.YMDid(), '2');
            });
        var d3 = dalYMDInst.getYmdFromValue('20150103')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150103');
                assert.strictEqual(res.YMDid(), '3');
            });
        var d4 = dalYMDInst.getYmdFromValue('20150104')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150104');
                assert.strictEqual(res.YMDid(), '4');
            });
        var d5 = dalYMDInst.getYmdFromValue('20150105')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150105');
                assert.strictEqual(res.YMDid(), '5');
            });
        var d6 = dalYMDInst.getYmdFromValue('20150106')
            .then(function(res) {
                assert.strictEqual(res.Value(), '20150106');
                assert.strictEqual(res.YMDid(), '6');
            });

        return bPromise.join(d1, d2, d3, d4, d5, d6);
    });

    test("insert", function insert() {
        return dalYMDInst.insert((new YMD()).Value('20150107'))
            .then(function(aYMD) {
                assert.isAbove(aYMD.YMDid(), 6);
            });
    });

    test("deleteByValue", function deleteByValue() {
        return dalYMDInst.deleteByValue('20150107', true);
    });

    test("deleteByID", function deleteByID() {
        return dalYMDInst.insert((new YMD()).Value('20150107'))
            .then(function(aYMD) {
                return dalYMDInst.deleteByID(aYMD.YMDid(), true);
            });
    });

});
