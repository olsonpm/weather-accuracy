'use strict';
/* --execute=node-- */

var _ = require('lodash')
    , bPromise = require('bluebird')
    , confs = require('../../utils/pg-confs')
    , bFs = require('fs-bluebird')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var devWrapperInst = confs.dev.GeneratePGWrapper();
var Utils = nh.utils;


//------//
// Main //
//------//

bPromise.join(
        bGetDateIds(devWrapperInst)
        , bGetSourceIds(devWrapperInst)
        , bGetLocationIds(devWrapperInst)
        , bGetDataTypeIds(devWrapperInst)
        , bFs.readFileAsync('./weather-data.erb')
        , runTemplate
    )
    .then(function() {
        console.log('weather-data finished');
    })
    .finally(function() {
        devWrapperInst.end();
    });

//-----------//
// Helpers   //
//-----------//

function bGetDateIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_date_id from weather_date')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return aRow.weather_date_id;
            });
        });
}

function bGetSourceIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_source_id from weather_source')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return aRow.weather_source_id;
            });
        });
}

function bGetLocationIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_location_id from weather_location')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return aRow.weather_location_id;
            });
        });
}

function bGetDataTypeIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_data_type_id from weather_data_type')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return aRow.weather_data_type_id;
            });
        });
}

function runTemplate(dateIds, sourceIds, locationIds, dataTypeIds, templateBuf) {
    var dataVals = Utils.everyCombinationOf(
        dataTypeIds
        , sourceIds
        , dateIds
        , locationIds
    );
    var res = _.template(templateBuf.toString(), {
        imports: {
            'dataVals': dataVals
        }
    })();

    return bFs.writeFileAsync('../test-data/weather_data.sql', res);
}
