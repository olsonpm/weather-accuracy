'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , Type = require('../../models/extensions/type')
    , DALType = require('../../models/dal/type')
    , bPromise = require('bluebird')
    , devConf = require('../../../utils/pg-confs').dev;


//------//
// Init //
//------//

var assert = chai.assert;

bPromise.longStackTraces();
chai.config.includeStack = true;


//------//
// Main //
//------//

suite("DALType", function() {
    var dalTypeInst = new DALType(devConf.GeneratePGWrapper());

    test("getAllTypes", function getAllTypes() {
        return dalTypeInst.getAllTypes()
            .then(function(allTypes) {
                allTypes = allTypes.toArray();
                assert.strictEqual(allTypes[0].Name(), 'actual');
                assert.strictEqual(allTypes[1].Name(), 'forecast_1_day_out');
                assert.strictEqual(allTypes[2].Name(), 'forecast_2_days_out');
                assert.strictEqual(allTypes[3].Name(), 'forecast_3_days_out');
                assert.strictEqual(allTypes[4].Name(), 'forecast_4_days_out');
                assert.strictEqual(allTypes[5].Name(), 'forecast_5_days_out');
                assert.strictEqual(allTypes[0].TypeID(), '1');
                assert.strictEqual(allTypes[1].TypeID(), '2');
                assert.strictEqual(allTypes[2].TypeID(), '3');
                assert.strictEqual(allTypes[3].TypeID(), '4');
                assert.strictEqual(allTypes[4].TypeID(), '5');
                assert.strictEqual(allTypes[5].TypeID(), '6');
            });
    });
    test("getTypeFromID", function getTypeFromID() {
        var t1 = dalTypeInst.getTypeFromID('1')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '1');
                assert.strictEqual(aType.Name(), 'actual');
            });

        var t2 = dalTypeInst.getTypeFromID('2')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '2');
                assert.strictEqual(aType.Name(), 'forecast_1_day_out');
            });

        var t3 = dalTypeInst.getTypeFromID('3')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '3');
                assert.strictEqual(aType.Name(), 'forecast_2_days_out');
            });

        var t4 = dalTypeInst.getTypeFromID('4')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '4');
                assert.strictEqual(aType.Name(), 'forecast_3_days_out');
            });

        var t5 = dalTypeInst.getTypeFromID('5')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '5');
                assert.strictEqual(aType.Name(), 'forecast_4_days_out');
            });

        var t6 = dalTypeInst.getTypeFromID('6')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '6');
                assert.strictEqual(aType.Name(), 'forecast_5_days_out');
            });

        return bPromise.join(t1, t2, t3, t4, t5, t6);
    });
    test("getTypeFromName", function getTypeFromID() {
        var t1 = dalTypeInst.getTypeFromName('actual')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '1');
                assert.strictEqual(aType.Name(), 'actual');
            });

        var t2 = dalTypeInst.getTypeFromName('forecast_1_day_out')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '2');
                assert.strictEqual(aType.Name(), 'forecast_1_day_out');
            });

        var t3 = dalTypeInst.getTypeFromName('forecast_2_days_out')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '3');
                assert.strictEqual(aType.Name(), 'forecast_2_days_out');
            });

        var t4 = dalTypeInst.getTypeFromName('forecast_3_days_out')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '4');
                assert.strictEqual(aType.Name(), 'forecast_3_days_out');
            });

        var t5 = dalTypeInst.getTypeFromName('forecast_4_days_out')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '5');
                assert.strictEqual(aType.Name(), 'forecast_4_days_out');
            });

        var t6 = dalTypeInst.getTypeFromName('forecast_5_days_out')
            .then(function(aType) {
                assert.strictEqual(aType.TypeID(), '6');
                assert.strictEqual(aType.Name(), 'forecast_5_days_out');
            });

        return bPromise.all([t1, t2, t3, t4, t5, t6]);
    });

    test("insert", function insert() {
        return dalTypeInst.insert((new Type()).Name('forecast_6_days_out'))
            .then(function(aType) {
                assert.isAbove(aType.TypeID(), 6);
            });
    });

    test("deleteByName", function deleteByName() {
        return dalTypeInst.deleteByName('forecast_6_days_out', true);
    });

    test("deleteByID", function deleteByID() {
        return dalTypeInst.insert((new Type()).Name('forecast_7_days_out'))
            .then(function(aType) {
                return dalTypeInst.deleteByID(aType.TypeID(), true);
            });
    });
});
