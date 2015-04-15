'use strict';

//---------//
// Imports //
//---------//

var YMD = require('../extensions/ymd')
    , nh = require('node-helpers')
    , moment = require('moment');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function DALymd(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALymd constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALymd.getYmdFromRow = function getYmdFromRow(row) {
    return new YMD()
        .YMDid(row.weather_date_id)
        .Value(row.weather_date_value);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALymd.prototype.getAllYMDs = function getAllYMDs() {
    var queryText = "select * from weather_date";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALymd.getYmdFromRow(row);
                });
        });
};

DALymd.prototype.getYmdsFromDate = function getYmdsFromDate(aDate) {
    if (Utils.instance_of(aDate, Date)) {
        aDate = moment(aDate).format('YYYYMMDD');
    }

    if (YMD.ValidateValue(aDate)) {
        throw new Error("Invalid Argument: <DALymd>.getYmdsFromDate requires either a typeof string in the format (YYYYMMDD) or an instance_of Date");
    }

    var queryText = "\
		select * \
		from weather_date wd \
		where wd.weather_date_value >= $1 \
	";

    var queryValues = [
        aDate
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALymd.getYmdFromRow(row);
                });
        });
};

DALymd.prototype.getYmdFromID = function getYmdFromID(aYmdID) {
    if (typeof aYmdID !== 'string') {
        throw new Error("Invalid Argument: <DALymd>.getYmdFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_date wd \
		where wd.weather_date_id = $1 \
	";

    var queryValues = [
        aYmdID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALymd.getYmdFromRow(res.rows[0]);
        });
};

DALymd.prototype.getYmdFromValue = function getYmdFromValue(aYmdValue) {
    if (typeof aYmdValue !== 'string') {
        throw new Error("Invalid Argument: <DALymd>.getYmdFromValue requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_date wd \
		where wd.weather_date_value = $1 \
	";

    var queryValues = [
        aYmdValue
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALymd.getYmdFromRow(res.rows[0]);
        });
};

DALymd.prototype.getYmdRangeWithFullData = function getYmdRangeWithFullData() {
    var queryText = "\
		select min(wda.weather_date_value) as min\
			, max(wda.weather_date_value) as max\
		from weather_date wda \
		where ( \
				select count(*) \
				from weather_data_type \
			) * ( \
				select count(*) \
				from weather_source \
			) * ( \
				select count(*) \
				from weather_location \
			) = ( \
				select count(*) \
				from weather_data wd \
				where wd.weather_data_date_id = wda.weather_date_id \
			) \
	";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            var min = new YMD().Value(res.rows[0].min);
            var max = new YMD().Value(res.rows[0].max);
            return {
                min: min
                , max: max
            };
        });
};

DALymd.prototype.insert = function insert(aYMD) {
    if (!Utils.instance_of(aYMD, YMD)) {
        throw new Error("Invalid Argument: <DALymd>.insert requires instance_of YMD");
    }

    var queryText = "\
		insert into weather_date (weather_date_value) \
		values ($1) \
		returning weather_date_id \
	";

    var queryValues = [
        aYMD.Value()
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return aYMD.YMDid(res.rows[0].weather_date_id);
        });
};

DALymd.prototype.deleteByID = function deleteByID(aYmdID, shouldDeleteSingle) {
    if (typeof aYmdID !== 'string') {
        throw new Error("Invalid Argument: <DALymd>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_date \
		where weather_date_id = $1 \
	";

    var queryValues = [
        aYmdID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALymd>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALymd.prototype.deleteByValue = function deleteByValue(aYmdValue, shouldDeleteSingle) {
    if (typeof aYmdValue !== 'string') {
        throw new Error("Invalid Argument: <DALymd>.deleteByValue requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_date \
		where weather_date_value = $1 \
	";

    var queryValues = [
        aYmdValue
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALymd>.deleteByValue expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALymd;
