'use strict';

//---------//
// Imports //
//---------//

var MeasurementName = require('../measurement-name')
    , DALUnit = require('./unit')
    , nh = require('node-helpers')
    , bPromise = require('bluebird');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function DALMeasurementName(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALMeasurementName constructor requires an instance_of PGWrapper");
    }
    this.dalUnitInstance = new DALUnit(aPGWrapper);
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALMeasurementName.getMeasurementNameFromRow = function getMeasurementNameFromRow(row) {
    return new MeasurementName()
        .MeasurementNameID(row.weather_data_point_name_id)
        .Unit(DALUnit.getUnitFromRow(row))
        .Value(row.weather_data_point_name_value);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALMeasurementName.prototype.getMeasurementNameFromID = function getMeasurementNameFromID(aMeasurementNameID) {
    if (typeof aMeasurementNameID !== 'string') {
        throw new Error("Invalid Argument: <DALMeasurementName>.getMeasurementNameFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_point_name wdn \
			join weather_data_point_unit wdu \
				on wdn.weather_data_point_name_unit_id = wdu.weather_data_point_unit_id \
		where wdn.weather_data_point_name_id = $1 \
	";

    var queryValues = [
        aMeasurementNameID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALMeasurementName.getMeasurementNameFromRow(res.rows[0]);
        });
};

DALMeasurementName.prototype.getMeasurementNameFromValue = function getMeasurementNameFromValue(aMeasurementNameValue) {
    if (typeof aMeasurementNameValue !== 'string') {
        throw new Error("Invalid Argument: <DALMeasurementName>.getMeasurementNameFromValue requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_point_name wdn \
			join weather_data_point_unit wdu \
				on wdn.weather_data_point_name_unit_id = wdu.weather_data_point_unit_id \
		where wdn.weather_data_point_name_value = $1 \
	";

    var queryValues = [
        aMeasurementNameValue
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALMeasurementName.getMeasurementNameFromRow(res.rows[0]);
        });
};

DALMeasurementName.prototype.getAllMeasurementNames = function getAllMeasurementNames() {
    var queryText = "\
		select * \
		from weather_data_point_name wdn \
			join weather_data_point_unit wdu \
				on wdn.weather_data_point_name_unit_id = wdu.weather_data_point_unit_id \
	";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALMeasurementName.getMeasurementNameFromRow(row);
                });
        });
};

DALMeasurementName.prototype.insert = function insert(aMeasurementName) {
    var self = this;

    if (!Utils.instance_of(aMeasurementName, MeasurementName)) {
        throw new Error("Invalid Argument: <DALMeasurementName>.insert requires instance_of MeasurementName");
    }

    var bInsertedUnit = (aMeasurementName.Unit().UnitID() === null)
        ? this.dalUnitInstance.insert(aMeasurementName.Unit())
        : bPromise.resolve(aMeasurementName.Unit());

    return bInsertedUnit
        .then(function(resUnit) {
            aMeasurementName.Unit(resUnit);

            var queryText = "\
				insert into weather_data_point_name (weather_data_point_name_value, weather_data_point_name_unit_id) \
				values ($1, $2) \
				returning weather_data_point_name_id \
			";

            var queryValues = [
                aMeasurementName.Value()
                , resUnit.UnitID()
            ];

            return self.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues);
        })
        .then(function(res) {
            return aMeasurementName.MeasurementNameID(res.rows[0].weather_data_point_name_id);
        });
};

DALMeasurementName.prototype.deleteByID = function deleteByID(aMeasurementNameID, shouldDeleteSingle) {
    if (typeof aMeasurementNameID !== 'string') {
        throw new Error("Invalid Argument: <DALMeasurementName>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_point_name \
		where weather_data_point_name_id = $1 \
	";

    var queryValues = [
        aMeasurementNameID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALMeasurementName>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALMeasurementName.prototype.deleteByValue = function deleteByValue(aMeasurementNameValue, shouldDeleteSingle) {
    if (typeof aMeasurementNameValue !== 'string') {
        throw new Error("Invalid Argument: <DALMeasurementName>.deleteByValue requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_point_name \
		where weather_data_point_name_value = $1 \
	";

    var queryValues = [
        aMeasurementNameValue
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALMeasurementName>.deleteByName expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALMeasurementName;
