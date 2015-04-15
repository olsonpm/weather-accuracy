'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , chai = require('chai')
    , Location = require('../../models/extensions/location')
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

suite("DALLocation", function() {
    var dalLocationInst = new DALLocation(devConf.GeneratePGWrapper());

    var CONST_LOCATIONS = [
        new Location().LocationID('1').Latitude('37.935758').Longitude('-122.347749').Name('Richmond, CA')
        , new Location().LocationID('2').Latitude('41.878114').Longitude('-87.629798').Name('Chicago, IL')
        , new Location().LocationID('3').Latitude('40.712784').Longitude('-74.005941').Name('New York, NY')
        , new Location().Latitude('30.2500').Longitude('97.7500').Name('Austin, TX')
    ];

    test("getAllLocations", function getAllLocations() {
        return dalLocationInst.getAllLocations()
            .then(function(lazyLocations) {
                var locationArray = lazyLocations.toArray();
                for (var i = 0; i < 3; i++) {
                    assert.strictEqual(locationArray[i].LocationID(), CONST_LOCATIONS[i].LocationID());
                    assert.strictEqual(locationArray[i].Latitude(), CONST_LOCATIONS[i].Latitude());
                    assert.strictEqual(locationArray[i].Longitude(), CONST_LOCATIONS[i].Longitude());
                    assert.strictEqual(locationArray[i].Name(), CONST_LOCATIONS[i].Name());
                }
            });
    });

    test("getLocationFromID", function getLocationFromID() {
        var bLocations = [];
        for (var i = 0; i < 3; i++) {
            bLocations.push(
                bPromise.join(
                    dalLocationInst.getLocationFromID('' + (i + 1))
                    , i
                )
                .then(function(res) {
                    assert.strictEqual(res[0].LocationID(), CONST_LOCATIONS[res[1]].LocationID());
                    assert.strictEqual(res[0].Latitude(), CONST_LOCATIONS[res[1]].Latitude());
                    assert.strictEqual(res[0].Longitude(), CONST_LOCATIONS[res[1]].Longitude());
                    assert.strictEqual(res[0].Name(), CONST_LOCATIONS[res[1]].Name());
                })
            );
        }

        return bPromise.all(bLocations);
    });

    test("getLocationFromLatLong", function getLocationFromLatLong() {
        var bLocations = [];
        for (var i = 0; i < 3; i++) {
            bLocations.push(
                bPromise.join(
                    dalLocationInst.getLocationFromLatLong(CONST_LOCATIONS[i])
                    , i
                )
                .then(function(res, i) {
                    assert.strictEqual(res[0].LocationID(), CONST_LOCATIONS[res[1]].LocationID());
                    assert.strictEqual(res[0].Latitude(), CONST_LOCATIONS[res[1]].Latitude());
                    assert.strictEqual(res[0].Longitude(), CONST_LOCATIONS[res[1]].Longitude());
                    assert.strictEqual(res[0].Name(), CONST_LOCATIONS[res[1]].Name());
                })
            );
        }

        return bPromise.all(bLocations);
    });

    test("insert", function insert() {
        return dalLocationInst.insert(CONST_LOCATIONS[3])
            .then(function(aLocation) {
                assert.isAbove(aLocation.LocationID(), 3);
            });
    });

    test("deleteByLatLong", function deleteByLatLong() {
        return dalLocationInst.deleteByLatLong(CONST_LOCATIONS[3].Latitude(), CONST_LOCATIONS[3].Longitude(), true);
    });

    test("deleteByID", function deleteByID() {
        return dalLocationInst.insert(CONST_LOCATIONS[3])
            .then(function(aLocation) {
                return dalLocationInst.deleteByID(aLocation.LocationID(), true);
            });
    });

});
