'use strict';
/* --execute=node-- */


//---------//
// Imports //
//---------//

var _ = require('lodash')
    , bPromise = require('bluebird')
    , confs = require('../../utils/pg-confs')
    , bFs = require('fs-bluebird');


//------//
// Init //
//------//

var devWrapperInst = confs.dev.GeneratePGWrapper();


//------//
// Main //
//------//

bPromise.join(
        bGetDataIds(devWrapperInst)
        , bGetMeasurementNameIds(devWrapperInst)
        , bFs.readFileAsync('./weather-data-point.erb')
        , runTemplate
    )
    .then(function() {
        console.log('weather-data-point finished');
    })
    .finally(function() {
        devWrapperInst.end();
    });


//---------//
// Helpers //
//---------//

function bGetDataIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_data_id, weather_data_location_id from weather_data')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return {
                    dataId: aRow.weather_data_id
                    , locationID: aRow.weather_data_location_id
                };
            });
        });
}

function bGetMeasurementNameIds(aPGWrapper) {
    return aPGWrapper.RunQuery('select weather_data_point_name_id from weather_data_point_name')
        .then(function(res) {
            return res.rows.map(function(aRow) {
                return aRow.weather_data_point_name_id;
            });
        });
}

function runTemplate(dataAndLocationIDs, measurementNameIds, templateBuf) {
    var res = _.template(templateBuf.toString(), {
        imports: {
            'dataAndLocationIDs': dataAndLocationIDs
            , 'measurementNameIds': measurementNameIds
        }
    })();

    return bFs.writeFileAsync('../test-data/weather_data_point.sql', res);
}
