'use strict';

//---------//
// Imports //
//---------//

var PGWrapper = require('pgwrapper')
    , Location = require('../location')
    , nh = require('node-helpers')
    , bPromise = require('bluebird');


//------//
// Init //
//------//

var Utils = nh.utils
    , lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function DALLocation(aPGWrapper) {
    if (!Utils.instance_of(aPGWrapper, PGWrapper)) {
        throw new Error("Invalid Argument: DALLocation constructor expects an instance_of PGWrapper");
    }
    this.pgWrapperInstance = aPGWrapper;
}


//-------------------//
// Static Extensions //
//-------------------//

DALLocation.getLocationFromRow = function getLocationFromRow(row) {
    return new Location()
        .LocationID(row.weather_location_id)
        .Latitude(row.weather_location_latitude)
        .Longitude(row.weather_location_longitude)
        .Name(row.weather_location_name)
        .TZ(row.weather_location_tz);
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

DALLocation.prototype.getLocationFromID = function getLocationFromID(aLocationID) {
    if (typeof aLocationID !== 'string') {
        throw new Error("Invalid Argument: <DALLocation>.getLocationFromID requires a typeof string argument");
    }

    var queryText = "\
		select * \
		from weather_location wl \
		where wl.weather_location_id = $1 \
	";

    var queryValues = [
        aLocationID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALLocation.getLocationFromRow(res.rows[0]);
        });
};

DALLocation.prototype.getLocationFromLatLong = function getLocationFromLatLong(aLatitude, aLongitude) {
    var lat, long;

    // if more than one argument, then both lat and long were passed
    if (arguments.length > 1) {
        if (typeof aLatitude !== 'string' || typeof aLongitude !== 'string') {
            throw new Error("Invalid Argument(s): <DALLocation>.getLocationFromLatLong requires two typeof string arguments or an instance_of Location");
        }
        lat = aLatitude;
        long = aLongitude;
    } else { // otherwise a Location object should have been passed in
        if (!Utils.instance_of(aLatitude, Location)) {
            throw new Error("Invalid Argument(s): <DALLocation>.getLocationFromLatLong requires two typeof string arguments or an instance_of Location");
        }
        lat = aLatitude.Latitude();
        long = aLatitude.Longitude();
    }

    var queryText = "\
		select * \
		from weather_location wl \
		where wl.weather_location_latitude = $1 \
			and wl.weather_location_longitude = $2 \
	";

    var queryValues = [
        lat
        , long
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            return DALLocation.getLocationFromRow(res.rows[0]);
        });
};

DALLocation.prototype.getAllLocations = function getAllLocations() {
    var queryText = "select * from weather_location";

    return this.pgWrapperInstance.RunQuery(queryText)
        .then(function(res) {
            return lazy(res.rows)
                .map(function(row) {
                    return DALLocation.getLocationFromRow(row);
                });
        });
};

DALLocation.prototype.insert = function insert(aLocation) {
    if (!Utils.instance_of(aLocation, Location)) {
        throw new Error("Invalid Argument: <DALLocation>.insert requires instance_of Location");
    }

    var queryText = "\
		insert into weather_location (weather_location_latitude, weather_location_longitude, weather_location_name, weather_location_tz) \
		values ($1, $2, $3, $4) \
		returning weather_location_id \
	";

    var queryValues = [
        aLocation.Latitude()
        , aLocation.Longitude()
        , aLocation.Name()
        , aLocation.TZ()
    ];

    return bPromise.resolve([
            this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
            , aLocation
        ])
        .spread(function(resInsert, resLocation) {
            return resLocation.LocationID(resInsert.rows[0].weather_location_id);
        });
};

DALLocation.prototype.deleteByID = function deleteByID(aLocationID, shouldDeleteSingle) {
    if (typeof aLocationID !== 'string') {
        throw new Error("Invalid Argument: <DALLocation>.deleteByID requires a typeof string argument");
    }

    var queryText = "\
		delete from weather_location \
		where weather_location_id = $1 \
	";

    var queryValues = [
        aLocationID
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALLocation>.deleteByID expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};

DALLocation.prototype.deleteByLatLong = function deleteByLatLong(aLatitude, aLongitude, shouldDeleteSingle) {
    var lat, long;

    // if more than one argument, then both lat and long were passed
    if (typeof aLatitude === 'string' && typeof aLongitude === 'string') {
        if (typeof aLatitude !== 'string' || typeof aLongitude !== 'string') {
            throw new Error("Invalid Argument(s): <DALLocation>.deleteByLatLong requires two typeof string arguments or an instance_of Location");
        }
        lat = aLatitude;
        long = aLongitude;
    } else { // otherwise a Location object should have been passed in
        if (!Utils.instance_of(aLatitude, Location)) {
            throw new Error("Invalid Argument(s): <DALLocation>.deleteByLatLong requires two typeof string arguments or an instance_of Location");
        }
        lat = aLatitude.Latitude();
        long = aLatitude.Longitude();
    }

    var queryText = "\
		delete from weather_location \
		where weather_location_latitude = $1 \
			and weather_location_longitude = $2 \
	";

    var queryValues = [
        lat
        , long
    ];

    return this.pgWrapperInstance.RunParameterizedQuery(queryText, queryValues)
        .then(function(res) {
            if (shouldDeleteSingle && res.rowCount !== 1) {
                throw new Error("Invalid Argument: <DALLocation>.deleteByLatLong expected to delete a single record.  Instead '" + res.rowCount + "' were deleted");
            }
        });
};


//---------//
// Exports //
//---------//

module.exports = DALLocation;
