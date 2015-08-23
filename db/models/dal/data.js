'use strict';


//---------//
// Imports //
//---------//

var PGWrapper = require('pgwrapper')
    , DataPoint = require('../extensions/data-point')
    , YMD = require('../extensions/ymd')
    , Source = require('../extensions/source')
    , nh = require('node-helpers')
    , moment = require('moment')
    , bPromise = require('bluebird');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions
    , Data = require('../extensions/data')
    , DALType = require('./type')
    , DALSource = require('./source')
    , DALymd = require('./ymd')
    , DALLocation = require('./location');


//-------//
// Main	 //
//-------//

function DALData(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALDataPoint constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;

    this.dalTypeInstance = new DALType(aPGWrapper);
    this.dalSourceInstance = new DALSource(aPGWrapper);
    this.dalYMDInstance = new DALymd(aPGWrapper);
    this.dalLocationInstance = new DALLocation(aPGWrapper);
}


//-------------------//
// Static Extensions //
//-------------------//

DALData.getDataFromRow = function getDataFromRow(row) {
    return new Data()
        .DataID(row.weather_data_id)
        .Type(DALType.getTypeFromRow(row))
        .Source(DALSource.getSourceFromRow(row))
        .YMD(DALymd.getYmdFromRow(row))
        .Location(DALLocation.getLocationFromRow(row));
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALData.prototype.getDataFromID = function getDataFromID(aDataID) {
    if (typeof aDataID !== 'string') {
        throw new Error("Invalid Argument: <DALData>.getDataFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data wd \
			join weather_data_type wdt \
				on wd.weather_data_type_id = wdt.weather_data_type_id \
			join weather_source wds \
				on wd.weather_data_source_id = wds.weather_source_id \
			join weather_date wda \
				on wd.weather_data_date_id = wda.weather_date_id \
			join weather_location wl \
				on wd.weather_data_location_id = wl.weather_location_id \
		where wd.weather_data_id = $1 \
	";

    var queryValues = [
        aDataID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALData.getDataFromRow(res.rows[0]);
        });
};

DALData.prototype.getDataBetweenDates = function getDataBetweenDates(date1, date2) {
    if (Utils.instance_of(date1, Date)) {
        date1 = moment(date1).format('YYYYMMDD');
    }
    if (Utils.instance_of(date2, Date)) {
        date2 = moment(date2).format('YYYYMMDD');
    }

    if (YMD.ValidateValue(date1) || YMD.ValidateValue(date2)) {
        throw new Error("Invalid Argument: <DALData>.getDataBetweenDates requires two arguments that are either typeof string in the format (YYYYMMDD) or an instance_of date");
    }

    var queryText = "\
		select * \
		from weather_data wd \
			join weather_data_type wdt \
				on wd.weather_data_type_id = wdt.weather_data_type_id \
			join weather_source wds \
				on wd.weather_data_source_id = wds.weather_source_id \
			join weather_date wda \
				on wd.weather_data_date_id = wda.weather_date_id \
			join weather_location wl \
				on wd.weather_data_location_id = wl.weather_location_id \
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
                    return DALData.getDataFromRow(row);
                });
        });
};

DALData.prototype.getDataBetweenDatesFromSource = function getDataBetweenDatesFromSource(date1, date2, aSource) {
    if (Utils.instance_of(date1, Date)) {
        date1 = moment(date1).format('YYYYMMDD');
    }
    if (Utils.instance_of(date2, Date)) {
        date2 = moment(date2).format('YYYYMMDD');
    }

    if (YMD.ValidateValue(date1) || YMD.ValidateValue(date2)) {
        throw new Error("Invalid Argument: <DALData>.getDataBetweenDatesFromSource requires the first two arguments be either typeof string in the format (YYYYMMDD) or an instance_of date");
    }

    if (Utils.instance_of(aSource, Source)) {
        aSource = aSource.SourceID();
    }
    if (typeof aSource !== 'string') {
        throw new Error("Invalid Argument: <DALData>.getDataBetweenDatesFromSource requires the third argument be either typeof string or an instance_of Source");
    }

    var queryText = "\
		select * \
		from weather_data wd \
			join weather_data_type wdt \
				on wd.weather_data_type_id = wdt.weather_data_type_id \
			join weather_source wds \
				on wd.weather_data_source_id = wds.weather_source_id \
			join weather_date wda \
				on wd.weather_data_date_id = wda.weather_date_id \
			join weather_location wl \
				on wd.weather_data_location_id = wl.weather_location_id \
		where wda.weather_date_value between $1 and $2 \
			and wd.weather_data_source_id = $3 \
	";

    var queryValues = [
        date1
        , date2
        , aSource
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALData.getDataFromRow(row);
                });
        });
};

DALData.prototype.insert = function insert(aData) {
    var self = this;

    if (!Utils.instance_of(aData, Data)) {
        throw new Error("Invalid Argument: <DALData>.insert requires instance_of Data");
    }

    var bInsertedType
        , bInsertedSource
        , bInsertedYMD
        , bInsertedLocation;

    bInsertedType = (aData.Type().TypeID() === null)
        ? self.dalTypeInstance.insert(aData.Type())
        : bPromise.resolve(aData.Type());

    bInsertedSource = (aData.Source().SourceID() === null)
        ? self.dalSourceInstance.insert(aData.Source())
        : bPromise.resolve(aData.Source());

    bInsertedYMD = (aData.YMD().YMDid() === null)
        ? self.dalYMDInstance.insert(aData.YMD())
        : bPromise.resolve(aData.YMD());

    bInsertedLocation = (aData.Location().LocationID() === null)
        ? self.dalLocationInstance.insert(aData.Location())
        : bPromise.resolve(aData.Location());

    return bPromise.resolve([
            bInsertedType
            , bInsertedSource
            , bInsertedYMD
            , bInsertedLocation
            , aData
        ])
        .spread(function(resType, resSource, resYMD, resLocation, resData) {
            resData.Type(resType)
                .Source(resSource)
                .YMD(resYMD)
                .Location(resLocation);

            var queryText = "\
				insert into weather_data (weather_data_type_id, weather_data_source_id, weather_data_date_id, weather_data_location_id) \
				values ($1, $2, $3, $4) \
				returning weather_data_id \
			";

            var queryValues = [
                resType.TypeID()
                , resSource.SourceID()
                , resYMD.YMDid()
                , resLocation.LocationID()
            ];

            return [
                self.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
                , resData
            ];
        })
        .spread(function(resInsert, resData) {
            return resData.DataID(resInsert.rows[0].weather_data_id);
        });
};

DALData.prototype.deleteByID = function deleteByID(aDataID, shouldDeleteSingle) {
    if (typeof aDataID !== 'string') {
        throw new Error("Invalid Argument: <DALData>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data \
		where weather_data_id = $1 \
	";

    var queryValues = [
        aDataID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALData>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALData;
