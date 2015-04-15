'use strict';

//---------//
// Imports //
//---------//

var DataPoint = require('../extensions/data-point')
    , YMD = require('../extensions/ymd')
    , DALData = require('./data')
    , DALMeasurementName = require('./measurement-name')
    , bPromise = require('bluebird')
    , moment = require('moment')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------//
// Main	 //
//-------//

function DALDataPoint(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALDataPoint constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
    this.dalDataInstance = new DALData(aPGWrapper);
    this.dalMeasurementNameInstance = new DALMeasurementName(aPGWrapper);
}


//-------------------//
// Static Extensions //
//-------------------//

DALDataPoint.getDataPointFromRow = function getDataPointFromRow(row) {
    return new DataPoint()
        .DataPointID(row.weather_data_point_id)
        .Data(DALData.getDataFromRow(row))
        .Value(row.weather_data_point_value)
        .MeasurementName(DALMeasurementName.getMeasurementNameFromRow(row));
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALDataPoint.prototype.getDataPointFromID = function getDataPointFromID(aDataPointID) {
    if (typeof aDataPointID !== 'string') {
        throw new Error("Invalid Argument: <DALDataPoint>.getDataPointFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_point wdp \
			join weather_data wd \
				on wdp.weather_data_point_data_id = wd.weather_data_id \
			join weather_data_point_name wdn \
				on wdp.weather_data_point_name_id = wdn.weather_data_point_name_id \
			\
			/* the following joins are weather_data dependencies */ \
			join weather_data_type wdt \
				on wd.weather_data_type_id = wdt.weather_data_type_id \
			join weather_source ws \
				on wd.weather_data_source_id = ws.weather_source_id \
			join weather_date wda \
				on wd.weather_data_date_id = wda.weather_date_id \
			join weather_location wl \
				on wd.weather_data_location_id = wl.weather_location_id \
			\
			/* the following joins are weather_data_point_name dependencies */ \
			join weather_data_point_unit wdu \
				on wdn.weather_data_point_name_unit_id = wdu.weather_data_point_unit_id \
			\
		where wdp.weather_data_point_id = $1 \
	";

    var queryValues = [
        aDataPointID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALDataPoint.getDataPointFromRow(res.rows[0]);
        });
};

DALDataPoint.prototype.getDataPointsBetweenDates = function getDataPointsBetweenDates(date1, date2) {
    if (Utils.instance_of(date1, Date)) {
        date1 = moment(date1).format('YYYYMMDD');
    }
    if (Utils.instance_of(date2, Date)) {
        date2 = moment(date2).format('YYYYMMDD');
    }

    if (YMD.ValidateValue(date1) || YMD.ValidateValue(date2)) {
        throw new Error("Invalid Argument: <DALDataPoint>.getDataPointsBetweenDates requires two arguments that are either typeof string in the format (YYYYMMDD) or instance_of date");
    }

    var queryText = "\
		select * \
		from weather_data_point wdp \
			join weather_data wd \
				on wdp.weather_data_point_data_id = wd.weather_data_id \
			join weather_data_point_name wdn \
				on wdp.weather_data_point_name_id = wdn.weather_data_point_name_id \
			\
			/* the following joins are weather_data dependencies */ \
			join weather_data_type wdt \
				on wd.weather_data_type_id = wdt.weather_data_type_id \
			join weather_source ws \
				on wd.weather_data_source_id = ws.weather_source_id \
			join weather_date wda \
				on wd.weather_data_date_id = wda.weather_date_id \
			join weather_location wl \
				on wd.weather_data_location_id = wl.weather_location_id \
			\
			/* the following joins are weather_data_point_name dependencies */ \
			join weather_data_point_unit wdu \
				on wdn.weather_data_point_name_unit_id = wdu.weather_data_point_unit_id \
			\
		where wda.weather_date_value between $1 and $2 \
	";

    var queryValues = [
        date1
        , date2
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALDataPoint.getDataPointFromRow(row);
                });
        });
};

DALDataPoint.prototype.insert = function insert(aDataPoint) {
    var self = this;

    if (!Utils.instance_of(aDataPoint, DataPoint)) {
        throw new Error("Invalid Argument: <DALDataPoint>.insert requires instance_of DataPoint");
    }

    var bInsertedData
        , bInsertedMeasurementName;

    bInsertedData = (aDataPoint.Data().DataID() === null)
        ? self.dalDataInstance.insert(aDataPoint.Data())
        : bPromise.resolve(aDataPoint.Data());

    bInsertedMeasurementName = (aDataPoint.MeasurementName().MeasurementNameID() === null)
        ? self.dalMeasurementNameInstance.insert(aDataPoint.MeasurementName())
        : bPromise.resolve(aDataPoint.MeasurementName());

    return bPromise.resolve([
            bInsertedData
            , bInsertedMeasurementName
            , aDataPoint
        ])
        .spread(function(resData, resMeasurementName, resDataPoint) {
            resDataPoint.Data(resData)
                .MeasurementName(resMeasurementName);

            var queryText = "\
				insert into weather_data_point (weather_data_point_data_id, weather_data_point_value, weather_data_point_name_id) \
				values ($1, $2, $3) \
				returning weather_data_point_id \
			";

            var queryValues = [
                resData.DataID()
                , resDataPoint.Value()
                , resMeasurementName.MeasurementNameID()
            ];

            return [
                self.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
                , resDataPoint
            ];
        })
        .spread(function(resInsert, resDataPoint) {
            return resDataPoint.DataPointID(resInsert.rows[0].weather_data_point_id);
        });
};

DALDataPoint.prototype.deleteByID = function deleteByID(aDataPointID) {
    if (typeof aDataPointID !== 'string') {
        throw new Error("Invalid Argument: <DALDataPoint>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_point \
		where weather_data_point_id = $1 \
	";

    var queryValues = [
        aDataPointID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALDataPoint>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALDataPoint;
