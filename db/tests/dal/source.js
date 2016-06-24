'use strict';
/* --execute=mocha-- */


//---------//
// Imports //
//---------//

var chai = require('chai')
    , Source = require('../../models/extensions/source')
    , DALSource = require('../../models/dal/source')
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

suite("DALSource", function() {
    var dalSourceInst = new DALSource(devConf.GeneratePGWrapper());

    test("getAllSources", function getAllTypes() {
        return dalSourceInst.getAllSources()
            .then(function(lazySources) {
                var srcArray = lazySources.toArray();
                assert.strictEqual(srcArray[0].Name(), Source.NAMES.WUNDERGROUND);
                assert.strictEqual(srcArray[1].Name(), Source.NAMES.HAM);
                assert.strictEqual(srcArray[2].Name(), Source.NAMES.FIO);

                assert.strictEqual(srcArray[0].SourceID(), '1');
                assert.strictEqual(srcArray[1].SourceID(), '2');
                assert.strictEqual(srcArray[2].SourceID(), '3');
            });
    });

    test("getSourceFromID", function getSourceFromID() {
        var s1 = dalSourceInst.getSourceFromID('1')
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.WUNDERGROUND);
                assert.strictEqual(res.SourceID(), '1');
            });
        var s2 = dalSourceInst.getSourceFromID('2')
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.HAM);
                assert.strictEqual(res.SourceID(), '2');
            });
        var s3 = dalSourceInst.getSourceFromID('3')
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.FIO);
                assert.strictEqual(res.SourceID(), '3');
            });

        return bPromise.join(s1, s2, s3);
    });

    test("getSourceFromName", function getSourceFromName() {
        var s1 = dalSourceInst.getSourceFromName(Source.NAMES.WUNDERGROUND)
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.WUNDERGROUND);
                assert.strictEqual(res.SourceID(), '1');
            });
        var s2 = dalSourceInst.getSourceFromName(Source.NAMES.HAM)
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.HAM);
                assert.strictEqual(res.SourceID(), '2');
            });
        var s3 = dalSourceInst.getSourceFromName(Source.NAMES.FIO)
            .then(function(res) {
                assert.strictEqual(res.Name(), Source.NAMES.FIO);
                assert.strictEqual(res.SourceID(), '3');
            });

        return bPromise.join(s1, s2, s3);
    });

    test("insert", function insert() {
        return dalSourceInst.insert((new Source()).Name('new_source_1'))
            .then(function(aSource) {
                assert.isAbove(aSource.SourceID(), 3);
            });
    });

    test("deleteByName", function deleteByName() {
        return dalSourceInst.deleteByName('new_source_1', true);
    });

    test("deleteByID", function deleteByID() {
        return dalSourceInst.insert((new Source()).Name('new_source_2'))
            .then(function(aSource) {
                return dalSourceInst.deleteByID(aSource.SourceID(), true);
            });
    });

});
