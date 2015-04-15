'use strict';

//---------//
// Imports //
//---------//

var Source = require('../source')
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

function DALSource(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALSource constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALSource.getSourceFromRow = function getSourceFromRow(row) {
    return new Source()
        .SourceID(row.weather_source_id)
        .Name(row.weather_source_name);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALSource.prototype.getSourceFromID = function getSourceFromID(aSourceID) {
    if (typeof aSourceID !== 'string') {
        throw new Error("Invalid Argument: <DALSource>.getSourceFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_source ws \
		where ws.weather_source_id = $1 \
	";

    var queryValues = [
        aSourceID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALSource.getSourceFromRow(res.rows[0]);
        });
};

DALSource.prototype.getSourceFromName = function getSourceFromName(aSourceName) {
    if (typeof aSourceName !== 'string') {
        throw new Error("Invalid Argument: <DALSource>.getSourceFromName requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_source ws \
		where ws.weather_source_name = $1 \
	";

    var queryValues = [
        aSourceName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALSource.getSourceFromRow(res.rows[0]);
        });
};

DALSource.prototype.getAllSources = function getAllSources() {
    var queryText = "select * from weather_source";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALSource.getSourceFromRow(row);
                });
        });
};

DALSource.prototype.insert = function insert(aSource) {
    if (!Utils.instance_of(aSource, Source)) {
        throw new Error("Invalid Argument: <DALSource>.insert requires instance_of Source");
    }

    var queryText = "\
		insert into weather_source (weather_source_name) \
		values ($1) \
		returning weather_source_id \
	";

    var queryValues = [
        aSource.Name()
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return aSource.SourceID(res.rows[0].weather_source_id);
        });
};

DALSource.prototype.deleteByID = function deleteByID(aSourceID, shouldDeleteSingle) {
    if (typeof aSourceID !== 'string') {
        throw new Error("Invalid Argument: <DALSource>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_source \
		where weather_source_id = $1 \
	";

    var queryValues = [
        aSourceID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALSource>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALSource.prototype.deleteByName = function deleteByName(aSourceName, shouldDeleteSingle) {
    if (typeof aSourceName !== 'string') {
        throw new Error("Invalid Argument: <DALSource>.deleteByName requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_source \
		where weather_source_name = $1 \
	";

    var queryValues = [
        aSourceName
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALSource>.deleteByName expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALSource;
