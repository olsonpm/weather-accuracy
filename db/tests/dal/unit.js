'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , Unit = require('../../models/extensions/unit')
    , DALUnit = require('../../models/dal/unit')
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

suite("DALUnit", function() {
    var dalUnitInst = new DALUnit(devConf.GeneratePGWrapper());
    var CONST_UNITS = [
        new Unit().UnitID('1').Name('celsius')
        , new Unit().UnitID('2').Name('kilometers_per_hour')
        , new Unit().Name('miles_per_hour')
    ];

    test("getAllUnits", function getAllUnits() {
        return dalUnitInst.getAllUnits()
            .then(function(lazyUnits) {
                var unitArray = lazyUnits.toArray();
                for (var i = 0; i < 2; i++) {
                    assert.strictEqual(unitArray[i].UnitID(), CONST_UNITS[i].UnitID());
                    assert.strictEqual(unitArray[i].Name(), CONST_UNITS[i].Name());
                }
            });
    });

    test("getUnitFromID", function getUnitFromID() {
        var bUnits = [];

        for (var i = 0; i < 2; i++) {
            bUnits.push(
                bPromise.join(
                    dalUnitInst.getUnitFromID(CONST_UNITS[i].UnitID())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].UnitID(), CONST_UNITS[res[1]].UnitID());
                    assert.strictEqual(res[0].Name(), CONST_UNITS[res[1]].Name());
                })
            );
        }

        return bPromise.all(bUnits);
    });

    test("getUnitFromName", function getUnitFromName() {
        var bUnits = [];

        for (var i = 0; i < 2; i++) {
            bUnits.push(
                bPromise.join(
                    dalUnitInst.getUnitFromName(CONST_UNITS[i].Name())
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].UnitID(), CONST_UNITS[res[1]].UnitID());
                    assert.strictEqual(res[0].Name(), CONST_UNITS[res[1]].Name());
                })
            );
        }

        return bPromise.all(bUnits);
    });

    test("insert", function insert() {
        return dalUnitInst.insert(CONST_UNITS[2])
            .then(function(aUnit) {
                assert.isAbove(aUnit.UnitID(), 2);
            });
    });

    test("deleteByName", function deleteByName() {
        return dalUnitInst.deleteByName(CONST_UNITS[2].Name(), true);
    });

    test("deleteByID", function deleteByID() {
        return dalUnitInst.insert(CONST_UNITS[2])
            .then(function(aUnit) {
                return dalUnitInst.deleteByID(aUnit.UnitID(), true);
            });
    });

});
