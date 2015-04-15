'use strict';

//---------//
// Imports //
//---------//

var Type = require('../type')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var PGWrapper = nh.psqlWrapper.PGWrapper
    , Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function DALType(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALType constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALType.getTypeFromRow = function getTypeFromRow(row) {
    return new Type()
        .TypeID(row.weather_data_type_id)
        .Name(row.weather_data_type_name);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALType.prototype.getTypeFromID = function getTypeFromID(aTypeID) {
    if (typeof aTypeID !== 'string') {
        throw new Error("Invalid Argument: <DALType>.getTypeFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_type wdt \
		where wdt.weather_data_type_id = $1 \
	";

    var queryValues = [
        aTypeID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALType.getTypeFromRow(res.rows[0]);
        });
};

DALType.prototype.getTypeFromName = function getTypeFromName(aTypeName) {
    if (typeof aTypeName !== 'string') {
        throw new Error("Invalid Argument: <DALType>.getTypeFromName requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_data_type wdt \
		where wdt.weather_data_type_name = $1 \
	";

    var queryValues = [
        aTypeName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALType.getTypeFromRow(res.rows[0]);
        });
};

DALType.prototype.getAllTypes = function getAllTypes() {
    var queryText = "select * from weather_data_type";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALType.getTypeFromRow(row);
                });
        });
};

DALType.prototype.getClientOptionTypes = function getAllTypes() {
    var queryText = "\
		select * \
		from weather_data_type \
		where weather_data_type_name <> 'actual' \
	";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALType.getTypeFromRow(row);
                });
        });
};

DALType.prototype.insert = function insert(aType) {
    if (!Utils.instance_of(aType, Type)) {
        throw new Error("Invalid Argument: <DALType>.insert requires instance_of Type");
    }

    var queryText = "\
		insert into weather_data_type (weather_data_type_name) \
		values ($1) \
		returning weather_data_type_id \
	";

    var queryValues = [
        aType.Name()
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return aType.TypeID(res.rows[0].weather_data_type_id);
        });
};

DALType.prototype.deleteByID = function deleteByID(aTypeID, shouldDeleteSingle) {
    if (typeof aTypeID !== 'string') {
        throw new Error("Invalid Argument: <DALType>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_type \
		where weather_data_type_id = $1 \
	";

    var queryValues = [
        aTypeID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALType>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALType.prototype.deleteByName = function deleteByName(aTypeName, shouldDeleteSingle) {
    if (typeof aTypeName !== 'string') {
        throw new Error("Invalid Argument: <DALType>.deleteByName requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_data_type \
		where weather_data_type_name = $1 \
	";

    var queryValues = [
        aTypeName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALType>.deleteByName expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALType;
