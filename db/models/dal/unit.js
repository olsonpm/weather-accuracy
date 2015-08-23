'use strict';

//---------//
// Imports //
//---------//

var PGWrapper = require('pgwrapper')
    , Unit = require('../unit')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function DALUnit(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALUnit constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALUnit.getUnitFromRow = function getUnitFromRow(row) {
    return new Unit()
        .UnitID(row.weather_data_point_unit_id)
        .Name(row.weather_data_point_unit_name);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALUnit.prototype.getUnitFromID = function getUnitFromID(aUnitID) {
    if (typeof aUnitID !== 'string') {
        throw new Error("Invalid Argument: <DALUnit>.getUnitFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_point_unit ws \
		where ws.weather_data_point_unit_id = $1 \
	";

    var queryValues = [
        aUnitID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALUnit.getUnitFromRow(res.rows[0]);
        });
};

DALUnit.prototype.getUnitFromName = function getUnitFromName(aUnitName) {
    if (typeof aUnitName !== 'string') {
        throw new Error("Invalid Argument: <DALUnit>.getUnitFromName requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_point_unit ws \
		where ws.weather_data_point_unit_name = $1 \
	";

    var queryValues = [
        aUnitName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALUnit.getUnitFromRow(res.rows[0]);
        });
};

DALUnit.prototype.getAllUnits = function getAllUnits() {
    var queryText = "select * from weather_data_point_unit";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALUnit.getUnitFromRow(row);
                });
        });
};

DALUnit.prototype.insert = function insert(aUnit) {
    if (!Utils.instance_of(aUnit, Unit)) {
        throw new Error("Invalid Argument: <DALUnit>.insert requires instance_of Unit");
    }

    var queryText = "\
		insert into weather_data_point_unit (weather_data_point_unit_name) \
		values ($1) \
		returning weather_data_point_unit_id \
	";

    var queryValues = [
        aUnit.Name()
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return aUnit.UnitID(res.rows[0].weather_data_point_unit_id);
        });
};

DALUnit.prototype.deleteByID = function deleteByID(aUnitID, shouldDeleteSingle) {
    if (typeof aUnitID !== 'string') {
        throw new Error("Invalid Argument: <DALUnit>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_point_unit \
		where weather_data_point_unit_id = $1 \
	";

    var queryValues = [
        aUnitID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALUnit>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALUnit.prototype.deleteByName = function deleteByName(aUnitName, shouldDeleteSingle) {
    if (typeof aUnitName !== 'string') {
        throw new Error("Invalid Argument: <DALUnit>.deleteByName requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_point_unit \
		where weather_data_point_unit_name = $1 \
	";

    var queryValues = [
        aUnitName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALUnit>.deleteByName expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALUnit;
