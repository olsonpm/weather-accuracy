'use strict';


//---------//
// Imports //
//---------//

var GatherWundergroundData = require('./gather-data/weather-underground.js')
    , GatherHamData = require('./gather-data/ham-weather.js')
    , GatherFioData = require('./gather-data/forecast-io.js')
    , bPromise = require('bluebird')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;
bPromise.longStackTraces();


//------//
// Main //
//------//

function gatherAllData(pgWrapInst, envInst) {
    var gatherWundInst = new GatherWundergroundData(pgWrapInst);
    var gatherHamInst = new GatherHamData(pgWrapInst);
    var gatherFioInst = new GatherFioData(pgWrapInst);

    return bPromise.all([
            gatherWundInst.bInit()
            , gatherHamInst.bInit()
            , gatherFioInst.bInit()
        ])
        .then(function() {
            var allLocations = gatherWundInst.lazyLocations;
            return [
                gatherWundInst.downloadThenInsertData(allLocations, envInst)
                , gatherHamInst.downloadThenInsertData(allLocations, envInst)
                , gatherFioInst.downloadThenInsertData(allLocations, envInst)
            ];
        })
        .spread(function(resWund, resHam, resFio) {
            var rejected = lazy(resWund).concat(resHam, resFio).find(function(p) {
                return p.isRejected();
            });
            if (rejected) {
                throw new Error("rejected: " + rejected.reason());
            }
        });
}



//---------//
// Exports //
//---------//

module.exports = gatherAllData;
